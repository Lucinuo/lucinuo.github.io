export const SAVE_VERSION = 1;
export const SAVE_KEY = "restaurant-rookie-idle-v1";
export const WORLD = { width: 960, height: 540 };

export const POINTS = {
  entrance: { x: 150, y: 510 },
  queue: { x: 150, y: 420 },
  hub: { x: 450, y: 420 },
  pass: { x: 410, y: 300 },
  checkout: { x: 330, y: 420 },
};

export const TABLES = [
  { id: 1, seat: { x: 548, y: 171 }, service: { x: 535, y: 230 }, cover: { x: 555, y: 105, w: 74, h: 60 } },
  { id: 2, seat: { x: 748, y: 171 }, service: { x: 740, y: 230 }, cover: { x: 755, y: 105, w: 74, h: 60 } },
  { id: 3, seat: { x: 538, y: 371 }, service: { x: 530, y: 410 }, cover: { x: 545, y: 312, w: 74, h: 62 } },
  { id: 4, seat: { x: 748, y: 371 }, service: { x: 740, y: 410 }, cover: { x: 755, y: 314, w: 74, h: 62 } },
];

const LOCATION_PATHS = {
  queue: [{ x: 320, y: 420 }, POINTS.queue],
  pass: [{ x: 450, y: 330 }, { x: 410, y: 330 }, POINTS.pass],
  table1: [{ x: 500, y: 420 }, { x: 500, y: 230 }, TABLES[0].service],
  table2: [{ x: 690, y: 420 }, { x: 690, y: 230 }, TABLES[1].service],
  table3: [{ x: 500, y: 420 }, TABLES[2].service],
  table4: [{ x: 690, y: 420 }, TABLES[3].service],
  checkout: [{ x: 380, y: 420 }, POINTS.checkout],
};

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
  return 1 + upgrades.chef + upgrades.waiter + upgrades.income + upgrades.tables - 1;
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
    tables: TABLES.map((table) => ({ id: table.id, occupiedBy: null })),
    kitchen: { queue: [], active: null, timer: 0, ready: [] },
    waiter: { x: POINTS.checkout.x + 35, y: POINTS.checkout.y, path: [], task: null, location: "checkout", walking: false },
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
  state.message = type === "tables" ? `解鎖第 ${state.upgrades.tables} 張餐桌。` : `${upgradeLabel(type)}升到 Lv.${state.upgrades[type]}。`;
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
  if (state.spawnTimer <= 0 && state.customers.length < MAX_CUSTOMERS) {
    spawnCustomer(state);
    state.spawnTimer = 3.8;
  }

  updateCustomers(state, step);
  updateKitchen(state, step);
  updateWaiter(state, step);
  assignWaiterTask(state);
  removeFinishedCustomers(state);
  return state;
}

function spawnCustomer(state) {
  const id = state.nextCustomerId++;
  const queueOffset = state.customers.filter((customer) => customer.state === "queueing" || customer.state === "entering").length * 26;
  state.customers.push({
    id,
    variant: id % 2,
    state: "entering",
    x: POINTS.entrance.x,
    y: POINTS.entrance.y + 28,
    path: [{ x: POINTS.entrance.x, y: POINTS.entrance.y }, { x: POINTS.queue.x, y: POINTS.queue.y + queueOffset }],
    timer: 0,
    tableId: null,
    walking: true,
    walkFrame: 0,
    paid: false,
  });
  state.message = "新客人進店，正在門口等候。";
}

function updateCustomers(state, dt) {
  for (const customer of state.customers) {
    customer.walking = false;
    if (["entering", "seating", "checkout", "leaving"].includes(customer.state)) {
      customer.walking = customer.path.length > 0;
      const reached = moveAlongPath(customer, waiterSpeed(state.upgrades.waiter) * 0.82, dt);
      customer.walkFrame = Math.floor(state.elapsed * 6) % 2;
      if (!reached) continue;
      if (customer.state === "entering") customer.state = "queueing";
      else if (customer.state === "seating") beginOrdering(state, customer);
      else if (customer.state === "checkout") beginPayment(customer);
      else customer.state = "done";
      continue;
    }

    if (customer.state === "ordering") {
      customer.timer -= dt;
      if (customer.timer <= 0) {
        customer.state = "waitingFood";
        state.kitchen.queue.push(customer.id);
        state.message = `第 ${customer.tableId} 桌已點餐。`;
      }
    } else if (customer.state === "eating") {
      customer.timer -= dt;
      if (customer.timer <= 0) sendToCheckout(customer);
    } else if (customer.state === "paying") {
      customer.timer -= dt;
      if (customer.timer <= 0) payAndLeave(state, customer);
    }
  }
}

function beginOrdering(state, customer) {
  const table = TABLES[customer.tableId - 1];
  customer.x = table.seat.x;
  customer.y = table.seat.y;
  customer.state = "ordering";
  customer.timer = 1.4;
  customer.walking = false;
  state.message = `第 ${customer.tableId} 桌正在點餐。`;
}

function sendToCheckout(customer) {
  customer.state = "checkout";
  customer.path = routeBetween(`table${customer.tableId}`, "checkout");
  customer.walking = true;
}

function beginPayment(customer) {
  customer.state = "paying";
  customer.timer = 0.9;
}

function payAndLeave(state, customer) {
  const income = incomePerGuest(state.upgrades.income);
  customer.paid = true;
  customer.state = "leaving";
  customer.path = [{ x: 220, y: 420 }, POINTS.queue, POINTS.entrance, { x: POINTS.entrance.x, y: POINTS.entrance.y + 35 }];
  state.coins += income;
  state.served += 1;
  state.lastIncome = income;
  state.message = `客人結帳，獲得 ${income} 金幣。`;
}

function updateKitchen(state, dt) {
  if (!state.kitchen.active && state.kitchen.queue.length) {
    state.kitchen.active = state.kitchen.queue.shift();
    state.kitchen.timer = chefSeconds(state.upgrades.chef);
    state.message = "廚師開始製作餐點。";
  }
  if (!state.kitchen.active) return;
  state.kitchen.timer -= dt;
  if (state.kitchen.timer > 0) return;
  state.kitchen.ready.push(state.kitchen.active);
  state.kitchen.active = null;
  state.kitchen.timer = 0;
  state.message = "餐點完成，等待服務員送餐。";
}

function updateWaiter(state, dt) {
  state.waiter.walking = state.waiter.path.length > 0;
  if (!state.waiter.task) return;
  const reached = moveAlongPath(state.waiter, waiterSpeed(state.upgrades.waiter), dt);
  if (!reached) return;
  const { type, phase, customerId, destination } = state.waiter.task;
  if (type === "escort" && phase === "pickup") {
    const customer = findCustomer(state, customerId);
    if (!customer || customer.state !== "queueing") return finishWaiterTask(state, "queue");
    customer.state = "seating";
    customer.path = routeBetween("queue", destination);
    state.waiter.task.phase = "lead";
    state.waiter.path = routeBetween("queue", destination);
    state.message = `服務員帶客人前往第 ${customer.tableId} 桌。`;
  } else if (type === "escort") {
    finishWaiterTask(state, destination);
  } else if (type === "deliver" && phase === "pickup") {
    state.waiter.task.phase = "table";
    state.waiter.path = routeBetween("pass", destination);
  } else if (type === "deliver") {
    const customer = findCustomer(state, customerId);
    if (customer && customer.state === "waitingFood") {
      customer.state = "eating";
      customer.timer = 4.2;
      state.message = `第 ${customer.tableId} 桌開始用餐。`;
    }
    finishWaiterTask(state, destination);
  }
}

function assignWaiterTask(state) {
  if (state.waiter.task) return;
  const freeTable = state.tables.find((table) => table.id <= state.upgrades.tables && table.occupiedBy === null);
  const queuedCustomer = state.customers.find((customer) => customer.state === "queueing" && customer.tableId === null);
  if (freeTable && queuedCustomer) {
    freeTable.occupiedBy = queuedCustomer.id;
    queuedCustomer.tableId = freeTable.id;
    state.waiter.task = { type: "escort", phase: "pickup", customerId: queuedCustomer.id, destination: `table${freeTable.id}` };
    state.waiter.path = routeBetween(state.waiter.location, "queue");
    return;
  }
  const readyId = state.kitchen.ready.shift();
  if (!readyId) return;
  const customer = findCustomer(state, readyId);
  if (!customer || customer.state !== "waitingFood") return;
  state.waiter.task = { type: "deliver", phase: "pickup", customerId: readyId, destination: `table${customer.tableId}` };
  state.waiter.path = routeBetween(state.waiter.location, "pass");
}

function finishWaiterTask(state, location) {
  state.waiter.location = location;
  state.waiter.task = null;
  state.waiter.path = [];
  state.waiter.walking = false;
}

function removeFinishedCustomers(state) {
  const finished = state.customers.filter((customer) => customer.state === "done");
  for (const customer of finished) {
    const table = state.tables.find((item) => item.id === customer.tableId);
    if (table) table.occupiedBy = null;
  }
  state.customers = state.customers.filter((customer) => customer.state !== "done");
}

function findCustomer(state, id) {
  return state.customers.find((customer) => customer.id === id);
}

function moveAlongPath(actor, speed, dt) {
  let remaining = speed * dt;
  while (remaining > 0 && actor.path.length) {
    const target = actor.path[0];
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= remaining + 0.001) {
      actor.x = target.x;
      actor.y = target.y;
      actor.path.shift();
      remaining -= distance;
    } else {
      actor.x += dx / distance * remaining;
      actor.y += dy / distance * remaining;
      remaining = 0;
    }
  }
  return actor.path.length === 0;
}

export function routeBetween(from, to) {
  if (from === to) return [];
  const fromPath = LOCATION_PATHS[from] || [];
  const toPath = LOCATION_PATHS[to] || [];
  return [...fromPath].reverse().concat([POINTS.hub], toPath).filter((point, index, list) => index === 0 || point.x !== list[index - 1].x || point.y !== list[index - 1].y);
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
  const tableRate = normalized.upgrades.tables / 8;
  const chefRate = 1 / chefSeconds(normalized.upgrades.chef);
  const waiterRate = waiterSpeed(normalized.upgrades.waiter) / 900;
  const ordersPerSecond = Math.min(tableRate, chefRate, waiterRate);
  const amount = Math.floor(seconds * ordersPerSecond * incomePerGuest(normalized.upgrades.income) * 0.25);
  return { seconds: Math.floor(seconds), amount };
}

function clampInt(value, min, max) {
  const number = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : min;
  return Math.min(max, Math.max(min, number));
}
