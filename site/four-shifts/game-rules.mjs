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
