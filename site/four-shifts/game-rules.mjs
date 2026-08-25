export const SAVE_VERSION = 1;
export const SAVE_KEY = "restaurant-rookie-idle-v1";
export const WORLD = { width: 960, height: 540 };
// 走道最窄處（收銀台後方員工區）只有 20px，格子必須比它細，否則尋路只剩一排格點、一被佔就無解。
export const GRID_SIZE = 10;

// Every world position is measured in the canvas's internal 960 x 540 space.
// Actor x/y values are always the bottom-centre foot anchor, never CSS pixels.
// 座位是唯一的例外：seatPoints 對齊椅子的落地線，見 TABLES 的註解。

export const POINTS = {
  // 入口分成兩條車道：排隊走 x=96，離場走 x=136，只在門口那一格交會。
  customerSpawn: { x: 136, y: 524 },
  entranceDoor: { x: 136, y: 472 },
  entranceInside: { x: 120, y: 440 },
  queueEntry: { x: 96, y: 440 },
  exitBypass: { x: 136, y: 440 },
  queueHost: { x: 150, y: 350 },
  guestAisleStart: { x: 200, y: 440 },
  guestAisleEnd: { x: 480, y: 440 },
  exit: { x: 136, y: 524 },
  pickupWaiter: { x: 400, y: 330 },
  drinkPickupWaiter: { x: 430, y: 330 },
  // 客人站櫃台「前面」，員工站櫃台「後面」，中間隔著櫃體 222–364 × 337–446。
  checkoutCustomer: { x: 300, y: 456 },
  // 等待結帳的人要停在「客人來的那一側」(東側)，
  // 放到西側的話後面的人得穿過正在結帳的人，兩邊互相等成死鎖。
  checkoutQueue: { x: 392, y: 452 },
  checkoutExitApproach: { x: 190, y: 452 },
  cashierService: { x: 300, y: 330 },
  cashierApproach: { x: 376, y: 330 },
};

export const KITCHEN_POINTS = {
  stove: { x: 200, y: 145 },
  prep: { x: 300, y: 240 },
  drinkBar: { x: 400, y: 145 },
  pickup: { x: 356, y: 236 },
  drinkPickup: { x: 412, y: 236 },
};

// 每張桌子的數字都是從 pixel-restaurant.png 量出來的家具實際範圍，不是估的。
// seatPoint = 右椅的視覺中心 x + 椅腳落地線 y；坐姿影格一樣是底部對齊，
// 所以只要這兩個數字對得上椅子，人就會坐在椅子上而不是飄在旁邊。
export const TABLES = [
  {
    id: 1,
    seatApproachPoint: { x: 627, y: 218 },
    seatPoints: [{ x: 627, y: 185, facing: "left" }],
    servicePoint: { x: 590, y: 246 },
    tableBodyArea: { left: 566, top: 112, right: 616, bottom: 198 },
    chairBlockedArea: { left: 616, top: 122, right: 638, bottom: 188 },
    cover: { x: 567, y: 113, w: 48, h: 50 },
    lockRect: { x: 543, y: 112, w: 95, h: 86 },
  },
  {
    id: 2,
    seatApproachPoint: { x: 830, y: 218 },
    seatPoints: [{ x: 830, y: 185, facing: "left" }],
    servicePoint: { x: 793, y: 246 },
    tableBodyArea: { left: 768, top: 112, right: 818, bottom: 198 },
    chairBlockedArea: { left: 818, top: 122, right: 842, bottom: 190 },
    cover: { x: 769, y: 113, w: 48, h: 50 },
    lockRect: { x: 745, y: 112, w: 97, h: 86 },
  },
  {
    id: 3,
    seatApproachPoint: { x: 618, y: 420 },
    seatPoints: [{ x: 618, y: 386, facing: "left" }],
    servicePoint: { x: 580, y: 445 },
    tableBodyArea: { left: 553, top: 308, right: 606, bottom: 400 },
    chairBlockedArea: { left: 605, top: 318, right: 630, bottom: 390 },
    cover: { x: 554, y: 309, w: 51, h: 50 },
    lockRect: { x: 530, y: 308, w: 100, h: 92 },
  },
  {
    id: 4,
    seatApproachPoint: { x: 833, y: 425 },
    seatPoints: [{ x: 833, y: 400, facing: "left" }],
    servicePoint: { x: 795, y: 448 },
    tableBodyArea: { left: 768, top: 312, right: 820, bottom: 405 },
    chairBlockedArea: { left: 820, top: 322, right: 846, bottom: 404 },
    cover: { x: 769, y: 313, w: 50, h: 50 },
    lockRect: { x: 745, y: 312, w: 101, h: 93 },
  },
];

// 碰撞矩形一律貼齊背景圖上真正畫出來的家具；寬鬆的大方塊會讓互動點落在空地上。
export const BLOCKED_RECTS = [
  { name: "kitchen-and-front-wall", left: 20, top: 0, right: 459, bottom: 300 },
  { name: "cashier-counter", left: 222, top: 337, right: 364, bottom: 446 },
  { name: "table-1", left: 543, top: 112, right: 638, bottom: 198 },
  { name: "table-2", left: 745, top: 112, right: 842, bottom: 198 },
  { name: "table-3", left: 530, top: 308, right: 630, bottom: 400 },
  { name: "table-4", left: 745, top: 312, right: 846, bottom: 405 },
  { name: "left-plant", left: 20, top: 365, right: 75, bottom: 470 },
  { name: "right-plant", left: 880, top: 424, right: 906, bottom: 470 },
];

export const WALKABLE_AREAS = [
  { name: "dining-floor", left: 460, top: 100, right: 906, bottom: 460 },
  { name: "front-floor", left: 150, top: 304, right: 460, bottom: 460 },
  { name: "entrance-hall", left: 82, top: 340, right: 150, bottom: 460 },
  { name: "door-lane", left: 86, top: 460, right: 146, bottom: 530 },
];

// 廚房灰地磚實測 x 92–443、y 121–253，走動範圍留一格邊。
export const KITCHEN_WALKABLE_AREA = { name: "kitchen-floor", left: 100, top: 132, right: 436, bottom: 248 };

export const KITCHEN_BLOCKED_RECTS = [
  { name: "back-counter", left: 20, top: 20, right: 443, bottom: 122 },
  { name: "left-storage", left: 20, top: 122, right: 90, bottom: 270 },
  { name: "prep-island", left: 218, top: 138, right: 348, bottom: 228 },
  { name: "kitchen-plant-left", left: 144, top: 236, right: 168, bottom: 258 },
  { name: "kitchen-plant-right", left: 368, top: 236, right: 393, bottom: 258 },
];

// 排隊往上排（背對門），離場走另一條車道往下，兩者方向相反不對撞。
// index 0 是隊伍最前面，必須是「離門最遠」的那一格：
// 反過來的話，後到的客人得穿過前面的人才排得進去，會卡死。
// 間距必須大於角色互不重疊的 34px，否則後面的人永遠走不到自己的格子。
export const WAITING_QUEUE_POINTS = [
  { x: 96, y: 348 },
  { x: 96, y: 400 },
  { x: 96, y: 452 },
];

export const QUEUE_PROTECTED_ZONE = { left: 82, top: 330, right: 116, bottom: 452 };
// 櫃台「後方」那條員工專用地板：上緣是廚房前牆的下緣，下緣是櫃體的上緣。
export const CASHIER_STAFF_ZONE = { left: 224, top: 304, right: 362, bottom: 336 };
const BASE_COSTS = { chef: 70, waiter: 60, income: 90 };
const TABLE_COSTS = [120, 320, 760];
const MAX_CUSTOMERS = 8;

export function upgradeCost(type, upgrades) {
  if (type === "tables") return upgrades.tables >= 4 ? null : TABLE_COSTS[upgrades.tables - 1];
  return Math.round(BASE_COSTS[type] * 1.65 ** upgrades[type]);
}

export function chefSeconds(level) {
  return Math.max(1.8, 6 * 0.88 ** level);
}

export function waiterSpeed(level) {
  return Math.min(250, 100 * 1.12 ** level);
}

export function incomePerGuest(level) {
  return Math.round(20 * 1.25 ** level);
}

export function restaurantLevel(upgrades) {
  return upgrades.chef + upgrades.waiter + upgrades.income + upgrades.tables;
}

export function pointBlocked(point, { allowQueue = false, allowCashier = false } = {}) {
  if (!inWalkableBounds(point)) return true;
  if (!allowQueue && insideRect(point, QUEUE_PROTECTED_ZONE)) return true;
  if (!allowCashier && insideRect(point, CASHIER_STAFF_ZONE)) return true;
  // 櫃體本身擋所有人，包含員工——員工是繞到櫃台「後方」，不是穿過櫃台。
  return BLOCKED_RECTS.some((rect) => insideRect(point, rect));
}

export function pointBlockedForZone(point, zone = "dining") {
  if (zone === "kitchen") return kitchenPointBlocked(point);
  return pointBlocked(point, { allowQueue: zone === "queue", allowCashier: zone === "staff" });
}

export function kitchenPointBlocked(point) {
  const inKitchen = insideRect(point, KITCHEN_WALKABLE_AREA);
  if (!inKitchen) return true;
  return KITCHEN_BLOCKED_RECTS.some((rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom);
}

function inWalkableBounds(point) {
  return WALKABLE_AREAS.some((area) => insideRect(point, area)) || insideRect(point, CASHIER_STAFF_ZONE);
}

export function findPath(start, end, zone = "dining") {
  const isBlocked = (point) => pointBlockedForZone(point, zone);
  if (isBlocked(end)) return [];
  const startCell = nearestWalkableCell(start, isBlocked);
  const endCell = { x: Math.round(end.x / GRID_SIZE), y: Math.round(end.y / GRID_SIZE) };
  if (!startCell || isBlocked(cellPoint(endCell))) return [];
  const startKey = cellKey(startCell);
  const endKey = cellKey(endCell);
  const queue = [startCell];
  const previous = new Map([[startKey, null]]);

  for (let index = 0; index < queue.length && !previous.has(endKey); index += 1) {
    const cell = queue[index];
    for (const next of [
      { x: cell.x + 1, y: cell.y },
      { x: cell.x - 1, y: cell.y },
      { x: cell.x, y: cell.y + 1 },
      { x: cell.x, y: cell.y - 1 },
    ]) {
      const key = cellKey(next);
      if (previous.has(key) || isBlocked(cellPoint(next))) continue;
      previous.set(key, cell);
      queue.push(next);
    }
  }

  if (!previous.has(endKey)) return [];
  const cells = [];
  for (let cell = endCell; cell; cell = previous.get(cellKey(cell))) cells.push(cell);
  cells.reverse();
  const points = compressGridPath(cells.map(cellPoint));
  const route = points.slice(1);
  const last = route.at(-1) || start;
  if (distance(last, end) > 1) {
    if (!segmentIsLegal(last, end, isBlocked)) return [];
    route.push({ ...end });
  }
  return route;
}

function segmentIsLegal(start, end, isBlocked) {
  const steps = Math.max(1, Math.ceil(distance(start, end) / 4));
  for (let step = 0; step <= steps; step += 1) {
    const ratio = step / steps;
    if (isBlocked({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio })) return false;
  }
  return true;
}

function nearestWalkableCell(point, isBlocked) {
  const origin = { x: Math.round(point.x / GRID_SIZE), y: Math.round(point.y / GRID_SIZE) };
  for (let radius = 0; radius <= 6; radius += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const dy = radius - Math.abs(dx);
      for (const signedY of dy ? [dy, -dy] : [0]) {
        const cell = { x: origin.x + dx, y: origin.y + signedY };
        if (!isBlocked(cellPoint(cell))) return cell;
      }
    }
  }
  return null;
}

function compressGridPath(points) {
  if (points.length < 3) return points;
  const compressed = [points[0]];
  let previousDirection = directionBetween(points[0], points[1]);
  for (let index = 2; index < points.length; index += 1) {
    const direction = directionBetween(points[index - 1], points[index]);
    if (direction !== previousDirection) compressed.push(points[index - 1]);
    previousDirection = direction;
  }
  compressed.push(points.at(-1));
  return compressed;
}

function directionBetween(first, second) {
  return first.x === second.x ? "vertical" : "horizontal";
}

function cellPoint(cell) {
  return { x: cell.x * GRID_SIZE, y: cell.y * GRID_SIZE };
}

function cellKey(cell) {
  return cell.x + "," + cell.y;
}

function distance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export function routeBetween(from, to) {
  const locations = {
    queue: WAITING_QUEUE_POINTS[0],
    pass: POINTS.pickupWaiter,
    checkout: POINTS.checkoutCustomer,
  };
  for (const table of TABLES) locations["table" + table.id] = table.servicePoint;
  const zone = from === "queue" || to === "queue" ? "queue" : "dining";
  return findPath(locations[from] || from, locations[to] || to, zone);
}

function insideRect(point, rect) {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

export function freshState(now = Date.now()) {
  return {
    version: SAVE_VERSION,
    running: false,
    coins: 160,
    served: 0,
    upgrades: { chef: 0, waiter: 0, tables: 1, income: 0 },
    lastSavedAt: now,
    nextCustomerId: 1,
    spawnTimer: 0.8,
    elapsed: 0,
    customers: [],
    tables: TABLES.map((table) => ({ id: table.id, occupiedBy: null, dirty: false, orderState: "available" })),
    reservations: new Map(),
    kitchen: {
      queue: [],
      active: null,
      timer: 0,
      ready: [],
      phase: "idle",
      chef: { key: "chef-main", x: KITCHEN_POINTS.prep.x, y: KITCHEN_POINTS.prep.y, path: [], walking: false, navigationZone: "kitchen" },
      drinkQueue: [],
      activeDrink: null,
      drinkTimer: 0,
      drinkReady: [],
      drinkPhase: "idle",
      drinkChef: { key: "chef-drink", x: KITCHEN_POINTS.drinkBar.x, y: KITCHEN_POINTS.drinkBar.y, path: [], walking: false, navigationZone: "kitchen" },
    },
    waiters: {
      male: { key: "waiter-male", x: 880, y: 340, path: [], task: null, walking: false, idlePoint: { x: 880, y: 340 }, navigationZone: "dining" },
      female: {
        key: "waiter-female",
        x: POINTS.cashierService.x,
        y: POINTS.cashierService.y,
        path: [],
        task: null,
        walking: false,
        idlePoint: { ...POINTS.cashierService },
        navigationZone: "staff",
      },
    },
    message: "按下開始，像素小館就會自動營運。",
    lastIncome: 0,
  };
}

export function purchaseUpgrade(state, type) {
  if (!Object.hasOwn(state.upgrades, type)) return false;
  const cost = upgradeCost(type, state.upgrades);
  if (cost === null || state.coins < cost) return false;
  state.coins -= cost;
  state.upgrades[type] += 1;
  state.message = type === "tables"
    ? "解鎖第 " + state.upgrades.tables + " 張餐桌。"
    : upgradeLabel(type) + "升到 Lv." + state.upgrades[type] + "。";
  return true;
}

function upgradeLabel(type) {
  return { chef: "廚師速度", waiter: "服務員速度", income: "單客收入" }[type];
}

export function tickGame(state, dt) {
  if (!state.running || dt <= 0) return state;
  const step = Math.min(0.25, dt);
  state.reservations = new Map();
  state.elapsed += step;
  state.spawnTimer -= step;
  const guestLimit = Math.min(MAX_CUSTOMERS, state.upgrades.tables + 3);
  const waitingCount = state.customers.filter((customer) => ["entering", "queueing", "waitingEscort", "waitingQueueExit"].includes(customer.state)).length;
  if (state.spawnTimer <= 0 && state.customers.length < guestLimit && waitingCount < WAITING_QUEUE_POINTS.length && !entranceBusy(state)) {
    spawnCustomer(state);
    state.spawnTimer = 2.8;
  } else if (state.spawnTimer <= 0) {
    state.spawnTimer = 1;
  }

  updateCustomers(state, step);
  updateKitchen(state, step);
  updateMaleWaiter(state, step);
  updateFemaleWaiter(state, step);
  assignMaleTask(state);
  assignFemaleTask(state);
  removeFinishedCustomers(state);
  return state;
}

function spawnCustomer(state) {
  const id = state.nextCustomerId++;
  const queueIndex = state.customers.filter((customer) => ["entering", "queueing", "waitingEscort", "waitingQueueExit"].includes(customer.state)).length;
  const queueSpot = WAITING_QUEUE_POINTS[queueIndex];
  state.customers.push({
    key: "customer-" + id,
    id,
    variant: id % 2,
    state: "entering",
    x: POINTS.customerSpawn.x,
    y: POINTS.customerSpawn.y,
    path: findPath(POINTS.customerSpawn, queueSpot, "queue"),
    queueSpot: { ...queueSpot },
    timer: 0,
    waitTime: 0,
    mood: "normal",
    tableId: null,
    direction: "up",
    walking: true,
    navigationZone: "queue",
    walkFrame: 0,
    foodDelivered: false,
    drinkDelivered: false,
    paid: false,
    seated: false,
    transition: null,
  });
  state.message = "新客人進店，正在門口等候。";
}

function updateCustomers(state, dt) {
  for (const customer of state.customers) {
    customer.walking = false;
    if (customer.state === "seatingTransition") {
      updateSeatTransition(state, customer, dt);
      continue;
    }
    if (customer.state === "standingTransition") {
      updateStandingTransition(state, customer, dt);
      continue;
    }
    if (["waitingExit", "waitingQueueExit"].includes(customer.state)) {
      if (!entranceBusy(state, customer)) startDoorExit(state, customer, customer.state === "waitingQueueExit");
      continue;
    }

    if (customer.state === "waitingCheckoutSlot") {
      if (!checkoutBusy(state, customer)) {
        customer.state = "toCheckout";
        customer.path = findPath(customer, POINTS.checkoutCustomer);
      }
      continue;
    }

    if (["entering", "seating", "toCheckoutQueue", "toCheckout", "toExitApproach", "leaving"].includes(customer.state)) {
      customer.walking = customer.path.length > 0;
      const reached = moveAlongPath(customer, waiterSpeed(state.upgrades.waiter) * 0.82, dt, state);
      customer.walkFrame = Math.floor(state.elapsed * 6) % 2;
      if (!reached) continue;
      if (customer.state === "entering") {
        customer.state = "queueing";
        customer.walking = false;
      }
      else if (customer.state === "seating") seatCustomer(state, customer);
      else if (customer.state === "toCheckoutQueue") customer.state = "waitingCheckoutSlot";
      else if (customer.state === "toCheckout") customer.state = "waitingPayment";
      else if (customer.state === "toExitApproach") requestDoorExit(state, customer, false);
      else customer.state = "done";
      continue;
    }

    if (customer.state === "queueing") {
      if (customer.path.length) {
        customer.walking = true;
        moveAlongPath(customer, waiterSpeed(state.upgrades.waiter) * 0.82, dt, state);
        customer.walkFrame = Math.floor(state.elapsed * 6) % 2;
        continue;
      }
      if (customer.tableId !== null) {
        customer.mood = "normal";
        continue;
      }
      customer.waitTime += dt;
      customer.mood = customer.waitTime >= 20 ? "angry" : customer.waitTime >= 10 ? "impatient" : "normal";
      if (customer.waitTime >= 30) leaveQueue(state, customer);
      continue;
    }

    if (customer.state === "eating") {
      customer.timer -= dt;
      if (customer.timer <= 0) sendToCheckout(state, customer);
    }
  }
  compactQueue(state);
}

function seatCustomer(state, customer) {
  const seat = TABLES[customer.tableId - 1].seatPoints[0];
  customer.state = "seatingTransition";
  customer.seated = true;
  customer.transition = {
    elapsed: 0,
    duration: 0.22,
    from: { x: customer.x, y: customer.y },
    to: { x: seat.x, y: seat.y },
  };
  customer.direction = seat.facing;
  customer.walking = false;
}

function updateSeatTransition(state, customer, dt) {
  updateTransitionPosition(customer, dt);
  if (customer.transition) return;
  if (customer.afterSeatState) {
    customer.state = customer.afterSeatState;
    customer.afterSeatState = null;
    customer.timer = 0.6;
    return;
  }
  customer.state = "waitingOrder";
  state.tables[customer.tableId - 1].orderState = "waitingOrder";
  state.message = "第 " + customer.tableId + " 桌已入座，等待點餐。";
}

function sendToCheckout(state, customer) {
  if (staffTrafficBusy(state)) return;
  const table = TABLES[customer.tableId - 1];
  const approach = table.seatApproachPoint;
  if (positionOccupied(state, customer, approach)) return;
  customer.state = "standingTransition";
  customer.transition = {
    elapsed: 0,
    duration: 0.22,
    from: { x: customer.x, y: customer.y },
    to: { ...approach },
  };
  state.tables[customer.tableId - 1].orderState = "checkout";
}

function updateStandingTransition(state, customer, dt) {
  updateTransitionPosition(customer, dt);
  if (customer.transition) return;
  const cashierOccupied = checkoutBusy(state, customer);
  const queueOccupied = state.customers.some((item) => item !== customer && ["toCheckoutQueue", "waitingCheckoutSlot"].includes(item.state));
  if (cashierOccupied && queueOccupied) {
    const seat = TABLES[customer.tableId - 1].seatPoints[0];
    customer.state = "seatingTransition";
    customer.afterSeatState = "eating";
    customer.transition = {
      elapsed: 0,
      duration: 0.22,
      from: { x: customer.x, y: customer.y },
      to: { ...seat },
    };
    return;
  }
  customer.seated = false;
  customer.state = cashierOccupied ? "toCheckoutQueue" : "toCheckout";
  customer.navigationZone = "dining";
  customer.path = findPath(customer, cashierOccupied ? POINTS.checkoutQueue : POINTS.checkoutCustomer);
  customer.walking = true;
}

function updateTransitionPosition(customer, dt) {
  const transition = customer.transition;
  transition.elapsed = Math.min(transition.duration, transition.elapsed + dt);
  const ratio = transition.elapsed / transition.duration;
  customer.x = transition.from.x + (transition.to.x - transition.from.x) * ratio;
  customer.y = transition.from.y + (transition.to.y - transition.from.y) * ratio;
  if (ratio >= 1) customer.transition = null;
}

function leaveQueue(state, customer) {
  customer.abandoned = true;
  customer.mood = "normal";
  customer.waitTime = 0;
  requestDoorExit(state, customer, true);
  state.message = "客人等候超過 30 秒，從入口離開。";
}

function compactQueue(state) {
  const waiting = state.customers
    .filter((customer) => ["entering", "queueing", "waitingEscort", "waitingQueueExit"].includes(customer.state))
    .sort((first, second) => first.id - second.id);
  waiting.forEach((customer, index) => {
    const target = WAITING_QUEUE_POINTS[index];
    if (!target || customer.queueSpot.x === target.x && customer.queueSpot.y === target.y) return;
    customer.queueSpot = { ...target };
    if (!["waitingEscort", "waitingQueueExit"].includes(customer.state)) {
      // 一律從「目前位置」重新規劃：舊版對 entering 的客人重掛門口起點，
      // 已經走進來的人會被指回門口，跟後面的人互相擋死。
      customer.path = findPath(customer, target, "queue");
    }
  });
}

function beginEatingIfReady(state, customer) {
  if (customer.state !== "waitingFood" || !customer.foodDelivered || !customer.drinkDelivered) return;
  customer.state = "eating";
  customer.timer = 4.2;
  state.tables[customer.tableId - 1].orderState = "eating";
  state.message = "第 " + customer.tableId + " 桌的餐點與飲料到齊，開始用餐。";
}

function payAndLeave(state, customer) {
  const income = incomePerGuest(state.upgrades.income);
  customer.paid = true;
  customer.state = "toExitApproach";
  customer.path = findPath(POINTS.checkoutCustomer, POINTS.checkoutExitApproach);
  state.coins += income;
  state.served += 1;
  state.lastIncome = income;
  state.message = "客人結帳，獲得 " + income + " 金幣。";
}

function checkoutBusy(state, customer) {
  return state.customers.some((item) => item !== customer && ["toCheckout", "waitingPayment", "toExitApproach"].includes(item.state));
}

// 排隊與離場已經是兩條分開的車道，只有門口那一格會重疊；
// 舊版把整個入口當成一把鎖，進場與離場會互相等成死鎖。
function entranceBusy(state, customer = null) {
  // 佔用判斷的範圍是「整條門道」（門檻到店外生成點），不是只有門那一格：
  // 只看門的話，新客人會生成在剛走出去的人身上。
  return state.customers.some((item) => item !== customer
    && ["entering", "leaving"].includes(item.state)
    && item.y > 452);
}

function requestDoorExit(state, customer, fromQueue) {
  if (entranceBusy(state, customer)) {
    customer.state = fromQueue ? "waitingQueueExit" : "waitingExit";
    customer.path = [];
    customer.walking = false;
    return;
  }
  startDoorExit(state, customer, fromQueue);
}

function startDoorExit(state, customer, fromQueue) {
  // 離場一律走 exitBypass 那條車道，不從排隊車道穿出去。
  const routeToLane = fromQueue
    ? [{ x: POINTS.exitBypass.x, y: customer.y }, { ...POINTS.exitBypass }]
    : [...findPath(customer, POINTS.exitBypass, "queue")];
  customer.state = "leaving";
  customer.navigationZone = "queue";
  customer.path = [...routeToLane, { ...POINTS.entranceDoor }, { ...POINTS.exit }];
  customer.walking = true;
}

function updateKitchen(state, dt) {
  updateMainKitchen(state, dt);
  updateDrinkKitchen(state, dt);
}

function updateMainKitchen(state, dt) {
  const kitchen = state.kitchen;
  kitchen.chef.walking = kitchen.chef.path.length > 0;
  if (!kitchen.active && kitchen.phase === "idle" && kitchen.queue.length) startKitchenOrder(state);

  if (kitchen.chef.path.length) {
    if (!moveAlongPath(kitchen.chef, 85, dt, state)) return;
    kitchen.chef.walking = false;
    if (kitchen.phase === "toStove") {
      kitchen.phase = "cooking";
      kitchen.timer = chefSeconds(state.upgrades.chef) * 0.6;
      state.message = "廚師在爐台烹飪主餐。";
    } else if (kitchen.phase === "toPrep") {
      kitchen.phase = "prepping";
      kitchen.timer = chefSeconds(state.upgrades.chef) * 0.4;
      state.message = "廚師在備餐台組合餐點。";
    } else if (kitchen.phase === "toPickup") {
      kitchen.ready.push(kitchen.active);
      kitchen.active = null;
      kitchen.phase = "toIdle";
      kitchen.timer = 0;
      kitchen.chef.path = kitchenPath(kitchen.chef, KITCHEN_POINTS.prep);
      state.message = "主餐放到出餐口，等待男服務生送餐。";
    } else if (kitchen.phase === "toIdle") {
      kitchen.phase = "idle";
    }
    return;
  }

  if (!kitchen.active) return;
  if (!["cooking", "prepping"].includes(kitchen.phase)) return;
  kitchen.timer -= dt;
  if (kitchen.timer > 0) return;
  if (kitchen.phase === "cooking") {
    kitchen.phase = "toPrep";
    kitchen.chef.path = kitchenPath(kitchen.chef, KITCHEN_POINTS.prep);
  } else {
    kitchen.phase = "toPickup";
    kitchen.chef.path = kitchenPath(kitchen.chef, KITCHEN_POINTS.pickup);
  }
}

function updateDrinkKitchen(state, dt) {
  const kitchen = state.kitchen;
  const chef = kitchen.drinkChef;
  chef.walking = chef.path.length > 0;
  if (!kitchen.activeDrink && kitchen.drinkPhase === "idle" && kitchen.drinkQueue.length) {
    kitchen.activeDrink = kitchen.drinkQueue.shift();
    kitchen.drinkPhase = "toDrinkBar";
    chef.path = kitchenPath(chef, KITCHEN_POINTS.drinkBar);
    if (!chef.path.length) {
      kitchen.drinkPhase = "mixing";
      kitchen.drinkTimer = 1.4;
      state.message = "第二位廚師在廚房飲料吧製作飲品。";
    }
  }
  if (chef.path.length) {
    if (!moveAlongPath(chef, 82, dt, state)) return;
    chef.walking = false;
    if (kitchen.drinkPhase === "toDrinkBar") {
      kitchen.drinkPhase = "mixing";
      kitchen.drinkTimer = 1.4;
      state.message = "第二位廚師在廚房飲料吧製作飲品。";
    } else if (kitchen.drinkPhase === "toPickup") {
      kitchen.drinkReady.push(kitchen.activeDrink);
      kitchen.activeDrink = null;
      kitchen.drinkPhase = "toIdle";
      chef.path = kitchenPath(chef, KITCHEN_POINTS.drinkBar);
      state.message = "飲料已放到出餐口，等待女服務生取餐。";
    } else if (kitchen.drinkPhase === "toIdle") {
      kitchen.drinkPhase = "idle";
    }
    return;
  }

  if (kitchen.drinkPhase !== "mixing") return;
  kitchen.drinkTimer -= dt;
  if (kitchen.drinkTimer > 0) return;
  kitchen.drinkPhase = "toPickup";
  chef.path = kitchenPath(chef, KITCHEN_POINTS.drinkPickup);
}

function startKitchenOrder(state) {
  state.kitchen.active = state.kitchen.queue.shift();
  state.kitchen.phase = "toStove";
  state.kitchen.chef.path = kitchenPath(state.kitchen.chef, KITCHEN_POINTS.stove);
}

function kitchenPath(start, end) {
  return findPath(start, end, "kitchen");
}

function updateMaleWaiter(state, dt) {
  const waiter = state.waiters.male;
  waiter.walking = waiter.path.length > 0;
  if (!waiter.task) {
    if (waiter.path.length) moveAlongPath(waiter, waiterSpeed(state.upgrades.waiter), dt, state);
    return;
  }
  if (!moveAlongPath(waiter, waiterSpeed(state.upgrades.waiter), dt, state)) return;
  const task = waiter.task;
  if (task.type === "escort" && task.phase === "pickup") {
    const customer = findCustomer(state, task.customerId);
    if (!customer || customer.state !== "queueing") return finishTask(waiter);
    const table = TABLES[customer.tableId - 1];
    customer.state = "waitingEscort";
    customer.mood = "normal";
    customer.waitTime = 0;
    customer.path = [];
    task.phase = "lead";
    waiter.path = findPath(waiter, table.servicePoint);
    state.message = "男服務生帶客人前往第 " + customer.tableId + " 桌。";
  } else if (task.type === "escort") {
    const customer = findCustomer(state, task.customerId);
    if (customer && customer.state === "waitingEscort") {
      customer.state = "seating";
      customer.path = [
        ...findPath(customer, POINTS.guestAisleStart, "queue"),
        ...findPath(POINTS.guestAisleStart, POINTS.guestAisleEnd, "queue"),
        ...findPath(POINTS.guestAisleEnd, TABLES[customer.tableId - 1].seatApproachPoint, "queue"),
      ];
    }
    finishTask(waiter);
  } else if (task.type === "deliver" && task.phase === "pickup") {
    task.phase = "table";
    waiter.path = findPath(waiter, TABLES[task.tableId - 1].servicePoint);
  } else if (task.type === "deliver") {
    const customer = findCustomer(state, task.customerId);
    if (customer && customer.state === "waitingFood") {
      customer.foodDelivered = true;
      state.message = "男服務生把主餐送到第 " + customer.tableId + " 桌。";
      beginEatingIfReady(state, customer);
    }
    finishTask(waiter);
  }
}

function assignMaleTask(state) {
  const waiter = state.waiters.male;
  // ponytail: one moving staff member owns the narrow public aisle; replace with cooperative multi-agent pathing only if concurrent staff traffic becomes a gameplay requirement.
  if (waiter.task || state.waiters.female.task || state.waiters.female.path.length || publicGuestMoving(state)) return;
  const freeTable = state.tables.find((table) => table.id <= state.upgrades.tables && table.occupiedBy === null && !table.dirty);
  const customer = state.customers.find((item) => item.state === "queueing" && item.tableId === null);
  if (freeTable && customer) {
    freeTable.occupiedBy = customer.id;
    freeTable.orderState = "seating";
    customer.tableId = freeTable.id;
    waiter.task = { type: "escort", phase: "pickup", customerId: customer.id, tableId: freeTable.id };
    waiter.path = findPath(waiter, POINTS.queueHost);
    return;
  }

  const readyId = state.kitchen.ready.find((id) => {
    const item = findCustomer(state, id);
    return item && item.state === "waitingFood" && !item.foodDelivered;
  });
  if (!readyId) return;
  state.kitchen.ready = state.kitchen.ready.filter((id) => id !== readyId);
  const readyCustomer = findCustomer(state, readyId);
  waiter.task = { type: "deliver", phase: "pickup", customerId: readyId, tableId: readyCustomer.tableId };
  waiter.path = findPath(waiter, POINTS.pickupWaiter);
}

function updateFemaleWaiter(state, dt) {
  const waiter = state.waiters.female;
  waiter.walking = waiter.path.length > 0;
  if (!waiter.task) {
    if (waiter.path.length) moveAlongPath(waiter, waiterSpeed(state.upgrades.waiter) * 0.94, dt, state);
    return;
  }
  const task = waiter.task;
  if (task.phase === "working") {
    task.timer -= dt;
    if (task.timer > 0) return;
    completeFemaleWork(state, waiter, task);
    return;
  }
  if (!moveAlongPath(waiter, waiterSpeed(state.upgrades.waiter) * 0.94, dt, state)) return;

  if (task.type === "order") {
    task.phase = "working";
    task.timer = 0.8;
  } else if (task.type === "drink" && task.phase === "pickup") {
    task.phase = "toTable";
    waiter.path = findPath(waiter, TABLES[task.tableId - 1].servicePoint, "staff");
  } else if (task.type === "drink") {
    const customer = findCustomer(state, task.customerId);
    if (customer && customer.state === "waitingFood") {
      customer.drinkDelivered = true;
      state.message = "女服務生把飲料送到第 " + customer.tableId + " 桌。";
      beginEatingIfReady(state, customer);
    }
    finishTask(waiter);
  } else {
    task.phase = "working";
    task.timer = task.type === "clear" ? 1.1 : 0.8;
  }
}

function completeFemaleWork(state, waiter, task) {
  if (task.type === "order") {
    const customer = findCustomer(state, task.customerId);
    if (!customer) return finishTask(waiter);
    customer.state = "waitingFood";
    state.kitchen.queue.push(customer.id);
    state.kitchen.drinkQueue.push(customer.id);
    state.tables[customer.tableId - 1].orderState = "waitingFood";
    finishTask(waiter);
    state.message = "第 " + customer.tableId + " 桌完成點餐，兩位廚師分流製作主餐與飲料。";
  } else if (task.type === "checkout") {
    const customer = findCustomer(state, task.customerId);
    if (customer && customer.state === "waitingPayment") payAndLeave(state, customer);
    finishTask(waiter);
  } else if (task.type === "clear") {
    const table = state.tables.find((item) => item.id === task.tableId);
    if (table) {
      table.dirty = false;
      table.orderState = "available";
    }
    state.message = "女服務生完成第 " + task.tableId + " 桌收桌。";
    finishTask(waiter);
  }
}

function assignFemaleTask(state) {
  const waiter = state.waiters.female;
  if (waiter.task || state.waiters.male.task || state.waiters.male.path.length || publicGuestMoving(state)) return;
  const checkout = state.customers.find((customer) => customer.state === "waitingPayment");
  if (checkout) {
    waiter.task = { type: "checkout", phase: "moving", customerId: checkout.id };
    waiter.path = [
      ...findPath(waiter, POINTS.cashierApproach, "staff"),
      ...findPath(POINTS.cashierApproach, POINTS.cashierService, "staff"),
    ];
    return;
  }
  const order = state.customers.find((customer) => customer.state === "waitingOrder");
  if (order) {
    order.state = "ordering";
    state.tables[order.tableId - 1].orderState = "ordering";
    waiter.task = { type: "order", phase: "moving", customerId: order.id, tableId: order.tableId };
    waiter.path = findPath(waiter, TABLES[order.tableId - 1].servicePoint, "staff");
    return;
  }
  const readyDrinkId = state.kitchen.drinkReady.find((id) => {
    const customer = findCustomer(state, id);
    return customer && customer.state === "waitingFood" && !customer.drinkDelivered;
  });
  if (readyDrinkId) {
    state.kitchen.drinkReady = state.kitchen.drinkReady.filter((id) => id !== readyDrinkId);
    const customer = findCustomer(state, readyDrinkId);
    waiter.task = { type: "drink", phase: "pickup", customerId: readyDrinkId, tableId: customer.tableId };
    waiter.path = findPath(waiter, POINTS.drinkPickupWaiter, "staff");
    return;
  }
  const dirty = state.tables.find((table) => table.dirty);
  if (dirty) {
    waiter.task = { type: "clear", phase: "moving", tableId: dirty.id };
    waiter.path = findPath(waiter, TABLES[dirty.id - 1].servicePoint, "staff");
  }
}

function finishTask(waiter) {
  waiter.task = null;
  waiter.path = findPath(waiter, waiter.idlePoint, waiter.navigationZone);
  waiter.walking = waiter.path.length > 0;
}

function staffTrafficBusy(state) {
  return Object.values(state.waiters).some((waiter) => waiter.task || waiter.path.length);
}

function publicGuestMoving(state) {
  return state.customers.some((customer) => [
    "seating",
    "toCheckoutQueue",
    "toCheckout",
    "toExitApproach",
    "leaving",
  ].includes(customer.state));
}

function removeFinishedCustomers(state) {
  const finished = state.customers.filter((customer) => customer.state === "done");
  for (const customer of finished) {
    const table = state.tables.find((item) => item.id === customer.tableId);
    if (table) {
      table.occupiedBy = null;
      table.dirty = true;
      table.orderState = "dirty";
    }
  }
  state.customers = state.customers.filter((customer) => customer.state !== "done");
}

function findCustomer(state, id) {
  return state.customers.find((customer) => customer.id === id);
}

function moveAlongPath(actor, speed, dt, state = null) {
  let remaining = speed * dt;
  while (remaining > 0 && actor.path.length) {
    const target = actor.path[0];
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const length = Math.hypot(dx, dy);
    const travel = Math.min(length, remaining);
    const candidate = length
      ? { x: actor.x + dx / length * travel, y: actor.y + dy / length * travel }
      : { x: target.x, y: target.y };
    const zone = actor.navigationZone || "dining";
    if (pointBlockedForZone(candidate, zone)) {
      actor.walking = false;
      actor.navigationError = { x: candidate.x, y: candidate.y, zone };
      return false;
    }
    if (state && (!reserveFootCell(state, actor, candidate) || positionOccupied(state, actor, candidate))) {
      actor.walking = false;
      return false;
    }
    if (length <= remaining + 0.001) {
      actor.x = target.x;
      actor.y = target.y;
      actor.path.shift();
      remaining -= length;
    } else {
      actor.x += dx / length * remaining;
      actor.y += dy / length * remaining;
      remaining = 0;
    }
  }
  return actor.path.length === 0;
}

function reserveFootCell(state, actor, point) {
  const key = Math.round(point.x / GRID_SIZE) + "," + Math.round(point.y / GRID_SIZE);
  const owner = state.reservations.get(key);
  if (owner && owner.owner !== actor.key) return false;
  state.reservations.set(key, {
    owner: actor.key,
    x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(point.y / GRID_SIZE) * GRID_SIZE,
    zone: actor.navigationZone || "dining",
  });
  return true;
}

function positionOccupied(state, actor, point) {
  const space = collisionSpace(point);
  return allActors(state).some((item) => item !== actor && collisionSpace(item) === space && Math.hypot(item.x - point.x, item.y - point.y) < 34);
}

function collisionSpace(point) {
  if (point.x <= 459 && point.y <= 300) return "kitchen";
  if (insideRect(point, CASHIER_STAFF_ZONE)) return "cashier";
  return "public";
}

function allActors(state) {
  return [
    state.kitchen.chef,
    state.kitchen.drinkChef,
    state.waiters.male,
    state.waiters.female,
    ...state.customers.filter((customer) => customer.state !== "done" && !customer.seated),
  ];
}

export function validateScene(state = null) {
  const checks = [];
  const failures = [];
  const record = (name, passed, detail = {}) => {
    checks.push({ name, passed });
    if (!passed) failures.push({
      name,
      coordinate: detail.coordinate || null,
      actor: detail.actor || "—",
      object: detail.object || "—",
      suggestion: detail.suggestion || "修正互動點或碰撞區域",
    });
  };
  const legal = (name, point, zone, object = name) => record(name, !pointBlockedForZone(point, zone), {
    coordinate: point,
    object,
    suggestion: `將 ${name} 移到 ${zone} 合法地板`,
  });

  for (const table of TABLES) {
    const seat = table.seatPoints[0];
    legal(`T${table.id} approachPoint`, table.seatApproachPoint, "dining", `table-${table.id}`);
    legal(`T${table.id} servicePoint`, table.servicePoint, "dining", `table-${table.id}`);
    record(`T${table.id} seatPoint 為 seated-only`, pointBlocked(seat) && insideRect(seat, table.chairBlockedArea), {
      coordinate: seat,
      object: `table-${table.id} chair`,
      suggestion: "把 seatPoint 對齊椅面腳底位置並留在椅子 blocked area 內",
    });
    const head = { left: table.servicePoint.x - 24, right: table.servicePoint.x + 24, top: table.servicePoint.y - 80, bottom: table.servicePoint.y - 35 };
    const cover = { left: table.cover.x, top: table.cover.y, right: table.cover.x + table.cover.w, bottom: table.cover.y + table.cover.h };
    record(`T${table.id} servicePoint 不壓桌面`, !rectsOverlap(head, cover), {
      coordinate: table.servicePoint,
      object: `table-${table.id}`,
      suggestion: "把 servicePoint 往合法走道外移",
    });
    record(`T${table.id} servicePoint 不在鎖定遮罩`, !insideRect(table.servicePoint, {
      left: table.lockRect.x,
      top: table.lockRect.y,
      right: table.lockRect.x + table.lockRect.w,
      bottom: table.lockRect.y + table.lockRect.h,
    }), {
      coordinate: table.servicePoint,
      object: `table-${table.id} locked overlay`,
      suggestion: "把 servicePoint 移到鎖定桌區之外",
    });
  }

  WAITING_QUEUE_POINTS.forEach((point, index) => legal(`waitingQueuePoint ${index + 1}`, point, "queue", "entrance queue"));
  legal("cashierCustomerPoint", POINTS.checkoutCustomer, "dining", "cashier customer side");
  legal("cashierCustomerQueuePoint", POINTS.checkoutQueue, "dining", "cashier customer queue");
  legal("cashierStaffPoint", POINTS.cashierService, "staff", "cashier staff side");
  legal("cashierStaffEntryPoint", POINTS.cashierApproach, "staff", "cashier staff entry");
  record("cashierStaffPoint 僅限員工", pointBlocked(POINTS.cashierService), {
    coordinate: POINTS.cashierService,
    object: "cashier staff side",
    suggestion: "把員工點留在 staff-only 區域",
  });
  const counter = BLOCKED_RECTS.find((rect) => rect.name === "cashier-counter");
  record("收銀台本體隔開客人與店員", Boolean(counter)
    && POINTS.cashierService.y < counter.top
    && POINTS.checkoutCustomer.y > counter.bottom, {
    coordinate: POINTS.checkoutCustomer,
    object: "cashier-counter",
    suggestion: "員工站櫃體上緣之上、客人站下緣之下，中間隔著櫃體",
  });

  for (const [name, point] of Object.entries(KITCHEN_POINTS)) legal(`kitchen ${name}`, point, "kitchen", "kitchen");
  legal("pickupWaiterPoint", POINTS.pickupWaiter, "dining", "food pass");
  legal("drinkPickupPoint", POINTS.drinkPickupWaiter, "staff", "drink pass");

  if (state) {
    for (const actor of sceneActors(state)) {
      const seatedException = actor.kind === "customer" && actor.value.seated;
      const validAnchor = seatedException
        ? validSeatedAnchor(actor.value)
        : !pointBlockedForZone(actor.value, actor.value.navigationZone || actor.zone);
      record(`${actor.label} 腳底 anchor 合法`, validAnchor, {
        coordinate: { x: actor.value.x, y: actor.value.y },
        actor: actor.label,
        object: actor.value.state || actor.value.task?.type || actor.value.navigationZone || actor.zone,
        suggestion: seatedException ? "修正 seatPoint 或坐姿腳底 anchor" : "修正路徑或角色合法區域",
      });
      record(`${actor.label} 路徑不穿 blocked tile`, pathIsLegal(actor.value, actor.value.navigationZone || actor.zone), {
        coordinate: actor.value.path?.[0] || { x: actor.value.x, y: actor.value.y },
        actor: actor.label,
        object: "current path",
        suggestion: "重新計算路徑或修正目的 interaction point",
      });
    }

    const reservationOwners = new Set();
    for (const reservation of state.reservations.values()) {
      const unique = !reservationOwners.has(`${reservation.x},${reservation.y}`);
      reservationOwners.add(`${reservation.x},${reservation.y}`);
      record(`預約格 ${reservation.x},${reservation.y} 唯一`, unique, {
        coordinate: reservation,
        actor: reservation.owner,
        object: "next reservation",
        suggestion: "讓後到角色停下等待",
      });
      record(`預約格 ${reservation.x},${reservation.y} 合法`, !pointBlockedForZone(reservation, reservation.zone), {
        coordinate: reservation,
        actor: reservation.owner,
        object: "next reservation",
        suggestion: "拒絕此移動並重算合法路徑",
      });
    }
  }

  return {
    status: failures.length ? "FAIL" : "PASS",
    passed: checks.length - failures.length,
    total: checks.length,
    checks,
    failures,
  };
}

function sceneActors(state) {
  return [
    { kind: "chef", label: "主餐廚師", value: state.kitchen.chef, zone: "kitchen" },
    { kind: "chef", label: "飲料廚師", value: state.kitchen.drinkChef, zone: "kitchen" },
    { kind: "waiter", label: "男服務生", value: state.waiters.male, zone: "dining" },
    { kind: "waiter", label: "女服務生", value: state.waiters.female, zone: "staff" },
    ...state.customers.filter((customer) => customer.state !== "done").map((customer) => ({
      kind: "customer",
      label: `客人 ${customer.id}`,
      value: customer,
      zone: customer.navigationZone || "dining",
    })),
  ];
}

function validSeatedAnchor(customer) {
  const table = TABLES[customer.tableId - 1];
  if (!table) return false;
  const seat = table.seatPoints[0];
  if (!customer.transition) return distance(customer, seat) < 0.5;
  const approach = table.seatApproachPoint;
  const corridor = {
    left: Math.min(seat.x, approach.x) - 4,
    right: Math.max(seat.x, approach.x) + 4,
    top: Math.min(seat.y, approach.y) - 4,
    bottom: Math.max(seat.y, approach.y) + 4,
  };
  return insideRect(customer, corridor);
}

function pathIsLegal(actor, zone) {
  let previous = { x: actor.x, y: actor.y };
  for (const point of actor.path || []) {
    if (pointBlockedForZone(point, zone) || !segmentIsLegal(previous, point, (sample) => pointBlockedForZone(sample, zone))) return false;
    previous = point;
  }
  return true;
}

function rectsOverlap(first, second) {
  return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}

export function serializeState(state, now = Date.now()) {
  return {
    version: SAVE_VERSION,
    running: state.running,
    coins: Math.max(0, Math.floor(state.coins)),
    served: Math.max(0, Math.floor(state.served)),
    upgrades: { ...state.upgrades },
    lastSavedAt: now,
  };
}

export function normalizeSave(value) {
  if (!value || value.version !== SAVE_VERSION || !value.upgrades) return null;
  const upgrades = {
    chef: clampInt(value.upgrades.chef, 0, 50),
    waiter: clampInt(value.upgrades.waiter, 0, 50),
    tables: clampInt(value.upgrades.tables, 1, 4),
    income: clampInt(value.upgrades.income, 0, 50),
  };
  return {
    version: SAVE_VERSION,
    running: Boolean(value.running),
    coins: clampInt(value.coins, 0, Number.MAX_SAFE_INTEGER),
    served: clampInt(value.served, 0, Number.MAX_SAFE_INTEGER),
    upgrades,
    lastSavedAt: Number.isFinite(Number(value.lastSavedAt)) ? Number(value.lastSavedAt) : Date.now(),
  };
}

export function hydrateState(save, now = Date.now()) {
  const normalized = normalizeSave(save);
  const state = freshState(now);
  if (!normalized) return state;
  state.running = normalized.running;
  state.coins = normalized.coins;
  state.served = normalized.served;
  state.upgrades = { ...normalized.upgrades };
  state.lastSavedAt = now;
  state.message = normalized.running ? "歡迎回來，小館恢復自動營運。" : "進度已載入，按下開始繼續營運。";
  return state;
}

export function calculateOfflineIncome(save, now = Date.now()) {
  const normalized = normalizeSave(save);
  if (!normalized || !normalized.running) return { seconds: 0, amount: 0 };
  const seconds = Math.max(0, Math.min(4 * 60 * 60, (now - normalized.lastSavedAt) / 1000));
  const tableRate = normalized.upgrades.tables / 10;
  const chefRate = 1 / chefSeconds(normalized.upgrades.chef);
  const waiterRate = waiterSpeed(normalized.upgrades.waiter) / 1_000;
  const ordersPerSecond = Math.min(tableRate, chefRate, waiterRate);
  const amount = Math.floor(seconds * ordersPerSecond * incomePerGuest(normalized.upgrades.income) * 0.25);
  return { seconds: Math.floor(seconds), amount };
}

function clampInt(value, min, max) {
  const number = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : min;
  return Math.min(max, Math.max(min, number));
}
