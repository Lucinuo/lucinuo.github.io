import {
  BLOCKED_RECTS,
  CASHIER_STAFF_ZONE,
  FRONT_FACES,
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
} from "./game-rules.mjs?v=20260907-1";

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
  sound: document.querySelector("[data-sound]"),
  bgm: document.querySelector("[data-bgm]"),
  reset: document.querySelector("[data-reset]"),
  upgrades: [...document.querySelectorAll("[data-upgrade]")],
};

const images = {
  room: loadImage("./assets/pixel-restaurant-v2.png"),
  doorOpen: loadImage("./assets/pixel-restaurant-v2-door-open.png"),
  atlas: loadImage("./assets/pixel-atlas-v3.png?v=20260907-1"),
  femaleWaiter: loadImage("./assets/female-waiter-v3.png"),
};

let state = loadState();
window.__game_state__ = state;
let roomImage;
let doorOpenImage;
let atlasImage;
let femaleWaiterImage;
let previousTime = performance.now();
let accumulator = 0;
let lastUiUpdate = 0;
let resetArmed = false;
let resetTimer;
let debugVisible = false;
let soundEnabled = true;
const spriteMetrics = new Map();
const CELL_W = 48;
const CELL_H = 80;
const metricCanvas = document.createElement("canvas");
const metricContext = metricCanvas.getContext("2d", { willReadFrequently: true });
elements.bgm.volume = 0.25;
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
  syncMusic();
  saveState();
  updateUi();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  syncMusic();
  updateUi();
}

function syncMusic() {
  if (state.running && soundEnabled) elements.bgm.play().catch(() => {});
  else elements.bgm.pause();
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
  window.__game_state__ = state;
  syncMusic();
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
}
window.__toggleDebug = toggleDebugOverlay;

function updateUi() {
  elements.coins.textContent = Math.floor(state.coins).toLocaleString("zh-TW");
  elements.served.textContent = state.served.toLocaleString("zh-TW");
  elements.level.textContent = restaurantLevel(state.upgrades);
  elements.state.textContent = state.running ? "營業中" : "休息中";
  elements.toggle.textContent = state.running ? "暫停營業" : state.served ? "繼續營業" : "開始營業";
  elements.sound.textContent = soundEnabled ? "音樂：開" : "音樂：關";
  elements.sound.setAttribute("aria-pressed", String(soundEnabled));
  elements.sound.setAttribute("aria-label", soundEnabled ? "關閉背景音樂" : "播放背景音樂");
  elements.message.textContent = state.message;

  const effects = {
    chef: `每餐 ${chefSeconds(state.upgrades.chef).toFixed(1)} 秒`,
    waiter: `移動 ${Math.round(waiterSpeed(state.upgrades.waiter))} px／秒`,
    tables: `同時接待 ${state.upgrades.tables * 2} 位客人`,
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
  if (doorOpenImage && doorIsOpen()) context.drawImage(doorOpenImage, 420, 440, 100, 100);
  drawLockedTables();

  // 角色與「家具的正面」放進同一個深度排序：腳底 y 小的先畫。
  // 站在櫃台/椅子/圍欄後面的人因此會被家具擋住，站在前面的人則蓋過家具。
  const layers = [];
  const actor = (kind, value) => layers.push({ y: value.y + 0.5, paint: () => drawActor({ kind, ...value }) });
  const frontFace = (rect, baseline) => layers.push({ y: baseline, paint: () => redrawRegion(rect) });

  actor("chef", state.kitchen.chef);
  actor("drinkChef", state.kitchen.drinkChef);
  actor("maleWaiter", state.waiters.male);
  actor("femaleWaiter", state.waiters.female);
  for (const customer of state.customers) actor("customer", customer);
  for (const face of FRONT_FACES) frontFace(face.rect, face.baseline);
  for (const table of TABLES.slice(0, state.upgrades.tables)) {
    frontFace(coverRect(table), table.tableBodyArea.bottom);
    if (table.chairFrontLeft) frontFace(table.chairFrontLeft, table.chairFrontLeft.bottom);
    if (table.chairFrontRight) frontFace(table.chairFrontRight, table.chairFrontRight.bottom);
    else if (table.chairFrontArea) frontFace(table.chairFrontArea, table.chairFrontArea.bottom);
  }

  layers.sort((first, second) => first.y - second.y);
  for (const layer of layers) layer.paint();

  drawTableFood();
  drawCustomerBubbles();
  drawCashierBubble();
  if (debugVisible) drawDebugOverlay();
}

function coverRect(table) {
  return { left: table.cover.x, top: table.cover.y, right: table.cover.x + table.cover.w, bottom: table.cover.y + table.cover.h };
}

function doorIsOpen() {
  return state.customers.some((customer) => ["entering", "leaving"].includes(customer.state) && customer.y >= 430);
}

function redrawRegion(rect) {
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  context.drawImage(roomImage, rect.left, rect.top, width, height, rect.left, rect.top, width, height);
}

function drawLockedTables() {
  // 未解鎖的桌子用「暖色調的暗部」融進地板，不是蓋一塊黑色遮罩。
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 11px monospace";
  for (const table of TABLES.slice(state.upgrades.tables)) {
    const lock = table.lockRect;
    context.fillStyle = "rgba(48, 26, 14, .34)";
    context.fillRect(lock.x, lock.y, lock.w, lock.h);
    context.fillStyle = "rgba(243, 223, 181, .62)";
    context.fillText("尚未開放", lock.x + lock.w / 2, lock.y + lock.h - 10);
  }
  context.restore();
}

const customerVariants = [];

function buildCustomerVariants(atlas) {
  customerVariants.length = 0;
  for (let v = 0; v < 6; v += 1) {
    const c = document.createElement("canvas");
    c.width = 576;
    c.height = CELL_H;
    c.dataset.key = `customer-variant-${v}`;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false;
    const sourceRow = (v % 2 === 0) ? 2 : 3;
    ctx.drawImage(atlas, 0, sourceRow * CELL_H, 576, CELL_H, 0, 0, 576, CELL_H);

    if (v >= 2) {
      const imgData = ctx.getImageData(0, 0, 576, CELL_H);
      const data = imgData.data;
      const swapMap = new Map();
      const rgbKey = (r, g, b) => `${r},${g},${b}`;

      if (v === 2) {
        // Male variant A: Green jacket -> Navy Blue jacket
        swapMap.set(rgbKey(97, 112, 73), [68, 92, 138]);
        swapMap.set(rgbKey(53, 67, 68), [40, 58, 92]);
        swapMap.set(rgbKey(28, 44, 49), [24, 36, 60]);
        swapMap.set(rgbKey(83, 85, 78), [58, 80, 115]);
      } else if (v === 3) {
        // Female variant A: Amber sweater -> Crimson/Coral sweater
        swapMap.set(rgbKey(234, 159, 72), [214, 58, 72]);
        swapMap.set(rgbKey(162, 83, 33), [168, 42, 54]);
        swapMap.set(rgbKey(74, 36, 25), [118, 28, 38]);
      } else if (v === 4) {
        // Male variant B: Green jacket -> Burgundy coat
        swapMap.set(rgbKey(97, 112, 73), [128, 62, 78]);
        swapMap.set(rgbKey(53, 67, 68), [88, 38, 54]);
        swapMap.set(rgbKey(28, 44, 49), [56, 24, 38]);
        swapMap.set(rgbKey(83, 85, 78), [108, 52, 70]);
      } else if (v === 5) {
        // Female variant B: Amber sweater -> Teal/Emerald sweater
        swapMap.set(rgbKey(234, 159, 72), [38, 148, 132]);
        swapMap.set(rgbKey(162, 83, 33), [28, 112, 100]);
        swapMap.set(rgbKey(74, 36, 25), [20, 80, 72]);
      }

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 12) continue;
        const key = rgbKey(data[i], data[i + 1], data[i + 2]);
        const replacement = swapMap.get(key);
        if (replacement) {
          data[i] = replacement[0];
          data[i + 1] = replacement[1];
          data[i + 2] = replacement[2];
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    customerVariants.push(c);
  }
}

function getCharacterFrame(actor, moving, carrying, seated, dir) {
  if (seated) {
    return 3;
  }
  if (carrying) {
    return 3;
  }
  const walkIndex = actor.walkFrame ?? (Math.floor((actor.distanceWalked || 0) / 24) % 2);
  if (!moving) {
    return 0;
  }
  return walkIndex === 0 ? 1 : 2;
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
  const moving = Boolean(actor.walking && actor.path?.length);

  // Direction determination (§4.1)
  let dir = actor.direction || "down";
  if (moving && next) {
    const dx = next.x - actor.x;
    const dy = next.y - actor.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      dir = dx < 0 ? "left" : "right";
    } else {
      dir = dy < 0 ? "up" : "down";
    }
    actor.direction = dir;
  }

  const flip = dir === "left";

  if (actor.kind === "maleWaiter") {
    const carrying = actor.task?.type === "deliver" && actor.task.phase === "table";
    const frame = getCharacterFrame(actor, moving, carrying, false, dir);
    drawAtlas(frame, 0, actor.x, actor.y, 80, flip);
    return;
  }

  if (actor.kind === "femaleWaiter") {
    const carrying = actor.task?.type === "drink" && actor.task.phase === "toTable";
    const frame = getCharacterFrame(actor, moving, carrying, false, dir);
    drawFemaleWaiter(frame, actor.x, actor.y, 80, flip);
    return;
  }

  // Customer (§4.2, §4.3, §4.6, §4.7 ②)
  const seated = Boolean(actor.seated);
  const customerDir = seated ? (actor.direction || "right") : dir;
  const customerFlip = customerDir === "left";
  const frame = getCharacterFrame(actor, moving, false, seated, customerDir);
  drawCustomer(actor.variant, frame, actor.x, actor.y, seated ? 90 : 82, customerFlip);
}

function drawCustomer(variant, column, x, y, size, flip) {
  const v = Math.abs(variant ?? 0) % 6;
  const image = customerVariants[v] || atlasImage;
  const row = customerVariants[v] ? 0 : (v % 2 === 0 ? 2 : 3);
  drawSpriteFrame(image, column, row, x, y, size, flip);
}

function drawFemaleWaiter(column, x, y, size, flip) {
  drawSpriteFrame(femaleWaiterImage, column, 0, x, y, size, flip);
}

function drawAtlas(column, row, x, y, size, flip = false) {
  drawSpriteFrame(atlasImage, column, row, x, y, size, flip);
}

function drawSpriteFrame(image, column, row, x, y, size, flip) {
  const metric = spriteMetric(image, column, row);
  const scale = size / CELL_H;
  context.save();
  context.translate(Math.round(x), Math.round(y));
  if (flip) context.scale(-1, 1);
  context.drawImage(
    image,
    column * CELL_W,
    row * CELL_H,
    CELL_W,
    CELL_H,
    -metric.centerX * scale,
    -metric.bottom * scale,
    CELL_W * scale,
    size
  );
  context.restore();
}

function spriteMetric(image, column, row) {
  const key = `${image.src || image.dataset?.key || "canvas"}:${column}:${row}`;
  if (spriteMetrics.has(key)) return spriteMetrics.get(key);
  metricCanvas.width = CELL_W;
  metricCanvas.height = CELL_H;
  metricContext.clearRect(0, 0, CELL_W, CELL_H);
  metricContext.drawImage(image, column * CELL_W, row * CELL_H, CELL_W, CELL_H, 0, 0, CELL_W, CELL_H);
  const pixels = metricContext.getImageData(0, 0, CELL_W, CELL_H).data;
  let left = CELL_W;
  let right = 0;
  let bottom = 0;
  for (let pixel = 0; pixel < CELL_W * CELL_H; pixel += 1) {
    if (pixels[pixel * 4 + 3] < 10) continue;
    const px = pixel % CELL_W;
    const py = Math.floor(pixel / CELL_W);
    left = Math.min(left, px);
    right = Math.max(right, px + 1);
    bottom = Math.max(bottom, py + 1);
  }
  const metric = { centerX: left < CELL_W ? (left + right) / 2 : CELL_W / 2, bottom: bottom || CELL_H };
  spriteMetrics.set(key, metric);
  return metric;
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
    ["door", POINTS.entranceDoor, "#ffe46a"],
    ["queue entry", POINTS.queueEntry, "#f2d251"],
    ["exit bypass", POINTS.exitBypass, "#7dffb0"],
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

function drawTableFood() {
  for (const tableState of state.tables.slice(0, state.upgrades.tables)) {
    const table = TABLES[tableState.id - 1];
    const cx = Math.round(table.cover.x + table.cover.w / 2);
    const cy = Math.round(table.cover.y + table.cover.h / 2);

    // Seat 0 (left seat)
    const cust0 = state.customers.find((c) => c.tableId === tableState.id && c.seated && (c.seatIndex === 0 || c.seatIndex === undefined));
    const food0 = tableState.seats?.[0]?.hasFood || (cust0 && cust0.state === "eating") || (!tableState.seats && tableState.hasFood);
    if (food0) {
      drawPlateAndDish(cx - 12, cy);
    }

    // Seat 1 (right seat)
    const cust1 = state.customers.find((c) => c.tableId === tableState.id && c.seated && c.seatIndex === 1);
    const food1 = tableState.seats?.[1]?.hasFood || (cust1 && cust1.state === "eating");
    if (food1) {
      drawPlateAndDish(cx + 12, cy);
    }
  }
}

function drawPlateAndDish(cx, cy) {
  context.save();
  // Dish plate
  context.fillStyle = "#fff2d3";
  context.strokeStyle = "#17130f";
  context.lineWidth = 1.5;
  context.beginPath();
  context.ellipse(cx, cy, 8, 5, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  // Food items
  context.fillStyle = "#a63e32";
  context.fillRect(cx - 4, cy - 2, 4, 3);
  context.fillStyle = "#587c42";
  context.fillRect(cx + 1, cy - 2, 3, 3);
  context.fillStyle = "#f1a419";
  context.fillRect(cx - 1, cy, 3, 2);

  // Steam
  const steam = Math.floor(state.elapsed * 4) % 3;
  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.fillRect(cx - 2, cy - 6 - steam, 2, 2);
  context.fillRect(cx + 2, cy - 7 - steam, 2, 2);
  context.restore();
}

function drawCustomerBubbles() {
  for (const customer of state.customers) {
    if (customer.state === "queueing" && !customer.walking && customer.path.length === 0 && customer.mood !== "normal") {
      drawWaitingMood(customer);
    } else if (customer.state === "ordering") {
      drawOrderingBubble(customer);
    } else if (customer.satisfaction && (state.elapsed - customer.satisfaction.time) < 1.0) {
      drawSatisfactionBubble(customer);
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

function drawOrderingBubble(customer) {
  const x = Math.round(customer.x);
  const y = Math.round(customer.y - 72);

  context.save();
  // Thought bubble circles
  context.fillStyle = "#fff2d3";
  context.strokeStyle = "#17130f";
  context.lineWidth = 1.5;

  context.beginPath();
  context.arc(x - 4, y + 17, 2, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(x - 1, y + 13, 3, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  // Main bubble
  const bw = 28;
  const bh = 20;
  const bx = x - bw / 2;
  const by = y - bh / 2;
  context.fillRect(bx, by, bw, bh);
  context.strokeRect(bx, by, bw, bh);

  // Mini food icon inside bubble
  context.fillStyle = "#fff2d3";
  context.beginPath();
  context.ellipse(x, y + 2, 6, 3.5, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#5a3a22";
  context.lineWidth = 1;
  context.stroke();

  context.fillStyle = "#a63e32";
  context.fillRect(x - 3, y, 3, 2);
  context.fillStyle = "#587c42";
  context.fillRect(x + 1, y, 2, 2);
  context.fillStyle = "#f1a419";
  context.fillRect(x - 1, y + 1, 2, 1);

  context.restore();
}

function drawSatisfactionBubble(customer) {
  const age = state.elapsed - customer.satisfaction.time;
  if (age < 0 || age >= 1.0) return;
  const alpha = Math.max(0, 1 - age / 1.0);
  const x = Math.round(customer.x);
  const y = Math.round(customer.y - 70 - age * 8);

  context.save();
  context.globalAlpha = alpha;

  const bw = 24;
  const bh = 20;
  const bx = x - bw / 2;
  const by = y - bh / 2;

  context.fillStyle = "#fff2d3";
  context.strokeStyle = "#17130f";
  context.lineWidth = 1.5;
  context.fillRect(bx, by, bw, bh);
  context.strokeRect(bx, by, bw, bh);

  // Pointer
  context.beginPath();
  context.moveTo(x - 3, by + bh);
  context.lineTo(x, by + bh + 3);
  context.lineTo(x + 3, by + bh);
  context.fill();

  if (customer.satisfaction.happy) {
    context.fillStyle = "#3d7a36";
    context.font = "bold 11px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("^ ▽ ^", x, y);
  } else {
    context.fillStyle = "#8a5c24";
    context.font = "bold 11px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("- _ -", x, y);
  }
  context.restore();
}

function drawCashierBubble() {
  if (!state.cashierCoinEffect) return;
  const age = state.elapsed - state.cashierCoinEffect.time;
  if (age < 0 || age > 0.85) return;

  const alpha = Math.max(0, 1 - age / 0.85);
  const floatY = age * 18;
  const x = 250;
  const y = 430 - 35 - floatY;

  context.save();
  context.globalAlpha = alpha;
  const text = `+● ${state.cashierCoinEffect.amount}`;
  context.font = "bold 13px monospace";
  const metrics = context.measureText(text);
  const bw = Math.round(metrics.width + 16);
  const bh = 22;
  const bx = Math.round(x - bw / 2);
  const by = Math.round(y - bh / 2);

  context.fillStyle = "#fff2d3";
  context.strokeStyle = "#17130f";
  context.lineWidth = 2;
  context.fillRect(bx, by, bw, bh);
  context.strokeRect(bx, by, bw, bh);

  // Tiny pointer
  context.fillStyle = "#fff2d3";
  context.beginPath();
  context.moveTo(x - 4, by + bh);
  context.lineTo(x, by + bh + 4);
  context.lineTo(x + 4, by + bh);
  context.fill();

  context.fillStyle = "#b47a18";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x, y);
  context.restore();
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
elements.sound.addEventListener("click", toggleSound);
elements.reset.addEventListener("click", resetGame);
elements.upgrades.forEach((button) => button.addEventListener("click", buyUpgrade));
window.addEventListener("pagehide", saveState);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveState();
});
setInterval(saveState, 5_000);

Promise.all([images.room, images.doorOpen, images.atlas, images.femaleWaiter])
  .then(([room, doorOpen, atlas, femaleWaiter]) => {
    roomImage = room;
    doorOpenImage = doorOpen;
    atlasImage = atlas;
    femaleWaiterImage = femaleWaiter;
    buildCustomerVariants(atlas);
    updateUi();
    requestAnimationFrame(frame);
  })
  .catch(() => {
    state.message = "遊戲圖像載入失敗，請重新整理頁面。";
    updateUi();
    requestAnimationFrame(frame);
  });
