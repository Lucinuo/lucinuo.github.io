import {
  SAVE_KEY,
  TABLES,
  calculateOfflineIncome,
  chefSeconds,
  freshState,
  hydrateState,
  incomePerGuest,
  purchaseUpgrade,
  restaurantLevel,
  serializeState,
  tickGame,
  upgradeCost,
  waiterSpeed,
} from "./game-rules.mjs";

const canvas = document.querySelector("[data-canvas]");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;

const elements = {
  coins: document.querySelector("[data-coins]"),
  served: document.querySelector("[data-served]"),
  level: document.querySelector("[data-level]"),
  state: document.querySelector("[data-state]"),
  message: document.querySelector("[data-message]"),
  live: document.querySelector("[data-live]"),
  offline: document.querySelector("[data-offline]"),
  toggle: document.querySelector("[data-toggle]"),
  reset: document.querySelector("[data-reset]"),
  upgrades: [...document.querySelectorAll("[data-upgrade]")],
};

const images = {
  room: loadImage("./assets/pixel-restaurant.png"),
  atlas: loadImage("./assets/pixel-atlas.png"),
};

let state = loadState();
let roomImage;
let atlasImage;
let previousTime = performance.now();
let accumulator = 0;
let lastUiUpdate = 0;
let resetArmed = false;
let resetTimer;
saveState();

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${source}`));
    image.src = source;
  });
}

function readSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return null;
  }
}

function loadState() {
  const save = readSave();
  const offline = calculateOfflineIncome(save);
  const loaded = hydrateState(save);
  if (offline.amount > 0) {
    loaded.coins += offline.amount;
    const minutes = Math.max(1, Math.floor(offline.seconds / 60));
    loaded.message = `離開 ${minutes} 分鐘期間，小館帶回 ${offline.amount} 金幣。`;
    requestAnimationFrame(() => {
      elements.offline.hidden = false;
      elements.offline.textContent = `歡迎回來！離線營運 ${minutes} 分鐘，獲得 ${offline.amount} 金幣。`;
    });
  }
  return loaded;
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState(state)));
  } catch {
    state.message = "瀏覽器拒絕儲存進度；目前遊戲仍可繼續。";
  }
}

function toggleRestaurant() {
  state.running = !state.running;
  state.message = state.running ? "開始營業！客人會自動進店。" : "小館暫停營業，進度已保存。";
  saveState();
  updateUi();
}

function resetGame() {
  if (!resetArmed) {
    resetArmed = true;
    elements.reset.textContent = "再按一次重置";
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetArmed = false;
      elements.reset.textContent = "重置";
    }, 3_000);
    return;
  }
  resetArmed = false;
  clearTimeout(resetTimer);
  localStorage.removeItem(SAVE_KEY);
  state = freshState();
  elements.offline.hidden = true;
  elements.reset.textContent = "重置";
  updateUi();
}

function buyUpgrade(event) {
  const type = event.currentTarget.dataset.upgrade;
  if (!purchaseUpgrade(state, type)) {
    state.message = upgradeCost(type, state.upgrades) === null ? "餐桌已全部解鎖。" : "金幣還不夠，讓小館多服務幾位客人吧。";
  }
  saveState();
  updateUi();
}

function updateUi() {
  elements.coins.textContent = Math.floor(state.coins).toLocaleString("zh-TW");
  elements.served.textContent = state.served.toLocaleString("zh-TW");
  elements.level.textContent = restaurantLevel(state.upgrades);
  elements.state.textContent = state.running ? "營業中" : "休息中";
  elements.toggle.textContent = state.running ? "暫停營業" : state.served ? "繼續營業" : "開始營業";
  elements.message.textContent = state.message;

  const effects = {
    chef: `每餐 ${chefSeconds(state.upgrades.chef).toFixed(1)} 秒`,
    waiter: `移動 ${Math.round(waiterSpeed(state.upgrades.waiter))} px／秒`,
    tables: `同時接待 ${state.upgrades.tables} 位客人`,
    income: `每位客人 ${incomePerGuest(state.upgrades.income)} 金幣`,
  };
  for (const button of elements.upgrades) {
    const type = button.dataset.upgrade;
    const cost = upgradeCost(type, state.upgrades);
    button.querySelector(`[data-effect="${type}"]`).textContent = effects[type];
    button.querySelector(`[data-level="${type}"]`).textContent = type === "tables" ? `${state.upgrades.tables} 桌` : `Lv.${state.upgrades[type]}`;
    button.querySelector(`[data-cost="${type}"]`).textContent = cost === null ? "已滿級" : `● ${cost}`;
    button.disabled = cost === null || state.coins < cost;
  }

  const queue = state.customers.filter((customer) => customer.state === "queueing" || customer.state === "entering").length;
  const dining = state.customers.filter((customer) => ["ordering", "waitingFood", "eating"].includes(customer.state)).length;
  elements.live.textContent = `店內 ${state.customers.length} 位客人，${queue} 位等候，${dining} 位入座，已完成 ${state.served} 單。`;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!roomImage || !atlasImage) {
    context.fillStyle = "#35251c";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f3dfb5";
    context.font = "bold 24px sans-serif";
    context.fillText("像素小館載入中…", 360, 270);
    return;
  }

  context.drawImage(roomImage, 0, 0, canvas.width, canvas.height);
  drawLockedTables();
  drawKitchenStatus();

  const actors = [
    { kind: "chef", x: 325, y: 270 },
    { kind: "waiter", ...state.waiter },
    ...state.customers.map((customer) => ({ kind: "customer", ...customer })),
  ].sort((first, second) => first.y - second.y);

  for (const actor of actors) drawActor(actor);
  for (const table of TABLES.slice(0, state.upgrades.tables)) redrawTableTop(table);
  drawCustomerBubbles();
}

function drawLockedTables() {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 14px monospace";
  for (const table of TABLES.slice(state.upgrades.tables)) {
    context.fillStyle = "rgba(18, 15, 12, .72)";
    context.fillRect(table.cover.x - 38, table.cover.y - 16, table.cover.w + 76, table.cover.h + 96);
    context.fillStyle = "#f3dfb5";
    context.fillText("LOCKED", table.cover.x + table.cover.w / 2, table.cover.y + table.cover.h / 2 + 25);
  }
  context.restore();
}

function drawKitchenStatus() {
  if (!state.kitchen.active) return;
  const total = chefSeconds(state.upgrades.chef);
  const progress = Math.max(0, 1 - state.kitchen.timer / total);
  context.fillStyle = "#17130f";
  context.fillRect(242, 202, 142, 15);
  context.fillStyle = "#e6b43c";
  context.fillRect(245, 205, 136 * progress, 9);
}

function drawActor(actor) {
  if (actor.kind === "chef") {
    const frame = state.kitchen.active ? 1 + Math.floor(state.elapsed * 4) % 2 : 0;
    drawAtlas(frame, 1, actor.x, actor.y, 94, state.kitchen.active);
    return;
  }

  const next = actor.path?.[0];
  const facingLeft = next ? next.x < actor.x : false;
  const moving = Boolean(actor.walking && actor.path?.length);
  const bob = moving ? Math.sin(state.elapsed * 12) * 2 : 0;

  if (actor.kind === "waiter") {
    const carrying = actor.task?.type === "deliver" && actor.task.phase === "table";
    const frame = carrying ? 3 : moving ? 1 + Math.floor(state.elapsed * 7) % 2 : 0;
    drawAtlas(frame, 0, actor.x, actor.y + bob, 92, facingLeft);
    return;
  }

  const seated = ["ordering", "waitingFood", "eating"].includes(actor.state);
  const frame = seated ? 3 : moving ? 1 + actor.walkFrame : 0;
  drawAtlas(frame, actor.variant ? 3 : 2, actor.x, actor.y + bob, seated ? 94 : 88, facingLeft);
}

function drawAtlas(column, row, x, y, size, flip = false) {
  const cell = 256;
  context.save();
  context.translate(Math.round(x), Math.round(y));
  if (flip) context.scale(-1, 1);
  context.drawImage(atlasImage, column * cell, row * cell, cell, cell, -size / 2, -size, size, size);
  context.restore();
}

function redrawTableTop(table) {
  const { x, y, w, h } = table.cover;
  context.drawImage(roomImage, x, y, w, h, x, y, w, h);
}

function drawCustomerBubbles() {
  for (const customer of state.customers) {
    if (!["ordering", "waitingFood", "eating", "paying"].includes(customer.state)) continue;
    const labels = { ordering: "…", waitingFood: "⌛", eating: "●", paying: "$" };
    const x = customer.x + 28;
    const y = customer.y - 72;
    context.fillStyle = "#fff2d3";
    context.strokeStyle = "#17130f";
    context.lineWidth = 3;
    context.fillRect(x - 14, y - 14, 28, 25);
    context.strokeRect(x - 14, y - 14, 28, 25);
    context.fillStyle = customer.state === "eating" ? "#8c3f24" : "#245934";
    context.font = "900 16px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(labels[customer.state], x, y - 1);
  }
}

function frame(time) {
  const delta = Math.min(0.25, (time - previousTime) / 1_000);
  previousTime = time;
  accumulator += delta;
  while (accumulator >= 0.1) {
    tickGame(state, 0.1);
    accumulator -= 0.1;
  }
  draw();
  if (time - lastUiUpdate > 180) {
    updateUi();
    lastUiUpdate = time;
  }
  requestAnimationFrame(frame);
}

elements.toggle.addEventListener("click", toggleRestaurant);
elements.reset.addEventListener("click", resetGame);
elements.upgrades.forEach((button) => button.addEventListener("click", buyUpgrade));
window.addEventListener("pagehide", saveState);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveState();
});
setInterval(saveState, 5_000);

Promise.all([images.room, images.atlas])
  .then(([room, atlas]) => {
    roomImage = room;
    atlasImage = atlas;
    updateUi();
    requestAnimationFrame(frame);
  })
  .catch(() => {
    state.message = "遊戲圖像載入失敗，請重新整理頁面。";
    updateUi();
    requestAnimationFrame(frame);
  });
