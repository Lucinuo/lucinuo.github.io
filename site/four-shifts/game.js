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
  femaleWaiter: loadImage("./assets/female-waiter.png"),
};

let state = loadState();
let roomImage;
let atlasImage;
let femaleWaiterImage;
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
  const dining = state.customers.filter((customer) => ["waitingOrder", "ordering", "waitingFood", "eating"].includes(customer.state)).length;
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
  drawDrinksBar();
  drawLockedTables();
  drawKitchenStatus();

  const actors = [
    { kind: "chef", ...state.kitchen.chef },
    { kind: "maleWaiter", ...state.waiters.male },
    { kind: "femaleWaiter", ...state.waiters.female },
    ...state.customers.map((customer) => ({ kind: "customer", ...customer })),
  ].sort((first, second) => first.y - second.y);

  for (const actor of actors) drawActor(actor);
  for (const table of TABLES.slice(0, state.upgrades.tables)) redrawTableTop(table);
  drawDirtyTables();
  drawCustomerBubbles();
}

function drawDrinksBar() {
  context.save();
  context.fillStyle = "#17130f";
  context.fillRect(360, 326, 82, 92);
  context.fillStyle = "#274b35";
  context.fillRect(364, 330, 74, 84);
  context.fillStyle = "#d19a51";
  context.fillRect(360, 330, 82, 14);
  context.fillStyle = "#86512e";
  context.fillRect(368, 348, 66, 58);
  context.fillStyle = "#f3dfb5";
  context.fillRect(374, 355, 20, 20);
  context.fillStyle = "#30241d";
  context.fillRect(378, 359, 12, 12);
  context.fillStyle = "#d9e5dd";
  context.fillRect(405, 352, 8, 13);
  context.fillRect(418, 352, 8, 13);
  context.fillStyle = "#f0c85c";
  context.font = "900 10px monospace";
  context.textAlign = "center";
  context.fillText("DRINKS", 401, 397);
  context.fillStyle = "#fff2d3";
  context.fillRect(442, 254, 36, 18);
  context.fillStyle = "#245934";
  context.fillText("取餐", 460, 267);
  context.restore();
}

function drawLockedTables() {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 14px monospace";
  for (const table of TABLES.slice(state.upgrades.tables)) {
    const lock = table.lockRect;
    context.fillStyle = "rgba(18, 15, 12, .72)";
    context.fillRect(lock.x, lock.y, lock.w, lock.h);
    context.fillStyle = "#f3dfb5";
    context.fillText("LOCKED", lock.x + lock.w / 2, lock.y + lock.h / 2);
  }
  context.restore();
}

function drawKitchenStatus() {
  if (!state.kitchen.active || !["cooking", "prepping"].includes(state.kitchen.phase)) return;
  const ratio = state.kitchen.phase === "cooking" ? 0.6 : 0.4;
  const total = chefSeconds(state.upgrades.chef) * ratio;
  const progress = Math.max(0, 1 - state.kitchen.timer / total);
  context.fillStyle = "#17130f";
  context.fillRect(236, 286, 150, 15);
  context.fillStyle = "#e6b43c";
  context.fillRect(239, 289, 144 * Math.min(1, progress), 9);
}

function drawActor(actor) {
  if (actor.kind === "chef") {
    const frames = { cooking: 2, prepping: 1, toPickup: 3 };
    const frame = frames[state.kitchen.phase] ?? 0;
    const next = actor.path?.[0];
    drawAtlas(frame, 1, actor.x, actor.y, 88, next ? next.x < actor.x : false);
    return;
  }

  const next = actor.path?.[0];
  const facingLeft = next ? next.x < actor.x : false;
  const moving = Boolean(actor.walking && actor.path?.length);
  const bob = moving ? Math.sin(state.elapsed * 12) * 2 : 0;

  if (actor.kind === "maleWaiter") {
    const carrying = actor.task?.type === "deliver" && actor.task.phase === "table";
    const frame = carrying ? 3 : moving ? 1 + Math.floor(state.elapsed * 7) % 2 : 0;
    drawAtlas(frame, 0, actor.x, actor.y + bob, 86, facingLeft);
    return;
  }

  if (actor.kind === "femaleWaiter") {
    const carrying = actor.task?.type === "drink" && actor.task.phase === "toTable";
    const frame = carrying ? 3 : moving ? 1 + Math.floor(state.elapsed * 7) % 2 : 0;
    drawFemaleWaiter(frame, actor.x, actor.y + bob, 80, facingLeft);
    return;
  }

  const seated = ["waitingOrder", "ordering", "waitingFood", "eating"].includes(actor.state);
  const frame = seated ? 3 : moving ? 1 + actor.walkFrame : 0;
  const seatFacingLeft = seated && actor.direction === "left";
  drawAtlas(frame, actor.variant ? 3 : 2, actor.x, actor.y + bob, seated ? 90 : 82, seated ? seatFacingLeft : facingLeft);
}

function drawFemaleWaiter(column, x, y, size, flip) {
  const cell = 256;
  context.save();
  context.translate(Math.round(x), Math.round(y));
  if (flip) context.scale(-1, 1);
  context.drawImage(femaleWaiterImage, column * cell, 0, cell, cell, -size / 2, -size, size, size);
  context.restore();
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

function drawDirtyTables() {
  context.save();
  context.fillStyle = "#8c3f24";
  for (const tableState of state.tables.filter((table) => table.dirty)) {
    const table = TABLES[tableState.id - 1];
    context.fillRect(table.cover.x + 18, table.cover.y + 24, 5, 3);
    context.fillRect(table.cover.x + 43, table.cover.y + 35, 4, 3);
  }
  context.restore();
}

function drawCustomerBubbles() {
  for (const customer of state.customers) {
    if (!["waitingOrder", "ordering", "waitingFood", "eating", "waitingPayment"].includes(customer.state)) continue;
    const labels = { waitingOrder: "?", ordering: "…", waitingFood: "⌛", eating: "●", waitingPayment: "$" };
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

Promise.all([images.room, images.atlas, images.femaleWaiter])
  .then(([room, atlas, femaleWaiter]) => {
    roomImage = room;
    atlasImage = atlas;
    femaleWaiterImage = femaleWaiter;
    updateUi();
    requestAnimationFrame(frame);
  })
  .catch(() => {
    state.message = "遊戲圖像載入失敗，請重新整理頁面。";
    updateUi();
    requestAnimationFrame(frame);
  });
