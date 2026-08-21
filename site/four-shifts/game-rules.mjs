export const MENU = {
  tomato: { label: "番茄麵", sauce: "番茄醬", topping: "起司", dish: "tomato" },
  cream: { label: "白醬麵", sauce: "白醬", topping: "蘑菇", dish: "cream" },
  pesto: { label: "青醬麵", sauce: "青醬", topping: "堅果", dish: "pesto" },
};

export const DONENESS = {
  firm: { label: "偏硬", seconds: 5 },
  normal: { label: "正常", seconds: 7 },
  soft: { label: "偏軟", seconds: 9 },
};

export const SHIFTS = [
  { label: "第 1 班", rush: "開店準備", known: 2 },
  { label: "第 2 班", rush: "午餐尖峰", known: 4 },
  { label: "第 3 班", rush: "店內消毒", known: 6 },
  { label: "第 4 班", rush: "晚餐回升", known: 7 },
];

export const STEPS = ["確認桌號與餐點", "選麵並下鍋", "依熟度計時", "起鍋瀝水", "拌入正確醬料", "加入指定配料", "送到正確桌號"];

const SCENE_HUB = [42, 46];
export const SCENE_DESTINATIONS = {
  order: [[38, 40]],
  cook: [[33, 43], [26, 42], [21, 40]],
  plate: [[37, 40], [34, 38]],
  1: [[45, 40], [47.5, 35.5]],
  2: [[61, 40], [64, 35.5]],
  3: [[39, 50], [40, 60], [41, 74]],
  4: [[61, 45], [62, 56]],
  5: [[61, 45], [66, 60], [66, 71]],
};
export const SCENE_BLOCKERS = [
  [0, 0, 43, 38], [46, 11, 61, 34], [64, 11, 79, 34],
  [23, 62, 39, 92], [44, 49, 59, 76], [69, 56, 84, 84],
  [87, 30, 100, 60],
];
export const GUEST_PATHS = {
  male: { table: 1, walk: [[10, 64], [19, 56], [34, 47], [53, 40], [61.5, 35], [61.5, 29]], seat: [54, 23] },
  female: { table: 2, walk: [[10, 64], [19, 56], [34, 47], [53, 40], [63, 35], [63, 29]], seat: [71, 23] },
};

export function routeBetween(from, to) {
  const outbound = [SCENE_HUB, ...SCENE_DESTINATIONS[to]];
  if (from === "hub" || !SCENE_DESTINATIONS[from]) return outbound;
  return [...SCENE_DESTINATIONS[from]].reverse().concat(outbound);
}

export function createMotion(route) {
  const points = route.map(([x, y]) => [Number(x), Number(y)]);
  const [x = 0, y = 0] = points[0] || [];
  return { route: points, segment: 0, x, y, speed: 0, distance: 0, direction: "down", frame: 0, done: points.length < 2 };
}

export function advanceMotion(state, dt, options = {}) {
  if (state.done || dt <= 0) return state;
  const maxSpeed = options.maxSpeed ?? 190;
  const acceleration = options.acceleration ?? 520;
  const deceleration = options.deceleration ?? 620;
  const stride = options.stride ?? 34;
  const remaining = remainingDistance(state);
  if (remaining <= 0.25) return finishMotion(state);

  const targetSpeed = Math.min(maxSpeed, Math.sqrt(2 * deceleration * remaining));
  const rate = targetSpeed >= state.speed ? acceleration : deceleration;
  const speed = moveTowards(state.speed, targetSpeed, rate * dt);
  let travel = Math.min(remaining, (state.speed + speed) * 0.5 * dt);
  let moved = 0;
  let segment = state.segment;
  let x = state.x;
  let y = state.y;

  while (travel > 0 && segment < state.route.length - 1) {
    const [tx, ty] = state.route[segment + 1];
    const dx = tx - x;
    const dy = ty - y;
    const length = Math.hypot(dx, dy);
    if (length <= travel + 1e-6) {
      x = tx;
      y = ty;
      travel -= length;
      moved += length;
      segment += 1;
    } else {
      const ratio = travel / length;
      x += dx * ratio;
      y += dy * ratio;
      moved += travel;
      travel = 0;
    }
  }

  if (segment >= state.route.length - 1) return finishMotion({ ...state, segment, x, y, distance: state.distance + moved });
  const [tx, ty] = state.route[segment + 1];
  const dx = tx - x;
  const dy = ty - y;
  const direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  const distance = state.distance + moved;
  return { ...state, segment, x, y, speed, distance, direction, frame: 1 + Math.floor(distance / stride) % 4 };
}

function remainingDistance(state) {
  let total = 0;
  let x = state.x;
  let y = state.y;
  for (let index = state.segment + 1; index < state.route.length; index += 1) {
    const [tx, ty] = state.route[index];
    total += Math.hypot(tx - x, ty - y);
    x = tx;
    y = ty;
  }
  return total;
}

function finishMotion(state) {
  const [x, y] = state.route.at(-1) || [state.x, state.y];
  return { ...state, segment: Math.max(0, state.route.length - 1), x, y, speed: 0, frame: 0, done: true };
}

function moveTowards(value, target, amount) {
  if (value < target) return Math.min(target, value + amount);
  return Math.max(target, value - amount);
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createOrder(id, seed = id - 1) {
  const dishes = Object.keys(MENU);
  const doneness = Object.keys(DONENESS);
  return {
    id,
    table: seed % 5 + 1,
    dish: dishes[seed % dishes.length],
    doneness: doneness[(seed * 2 + 1) % doneness.length],
    status: "waiting",
    cookScore: 0,
    plateScore: 0,
  };
}

export function freshState() {
  return {
    version: 1,
    station: "order",
    shift: 0,
    day: 1,
    completed: 0,
    reputation: 50,
    orders: [createOrder(1, 0)],
    pots: [null, null, null],
    plate: { sauce: "", topping: "" },
    floorTasks: [],
    interruption: null,
    seenInterruptions: [],
  };
}

export function scoreDoneness(elapsedSeconds, target) {
  const difference = Math.abs(elapsedSeconds - DONENESS[target].seconds);
  if (difference <= 1) return 100;
  if (difference <= 2.5) return 70;
  if (difference <= 4) return 40;
  return 15;
}

export function scorePlate(order, sauce, topping) {
  const recipe = MENU[order.dish];
  return (sauce === recipe.sauce ? 50 : 0) + (topping === recipe.topping ? 50 : 0);
}

export function completeDelivery(state, orderId) {
  const order = state.orders.find((item) => item.id === orderId && item.status === "ready");
  if (!order) return state;
  const quality = Math.round((order.cookScore + order.plateScore) / 2);
  const completed = state.completed + 1;
  const shift = Math.min(SHIFTS.length, completed);
  const nextId = Math.max(...state.orders.map((item) => item.id)) + 1;
  return {
    ...state,
    shift,
    day: shift < SHIFTS.length ? 1 : Math.floor((completed - SHIFTS.length) / 3) + 1,
    completed,
    reputation: clamp(state.reputation + Math.round((quality - 55) / 10), 0, 100),
    orders: [...state.orders.filter((item) => item.id !== orderId), createOrder(nextId, nextId + completed)],
    floorTasks: [...state.floorTasks, { id: `clear-${completed}`, table: order.table, type: "收桌" }].slice(-2),
    plate: { sauce: "", topping: "" },
  };
}

export function periodFor(state) {
  if (state.shift < SHIFTS.length) return SHIFTS[state.shift];
  return { label: `日常營運・第 ${state.day} 天`, rush: state.completed % 3 === 1 ? "午餐尖峰" : "正常營業", known: STEPS.length };
}

export function normalizeSave(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.orders) || !Array.isArray(value.pots)) return null;
  return {
    ...freshState(),
    ...value,
    station: ["order", "cook", "plate", "floor"].includes(value.station) ? value.station : "order",
    reputation: clamp(Number(value.reputation) || 0, 0, 100),
    pots: value.pots.slice(0, 3).concat([null, null, null]).slice(0, 3),
  };
}
