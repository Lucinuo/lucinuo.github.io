export const WORLD = { width: 960, height: 540, grid: 20 };

export const FURNITURE = [
  { id: "outer-wall-left", label: "左側牆體", kind: "wall", x: 0, y: 0, width: 40, height: 540 },
  { id: "outer-wall-right", label: "右側牆體", kind: "wall", x: 920, y: 0, width: 40, height: 540 },
  { id: "bottom-wall-left", label: "入口左側牆體", kind: "wall", x: 0, y: 440, width: 420, height: 100 },
  { id: "bottom-wall-right", label: "入口右側牆體", kind: "wall", x: 520, y: 440, width: 440, height: 100 },
  { id: "entrance-door", label: "中央入口門", kind: "door", x: 420, y: 440, width: 100, height: 80, dynamic: true },
  { id: "kitchen-backline", label: "廚房設備列", kind: "kitchen", x: 40, y: 20, width: 420, height: 120 },
  { id: "kitchen-divider", label: "廚房右側隔牆", kind: "wall", x: 460, y: 20, width: 40, height: 220 },
  { id: "service-counter", label: "廚房出餐櫃", kind: "counter", x: 40, y: 200, width: 380, height: 80 },
  { id: "service-counter-return", label: "出餐櫃右側轉角", kind: "counter", x: 420, y: 220, width: 80, height: 60 },
  { id: "cashier-counter", label: "收銀台", kind: "counter", x: 160, y: 340, width: 160, height: 80 },
  { id: "table-1", label: "餐桌 1（含椅）", kind: "table", x: 560, y: 140, width: 100, height: 100 },
  { id: "table-2", label: "餐桌 2（含椅）", kind: "table", x: 740, y: 140, width: 100, height: 100 },
  { id: "table-3", label: "餐桌 3（含椅）", kind: "table", x: 560, y: 300, width: 100, height: 100 },
  { id: "table-4", label: "餐桌 4（含椅）", kind: "table", x: 740, y: 300, width: 100, height: 100 },
  { id: "plant-top-right", label: "右上植栽", kind: "decor", x: 880, y: 60, width: 40, height: 80 },
  { id: "plant-bottom-left", label: "左下植栽", kind: "decor", x: 40, y: 380, width: 60, height: 60 },
  { id: "plant-bottom-right", label: "右下植栽", kind: "decor", x: 880, y: 380, width: 40, height: 60 },
];

export const COLLISION_RECTS = FURNITURE.map(({ id, label, x, y, width, height, dynamic = false }) => ({
  id,
  label,
  left: x,
  top: y,
  right: x + width,
  bottom: y + height,
  dynamic,
}));

export const ROLE_WALKABLE_AREAS = {
  customer: [
    { id: "dining-upper", label: "右側客席", left: 500, top: 100, right: 920, bottom: 440 },
    { id: "dining-lower", label: "下方公共區", left: 320, top: 280, right: 920, bottom: 440 },
    { id: "cashier-customer", label: "收銀台顧客側", left: 160, top: 420, right: 420, bottom: 440 },
    { id: "entrance-lane", label: "中央入口通道", left: 420, top: 420, right: 520, bottom: 540 },
  ],
  waiter: [
    { id: "dining-upper", label: "右側客席", left: 500, top: 100, right: 920, bottom: 440 },
    { id: "service-floor", label: "服務與收銀區", left: 40, top: 280, right: 920, bottom: 440 },
    { id: "entrance-lane", label: "入口帶位通道", left: 420, top: 420, right: 520, bottom: 540 },
  ],
  chef: [
    { id: "kitchen-floor", label: "廚房工作區", left: 40, top: 140, right: 460, bottom: 200 },
  ],
};

export const INTERACTION_POINTS = [
  { id: "customerSpawn", label: "客人生成", role: "customer", x: 450, y: 530, note: "門外進場線" },
  { id: "entranceDoor", label: "入口門", role: "customer", x: 450, y: 490, note: "進出時切換開門圖層" },
  { id: "entranceInside", label: "入口內側", role: "customer", x: 450, y: 430 },
  { id: "exitDoor", label: "離場門線", role: "customer", x: 510, y: 490, note: "與進場線分流" },
  { id: "waitingQueue1", label: "候位 1", role: "customer", x: 470, y: 410 },
  { id: "waitingQueue2", label: "候位 2", role: "customer", x: 470, y: 370 },
  { id: "waitingQueue3", label: "候位 3", role: "customer", x: 470, y: 330 },
  { id: "cashierCustomer", label: "顧客結帳", role: "customer", x: 250, y: 430 },
  { id: "cashierQueue", label: "結帳候位", role: "customer", x: 330, y: 430 },
  { id: "cashierStaff", label: "收銀店員", role: "waiter", x: 250, y: 330 },
  { id: "cashierStaffEntry", label: "收銀台員工入口", role: "waiter", x: 330, y: 330 },
  { id: "foodPickupKitchen", label: "主餐廚房側", role: "chef", x: 390, y: 190 },
  { id: "foodPickupWaiter", label: "主餐服務側", role: "waiter", x: 390, y: 290 },
  { id: "drinkBar", label: "飲料製作", role: "chef", x: 430, y: 150 },
  { id: "drinkPickupKitchen", label: "飲料廚房側", role: "chef", x: 430, y: 190 },
  { id: "drinkPickupWaiter", label: "飲料服務側", role: "waiter", x: 430, y: 290 },
  { id: "stovePoint", label: "爐台", role: "chef", x: 170, y: 150 },
  { id: "prepPoint", label: "備餐", role: "chef", x: 270, y: 170 },
  { id: "sinkPoint", label: "水槽", role: "chef", x: 330, y: 150 },
];

export const TABLE_POINTS = [
  { id: 1, approachPoint: { x: 530, y: 190 }, seatPoint: { x: 570, y: 210 }, servicePoint: { x: 670, y: 190 }, facing: "right" },
  { id: 2, approachPoint: { x: 710, y: 190 }, seatPoint: { x: 750, y: 210 }, servicePoint: { x: 850, y: 190 }, facing: "right" },
  { id: 3, approachPoint: { x: 530, y: 350 }, seatPoint: { x: 570, y: 370 }, servicePoint: { x: 670, y: 350 }, facing: "right" },
  { id: 4, approachPoint: { x: 710, y: 350 }, seatPoint: { x: 750, y: 370 }, servicePoint: { x: 850, y: 350 }, facing: "right" },
];

export function insideRect(point, rect) {
  return point.x >= rect.left && point.x < rect.right && point.y >= rect.top && point.y < rect.bottom;
}

export function pointBlocked(point, { doorOpen = false } = {}) {
  return COLLISION_RECTS.some((rect) => !(doorOpen && rect.id === "entrance-door") && insideRect(point, rect));
}

export function roleWalkable(role, point, options) {
  return ROLE_WALKABLE_AREAS[role].some((area) => insideRect(point, area)) && !pointBlocked(point, options);
}
