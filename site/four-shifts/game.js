import {
  BLOCKED_RECTS,
  CASHIER_STAFF_ZONE,
  KITCHEN_BLOCKED_RECTS,
  KITCHEN_POINTS,
  KITCHEN_WALKABLE_AREA,
  POINTS,
  QUEUE_PROTECTED_ZONE,
  SAVE_KEY,
  TABLES,
  WAITING_QUEUE_POINTS,
  WALKABLE_AREAS,
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
  validateScene,
  waiterSpeed,
} from "./game-rules.mjs?v=20260825-4";

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
  debug: document.querySelector("[data-debug]"),
  sceneReport: document.querySelector("[data-scene-report]"),
  sceneReportOutput: document.querySelector("[data-scene-report-output]"),
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
let debugVisible = false;
const spriteMetrics = new Map();
const metricCanvas = document.createElement("canvas");
const metricContext = metricCanvas.getContext("2d", { willReadFrequently: true });
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

function toggleDebugOverlay() {
  debugVisible = !debugVisible;
  elements.debug.setAttribute("aria-pressed", String(debugVisible));
  elements.debug.textContent = debugVisible ? "關閉檢查" : "場景檢查";
  elements.sceneReport.hidden = !debugVisible;
  if (debugVisible) updateSceneReport();
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
  if (debugVisible) updateSceneReport();
}

function updateSceneReport() {
  const report = validateScene(state);
  elements.sceneReport.dataset.result = report.status;
  const lines = [
    `${report.status} — ${report.passed}/${report.total} 項通過`,
    report.failures.length ? "" : "所有互動點、腳底座標、路徑與下一格預約均合法。",
  ];
  for (const failure of report.failures) {
    const coordinate = failure.coordinate ? `(${Math.round(failure.coordinate.x)}, ${Math.round(failure.coordinate.y)})` : "—";
    lines.push(`FAIL｜${failure.name}｜座標 ${coordinate}｜角色 ${failure.actor}｜物件 ${failure.object}｜建議 ${failure.suggestion}`);
  }
  elements.sceneReportOutput.textContent = lines.filter((line, index) => line || index === 1).join("\n");
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

  for (const actor of [
    { kind: "chef", ...state.kitchen.chef },
    { kind: "drinkChef", ...state.kitchen.drinkChef },
  ].sort((first, second) => first.y - second.y)) drawActor(actor);
  redrawKitchenFront();

  for (const customer of state.customers.filter((item) => item.seated).sort((first, second) => first.y - second.y)) {
    drawActor({ kind: "customer", ...customer });
  }
  for (const table of TABLES.slice(0, state.upgrades.tables)) redrawTableTop(table);

  const femaleAtCashier = inside(state.waiters.female, CASHIER_STAFF_ZONE);
  if (femaleAtCashier) {
    drawActor({ kind: "femaleWaiter", ...state.waiters.female });
    redrawCashierFront();
  }

  const publicActors = [
    { kind: "maleWaiter", ...state.waiters.male },
    ...(!femaleAtCashier ? [{ kind: "femaleWaiter", ...state.waiters.female }] : []),
    ...state.customers.filter((customer) => !customer.seated).map((customer) => ({ kind: "customer", ...customer })),
  ].sort((first, second) => first.y - second.y);
  for (const actor of publicActors) drawActor(actor);
  drawDirtyTables();
  drawCustomerBubbles();
  if (debugVisible) drawDebugOverlay();
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

function drawActor(actor) {
  if (actor.kind === "chef") {
    const frames = { cooking: 2, prepping: 1, toPickup: 3 };
    const frame = frames[state.kitchen.phase] ?? 0;
    const next = actor.path?.[0];
    drawAtlas(frame, 1, actor.x, actor.y, 88, next ? next.x < actor.x : false);
    return;
  }

  if (actor.kind === "drinkChef") {
    const frames = { mixing: 2, toPickup: 3 };
    const frame = frames[state.kitchen.drinkPhase] ?? 0;
    const next = actor.path?.[0];
    drawAtlas(frame, 1, actor.x, actor.y, 82, next ? next.x < actor.x : true);
    return;
  }

  const next = actor.path?.[0];
  const facingLeft = next ? next.x < actor.x : false;
  const moving = Boolean(actor.walking && actor.path?.length);
  const bob = moving ? Math.sin(state.elapsed * 12) * 2 : 0;

  if (actor.kind === "maleWaiter") {
    const carrying = actor.task?.type === "deliver" && actor.task.phase === "table";
    const frame = carrying ? 3 : moving ? 1 + Math.floor(state.elapsed * 7) % 2 : 0;
    drawAtlas(frame, 0, actor.x, actor.y + bob, 80, facingLeft);
    return;
  }

  if (actor.kind === "femaleWaiter") {
    const carrying = actor.task?.type === "drink" && actor.task.phase === "toTable";
    const frame = carrying ? 3 : moving ? 1 + Math.floor(state.elapsed * 7) % 2 : 0;
    drawFemaleWaiter(frame, actor.x, actor.y + bob, 80, facingLeft);
    return;
  }

  const seated = Boolean(actor.seated);
  const frame = seated ? 3 : moving ? 1 + actor.walkFrame : 0;
  const seatFacingLeft = seated && actor.direction === "left";
  drawAtlas(frame, actor.variant ? 3 : 2, actor.x, actor.y + bob, seated ? 90 : 82, seated ? seatFacingLeft : facingLeft);
}

function drawFemaleWaiter(column, x, y, size, flip) {
  drawSpriteFrame(femaleWaiterImage, column, 0, x, y, size, flip);
}

function drawAtlas(column, row, x, y, size, flip = false) {
  drawSpriteFrame(atlasImage, column, row, x, y, size, flip);
}

function drawSpriteFrame(image, column, row, x, y, size, flip) {
  const cell = 256;
  const metric = spriteMetric(image, column, row);
  const scale = size / cell;
  context.save();
  context.translate(Math.round(x), Math.round(y));
  if (flip) context.scale(-1, 1);
  context.drawImage(image, column * cell, row * cell, cell, cell, -metric.centerX * scale, -metric.bottom * scale, size, size);
  context.restore();
}

function spriteMetric(image, column, row) {
  const key = `${image.src}:${column}:${row}`;
  if (spriteMetrics.has(key)) return spriteMetrics.get(key);
  const cell = 256;
  metricCanvas.width = cell;
  metricCanvas.height = cell;
  metricContext.clearRect(0, 0, cell, cell);
  metricContext.drawImage(image, column * cell, row * cell, cell, cell, 0, 0, cell, cell);
  const pixels = metricContext.getImageData(0, 0, cell, cell).data;
  let left = cell;
  let right = 0;
  let bottom = 0;
  for (let pixel = 0; pixel < cell * cell; pixel += 1) {
    if (pixels[pixel * 4 + 3] < 10) continue;
    const px = pixel % cell;
    const py = Math.floor(pixel / cell);
    left = Math.min(left, px);
    right = Math.max(right, px + 1);
    bottom = Math.max(bottom, py + 1);
  }
  const metric = { centerX: left < cell ? (left + right) / 2 : cell / 2, bottom: bottom || cell };
  spriteMetrics.set(key, metric);
  return metric;
}

function redrawTableTop(table) {
  const { x, y, w, h } = table.cover;
  context.drawImage(roomImage, x, y, w, h, x, y, w, h);
}

function redrawKitchenFront() {
  context.drawImage(roomImage, 0, 281, 460, 34, 0, 281, 460, 34);
}

function redrawCashierFront() {
  context.drawImage(roomImage, 220, 390, 145, 66, 220, 390, 145, 66);
}

function drawDebugOverlay() {
  context.save();
  context.font = "700 9px monospace";
  context.textBaseline = "bottom";
  fillDebugRects(WALKABLE_AREAS, "rgba(44, 190, 91, .18)", "#50df7d");
  fillDebugRects(BLOCKED_RECTS, "rgba(221, 55, 55, .22)", "#ff6666");
  fillDebugRects([KITCHEN_WALKABLE_AREA], "rgba(36, 174, 210, .24)", "#48d9f2");
  fillDebugRects([QUEUE_PROTECTED_ZONE], "rgba(199, 171, 48, .25)", "#f2d251");
  fillDebugRects([CASHIER_STAFF_ZONE], "rgba(82, 119, 228, .28)", "#8ba5ff");
  fillDebugRects(KITCHEN_BLOCKED_RECTS, "rgba(221, 55, 55, .28)", "#ff6666");

  for (const table of TABLES) {
    fillDebugRects([table.tableBodyArea], "rgba(255, 79, 79, .3)", "#ff6666");
    fillDebugRects([table.chairBlockedArea], "rgba(255, 153, 58, .32)", "#ffad5c");
    drawDebugPoint(table.seatApproachPoint, `T${table.id} approach`, "#ffe46a");
    drawDebugPoint(table.seatPoints[0], `T${table.id} seat`, "#62e7ff");
    drawDebugPoint(table.servicePoint, `T${table.id} service`, "#ff9ef2");
  }
  for (const [label, point, color] of [
    ["cashier customer", POINTS.checkoutCustomer, "#ffe46a"],
    ["cashier customer queue", POINTS.checkoutQueue, "#f2d251"],
    ["cashier staff", POINTS.cashierService, "#8ba5ff"],
    ["cashier staff entry", POINTS.cashierApproach, "#b6c5ff"],
    ["food kitchen", KITCHEN_POINTS.pickup, "#48d9f2"],
    ["food waiter", POINTS.pickupWaiter, "#ff9ef2"],
    ["drink kitchen", KITCHEN_POINTS.drinkPickup, "#48d9f2"],
    ["drink waiter", POINTS.drinkPickupWaiter, "#ff9ef2"],
    ["drink bar", KITCHEN_POINTS.drinkBar, "#62e7ff"],
  ]) drawDebugPoint(point, label, color);
  WAITING_QUEUE_POINTS.forEach((point, index) => drawDebugPoint(point, `queue ${index + 1}`, "#f2d251"));

  for (const reservation of state.reservations.values()) {
    context.fillStyle = "rgba(255, 255, 255, .25)";
    context.strokeStyle = "#ffffff";
    context.fillRect(reservation.x - 9, reservation.y - 9, 18, 18);
    context.strokeRect(reservation.x - 9, reservation.y - 9, 18, 18);
    context.fillStyle = "#ffffff";
    context.fillText(`next ${reservation.owner}`, reservation.x + 11, reservation.y - 3);
  }

  for (const actor of [
    [state.kitchen.chef, `chef ${state.kitchen.phase}`],
    [state.kitchen.drinkChef, `drink chef ${state.kitchen.drinkPhase}`],
    [state.waiters.male, `male ${state.waiters.male.task?.type || "idle"}`],
    [state.waiters.female, `female ${state.waiters.female.task?.type || "idle"}`],
    ...state.customers.map((customer) => [customer, `C${customer.id} ${customer.state}`]),
  ]) drawDebugAnchor(actor[0], actor[1]);
  context.restore();
}

function fillDebugRects(rects, fill, stroke) {
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  for (const rect of rects) {
    const width = (rect.right ?? rect.left) - rect.left;
    const height = (rect.bottom ?? rect.top) - rect.top;
    context.fillRect(rect.left, rect.top, width, height);
    context.strokeRect(rect.left + 0.5, rect.top + 0.5, width - 1, height - 1);
  }
}

function drawDebugPoint(point, label, color) {
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(point.x, point.y, 5, 0, Math.PI * 2);
  context.stroke();
  context.fillText(label, point.x + 7, point.y - 5);
}

function drawDebugAnchor(actor, label) {
  context.strokeStyle = "#ffffff";
  context.fillStyle = "#ffffff";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(actor.x - 6, actor.y);
  context.lineTo(actor.x + 6, actor.y);
  context.moveTo(actor.x, actor.y - 6);
  context.lineTo(actor.x, actor.y + 6);
  context.stroke();
  context.fillText(label, actor.x + 7, actor.y + 1);
}

function inside(point, rect) {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
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
    if (customer.state === "queueing" && !customer.walking && customer.path.length === 0 && customer.mood !== "normal") {
      drawWaitingMood(customer);
    }
  }
}

function drawWaitingMood(customer) {
  const x = customer.x + 24;
  const y = customer.y - 70;
  context.fillStyle = "#fff2d3";
  context.strokeStyle = "#17130f";
  context.lineWidth = 3;
  context.fillRect(x - 12, y - 12, 24, 21);
  context.strokeRect(x - 12, y - 12, 24, 21);
  if (customer.mood === "impatient") {
    context.fillStyle = "#628ca0";
    context.fillRect(x - 3, y - 5, 6, 9);
    context.fillRect(x - 1, y - 8, 2, 3);
  } else {
    context.fillStyle = "#a63e32";
    context.fillRect(x - 2, y - 7, 4, 9);
    context.fillRect(x - 2, y + 4, 4, 4);
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
elements.debug.addEventListener("click", toggleDebugOverlay);
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
