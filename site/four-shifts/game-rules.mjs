export const SAVE_VERSION = 1;
export const SAVE_KEY = "restaurant-rookie-idle-v1";
export const WORLD = { width: 960, height: 540 };
export const GRID_SIZE = 20;

// Every world position is measured in the canvas's internal 960 x 540 space.
// Actor x/y values are always the bottom-centre foot anchor, never CSS pixels.

export const POINTS = {
  customerSpawn: { x: 120, y: 558 },
  entranceDoor: { x: 120, y: 520 },
  entranceInside: { x: 120, y: 490 },
  entranceMerge: { x: 140, y: 500 },
  queueHost: { x: 180, y: 370 },
  exit: { x: 120, y: 558 },
  pickupWaiter: { x: 470, y: 300 },
  checkoutCustomer: { x: 300, y: 480 },
  checkoutQueue: { x: 380, y: 480 },
  checkoutExitApproach: { x: 200, y: 480 },
  cashierService: { x: 300, y: 315 },
  cashierApproach: { x: 380, y: 315 },
};

export const KITCHEN_POINTS = {
  stove: { x: 200, y: 140 },
  prep: { x: 300, y: 250 },
  drinkBar: { x: 400, y: 140 },
  pickup: { x: 440, y: 270 },
};

export const TABLES = [
  {
    id: 1,
    seatApproachPoint: { x: 500, y: 220 },
    seatPoints: [{ x: 548, y: 202, facing: "right" }],
    servicePoint: { x: 600, y: 220 },
    cover: { x: 575, y: 118, w: 54, h: 47 },
    lockRect: { x: 530, y: 90, w: 120, h: 120 },
  },
  {
    id: 2,
    seatApproachPoint: { x: 700, y: 220 },
    seatPoints: [{ x: 748, y: 202, facing: "right" }],
    servicePoint: { x: 800, y: 220 },
    cover: { x: 775, y: 118, w: 54, h: 47 },
    lockRect: { x: 730, y: 90, w: 120, h: 120 },
  },
  {
    id: 3,
    seatApproachPoint: { x: 500, y: 430 },
    seatPoints: [{ x: 538, y: 407, facing: "right" }],
    servicePoint: { x: 580, y: 430 },
    cover: { x: 565, y: 325, w: 54, h: 48 },
    lockRect: { x: 520, y: 295, w: 120, h: 120 },
  },
  {
    id: 4,
    seatApproachPoint: { x: 700, y: 430 },
    seatPoints: [{ x: 748, y: 407, facing: "right" }],
    servicePoint: { x: 790, y: 430 },
    cover: { x: 775, y: 327, w: 54, h: 48 },
    lockRect: { x: 730, y: 295, w: 120, h: 120 },
  },
];

export const BLOCKED_RECTS = [
  { name: "kitchen-and-front-wall", left: 20, top: 0, right: 459, bottom: 299 },
  { name: "cashier", left: 220, top: 330, right: 362, bottom: 455 },
  { name: "table-1", left: 530, top: 100, right: 650, bottom: 205 },
  { name: "table-2", left: 730, top: 100, right: 850, bottom: 205 },
  { name: "table-3", left: 520, top: 300, right: 640, bottom: 410 },
  { name: "table-4", left: 730, top: 300, right: 850, bottom: 410 },
  { name: "left-plant", left: 20, top: 365, right: 75, bottom: 470 },
  { name: "right-shelf", left: 900, top: 190, right: 950, bottom: 300 },
  { name: "right-plant", left: 880, top: 430, right: 950, bottom: 510 },
];

export const KITCHEN_BLOCKED_RECTS = [
  { name: "back-counter", left: 20, top: 20, right: 440, bottom: 125 },
  { name: "left-storage", left: 20, top: 125, right: 105, bottom: 270 },
  { name: "prep-island", left: 215, top: 140, right: 355, bottom: 225 },
];

export const WAITING_QUEUE_POINTS = [
  { x: 120, y: 370 },
  { x: 120, y: 410 },
  { x: 120, y: 450 },
];

export const QUEUE_PROTECTED_ZONE = { left: 100, top: 350, right: 150, bottom: 470 };
export const CASHIER_STAFF_ZONE = { left: 240, top: 300, right: 360, bottom: 329 };
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
  return BLOCKED_RECTS.some((rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom);
}

export function kitchenPointBlocked(point) {
  const inKitchen = point.x >= 110 && point.x <= 450 && point.y >= 130 && point.y <= 280;
  if (!inKitchen) return true;
  return KITCHEN_BLOCKED_RECTS.some((rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom);
}

function inWalkableBounds(point) {
  const diningFloor = point.x >= 460 && point.x <= 920 && point.y >= 80 && point.y <= 500;
  const frontFloor = point.x >= 150 && point.x <= 460 && point.y >= 315 && point.y <= 500;
  const cashierPocket = point.x >= 240 && point.x <= 360 && point.y >= 300 && point.y < 330;
  const cashierSide = point.x >= 360 && point.x <= 460 && point.y >= 300 && point.y <= 500;
  const entranceRug = point.x >= 100 && point.x <= 150 && point.y >= 340 && point.y <= 540;
  const entranceMerge = point.x >= 140 && point.x <= 200 && point.y >= 480 && point.y <= 500;
  return diningFloor || frontFloor || cashierPocket || cashierSide || entranceRug || entranceMerge;
}

export function findPath(start, end, zone = "dining") {
  const isBlocked = zone === "kitchen"
    ? kitchenPointBlocked
    : (point) => pointBlocked(point, { allowQueue: zone === "queue", allowCashier: zone === "staff" });
  const startCell = nearestWalkableCell(start, isBlocked);
  const endCell = nearestWalkableCell(end, isBlocked);
  if (!startCell || !endCell) return [];
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
  if (distance(route.at(-1) || start, end) > 1) route.push({ ...end });
  return route;
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
    pickupWaiterOwner: null,
    kitchen: {
      queue: [],
      active: null,
      timer: 0,
      ready: [],
      phase: "idle",
      chef: { x: KITCHEN_POINTS.prep.x, y: KITCHEN_POINTS.prep.y, path: [], walking: false },
      drinkQueue: [],
      activeDrink: null,
      drinkTimer: 0,
      drinkReady: [],
      drinkPhase: "idle",
      drinkChef: { x: KITCHEN_POINTS.drinkBar.x, y: KITCHEN_POINTS.drinkBar.y, path: [], walking: false },
      pickupOwner: null,
    },
    waiters: {
      male: { x: 680, y: 270, path: [], task: null, walking: false, idlePoint: { x: 680, y: 270 }, navigationZone: "dining" },
      female: {
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
  state.elapsed += step;
  state.spawnTimer -= step;
  const guestLimit = Math.min(MAX_CUSTOMERS, state.upgrades.tables + 3);
  const waitingCount = state.customers.filter((customer) => ["entering", "queueing", "waitingEscort", "waitingQueueExit"].includes(customer.state)).length;
  if (state.spawnTimer <= 0 && state.customers.length < guestLimit && waitingCount < WAITING_QUEUE_POINTS.length && !entranceBusy(state)) {
    spawnCustomer(state);
    state.spawnTimer = 3.8;
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
    id,
    variant: id % 2,
    state: "entering",
    x: POINTS.customerSpawn.x,
    y: POINTS.customerSpawn.y,
    path: entrancePath(queueSpot),
    queueSpot: { ...queueSpot },
    timer: 0,
    waitTime: 0,
    mood: "normal",
    tableId: null,
    direction: "up",
    walking: true,
    walkFrame: 0,
    foodDelivered: false,
    drinkDelivered: false,
    paid: false,
    seated: false,
  });
  state.message = "新客人進店，正在門口等候。";
}

function updateCustomers(state, dt) {
  for (const customer of state.customers) {
    customer.walking = false;
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
  customer.x = seat.x;
  customer.y = seat.y;
  customer.direction = seat.facing;
  customer.state = "waitingOrder";
  customer.seated = true;
  customer.walking = false;
  state.tables[customer.tableId - 1].orderState = "waitingOrder";
  state.message = "第 " + customer.tableId + " 桌已入座，等待點餐。";
}

function sendToCheckout(state, customer) {
  const table = TABLES[customer.tableId - 1];
  const approach = table.seatApproachPoint;
  if (positionOccupied(state, customer, approach)) return;
  const cashierOccupied = checkoutBusy(state, customer);
  const queueOccupied = state.customers.some((item) => item !== customer && ["toCheckoutQueue", "waitingCheckoutSlot"].includes(item.state));
  if (cashierOccupied && queueOccupied) return;
  customer.x = approach.x;
  customer.y = approach.y;
  customer.seated = false;
  customer.state = cashierOccupied ? "toCheckoutQueue" : "toCheckout";
  customer.path = findPath(approach, cashierOccupied ? POINTS.checkoutQueue : POINTS.checkoutCustomer);
  customer.walking = true;
  state.tables[customer.tableId - 1].orderState = "checkout";
}

function entrancePath(queueSpot) {
  return [
    { ...POINTS.entranceDoor },
    { ...POINTS.entranceInside },
    ...findPath(POINTS.entranceInside, queueSpot, "queue"),
  ];
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
      customer.path = customer.state === "entering" ? entrancePath(target) : findPath(customer, target, "queue");
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
  return state.customers.some((item) => item !== customer && ["toCheckout", "waitingPayment"].includes(item.state));
}

function entranceBusy(state, customer = null) {
  return state.customers.some((item) => item !== customer && ["entering", "leaving"].includes(item.state));
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
  const queueSide = { x: 180, y: customer.y };
  const queueSideBottom = { x: 180, y: 480 };
  const routeToMerge = fromQueue
    ? [
        ...findPath(customer, queueSide, "queue"),
        queueSideBottom,
        ...findPath(queueSideBottom, POINTS.entranceMerge),
      ]
    : findPath(customer, POINTS.entranceMerge);
  customer.state = "leaving";
  customer.path = [...routeToMerge, { ...POINTS.entranceDoor }, { ...POINTS.exit }];
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
  if (kitchen.active && kitchen.phase === "waitingPickup" && reserveKitchenPickup(kitchen, "main")) {
    kitchen.phase = "toPickup";
    kitchen.chef.path = kitchenPath(kitchen.chef, KITCHEN_POINTS.pickup);
  }

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
      kitchen.pickupOwner = null;
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
    kitchen.phase = reserveKitchenPickup(kitchen, "main") ? "toPickup" : "waitingPickup";
    if (kitchen.phase === "toPickup") kitchen.chef.path = kitchenPath(kitchen.chef, KITCHEN_POINTS.pickup);
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
  if (kitchen.activeDrink && kitchen.drinkPhase === "waitingPickup" && reserveKitchenPickup(kitchen, "drink")) {
    kitchen.drinkPhase = "toPickup";
    chef.path = kitchenPath(chef, KITCHEN_POINTS.pickup);
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
      kitchen.pickupOwner = null;
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
  kitchen.drinkPhase = reserveKitchenPickup(kitchen, "drink") ? "toPickup" : "waitingPickup";
  if (kitchen.drinkPhase === "toPickup") chef.path = kitchenPath(chef, KITCHEN_POINTS.pickup);
}

function reserveKitchenPickup(kitchen, owner) {
  if (kitchen.pickupOwner && kitchen.pickupOwner !== owner) return false;
  kitchen.pickupOwner = owner;
  return true;
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
      customer.path = findPath(customer, TABLES[customer.tableId - 1].seatApproachPoint, "queue");
    }
    finishTask(waiter);
  } else if (task.type === "deliver" && task.phase === "pickup") {
    state.pickupWaiterOwner = null;
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
  if (waiter.task) return;
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
  if (!readyId || state.pickupWaiterOwner) return;
  state.kitchen.ready = state.kitchen.ready.filter((id) => id !== readyId);
  const readyCustomer = findCustomer(state, readyId);
  waiter.task = { type: "deliver", phase: "pickup", customerId: readyId, tableId: readyCustomer.tableId };
  state.pickupWaiterOwner = "male";
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
    state.pickupWaiterOwner = null;
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
  if (waiter.task) return;
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
  if (readyDrinkId && !state.pickupWaiterOwner) {
    state.kitchen.drinkReady = state.kitchen.drinkReady.filter((id) => id !== readyDrinkId);
    const customer = findCustomer(state, readyDrinkId);
    waiter.task = { type: "drink", phase: "pickup", customerId: readyDrinkId, tableId: customer.tableId };
    state.pickupWaiterOwner = "female";
    waiter.path = findPath(waiter, POINTS.pickupWaiter, "staff");
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
    if (state && positionOccupied(state, actor, candidate)) {
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

function positionOccupied(state, actor, point) {
  const space = collisionSpace(point);
  return allActors(state).some((item) => item !== actor && collisionSpace(item) === space && Math.hypot(item.x - point.x, item.y - point.y) < 34);
}

function collisionSpace(point) {
  if (point.x <= 459 && point.y <= 299) return "kitchen";
  if (point.x >= 240 && point.x <= 360 && point.y >= 300 && point.y < 330) return "cashier";
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
