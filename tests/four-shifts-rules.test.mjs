import assert from "node:assert/strict";
import {
  BLOCKED_RECTS,
  CASHIER_STAFF_ZONE,
  KITCHEN_BLOCKED_RECTS,
  KITCHEN_POINTS,
  POINTS,
  QUEUE_PROTECTED_ZONE,
  TABLES,
  WAITING_QUEUE_POINTS,
  WORLD,
  calculateOfflineIncome,
  chefSeconds,
  findPath,
  freshState,
  hydrateState,
  incomePerGuest,
  kitchenPointBlocked,
  normalizeSave,
  purchaseUpgrade,
  pointBlocked,
  routeBetween,
  serializeState,
  tickGame,
  upgradeCost,
  waiterSpeed,
} from "../site/four-shifts/game-rules.mjs";

const state = freshState(1_000);
assert.deepEqual(WORLD, { width: 960, height: 540 }, "simulation uses the canvas's internal coordinate space");
assert.equal(state.coins, 160);
assert.equal(state.upgrades.tables, 1);
assert.ok(upgradeCost("chef", { ...state.upgrades, chef: 1 }) > upgradeCost("chef", state.upgrades));
assert.ok(chefSeconds(1) < chefSeconds(0));
assert.ok(waiterSpeed(1) > waiterSpeed(0));
assert.ok(incomePerGuest(1) > incomePerGuest(0));

const chefCost = upgradeCost("chef", state.upgrades);
assert.equal(purchaseUpgrade(state, "chef"), true);
assert.equal(state.coins, 160 - chefCost);
assert.equal(state.upgrades.chef, 1);
assert.equal(purchaseUpgrade(state, "tables"), false, "insufficient coins do not unlock a table");

const restaurant = freshState(2_000);
restaurant.running = true;
const seen = new Set();
const maleTasks = new Set();
const femaleTasks = new Set();
const kitchenPhases = new Set();
const drinkPhases = new Set();
const tableOrderStates = new Set();
let seatAligned = false;
for (let step = 0; step < 8_000; step += 1) {
  tickGame(restaurant, 0.1);
  for (const customer of restaurant.customers) {
    seen.add(customer.state);
    if (["waitingOrder", "ordering", "waitingFood", "eating"].includes(customer.state)) {
      const seat = TABLES[customer.tableId - 1].seatPoints[0];
      seatAligned ||= customer.x === seat.x && customer.y === seat.y;
    }
  }
  if (restaurant.waiters.male.task) maleTasks.add(restaurant.waiters.male.task.type);
  if (restaurant.waiters.female.task) femaleTasks.add(restaurant.waiters.female.task.type);
  kitchenPhases.add(restaurant.kitchen.phase);
  drinkPhases.add(restaurant.kitchen.drinkPhase);
  restaurant.tables.forEach((table) => tableOrderStates.add(table.orderState));
  assert.equal(pointBlocked(restaurant.waiters.male), false, "male waiter stays on walkable tiles");
  assert.equal(pointBlocked(restaurant.waiters.female, { allowCashier: true }), false, "female waiter stays on staff walkable tiles");
  assert.equal(kitchenPointBlocked(restaurant.kitchen.chef), false, "main chef stays in kitchen walkable tiles");
  assert.equal(kitchenPointBlocked(restaurant.kitchen.drinkChef), false, "drink chef stays in kitchen walkable tiles");
  assert.notDeepEqual(
    { x: restaurant.kitchen.chef.x, y: restaurant.kitchen.chef.y },
    { x: restaurant.kitchen.drinkChef.x, y: restaurant.kitchen.drinkChef.y },
    "two chefs do not occupy the same work point"
  );
  const actors = [
    restaurant.kitchen.chef,
    restaurant.kitchen.drinkChef,
    restaurant.waiters.male,
    restaurant.waiters.female,
    ...restaurant.customers.filter((customer) => !customer.seated),
  ];
  const collisionSpace = (point) => point.x <= 459 && point.y <= 299
    ? "kitchen"
    : point.x >= CASHIER_STAFF_ZONE.left && point.x <= CASHIER_STAFF_ZONE.right && point.y >= CASHIER_STAFF_ZONE.top && point.y <= CASHIER_STAFF_ZONE.bottom
      ? "cashier"
      : "public";
  for (let first = 0; first < actors.length; first += 1) {
    for (let second = first + 1; second < actors.length; second += 1) {
      if (collisionSpace(actors[first]) !== collisionSpace(actors[second])) continue;
      assert.ok(Math.hypot(actors[first].x - actors[second].x, actors[first].y - actors[second].y) >= 33.9, "actors keep visible foot-anchor clearance");
    }
  }
  if (restaurant.served >= 1 && femaleTasks.has("clear") && restaurant.tables[0].dirty === false) break;
}
assert.equal(restaurant.served, 1, "a guest completes the full restaurant flow");
assert.ok(restaurant.coins > 160, "payment increases coins");
for (const expected of ["entering", "queueing", "seating", "ordering", "waitingFood", "eating", "toCheckout", "waitingPayment", "leaving"]) {
  assert.ok(seen.has(expected), `customer reaches ${expected}`);
}
assert.equal(seatAligned, true, "seated customer foot anchor matches the table seat point");
assert.deepEqual([...maleTasks].sort(), ["deliver", "escort"]);
assert.deepEqual([...femaleTasks].sort(), ["checkout", "clear", "drink", "order"]);
for (const phase of ["toStove", "cooking", "toPrep", "prepping", "toPickup"]) {
  assert.ok(kitchenPhases.has(phase), `chef reaches ${phase}`);
}
for (const phase of ["mixing", "toPickup", "toIdle"]) {
  assert.ok(drinkPhases.has(phase), `drink chef reaches ${phase}`);
}
assert.deepEqual(KITCHEN_POINTS, {
  stove: { x: 200, y: 140 },
  prep: { x: 300, y: 250 },
  drinkBar: { x: 440, y: 140 },
  pickup: { x: 400, y: 270 },
  drinkPickup: { x: 440, y: 270 },
});
for (const orderState of ["available", "seating", "ordering", "waitingFood", "eating", "checkout", "dirty"]) {
  assert.ok(tableOrderStates.has(orderState), `table reaches ${orderState}`);
}

const paused = freshState();
tickGame(paused, 30);
assert.equal(paused.customers.length, 0, "paused restaurant does not spawn guests");

for (const from of ["queue", "pass", "table1", "table2", "table3", "table4", "checkout"]) {
  for (const to of ["queue", "pass", "table1", "table2", "table3", "table4", "checkout"]) {
    const route = routeBetween(from, to);
    const allowQueue = from === "queue" || to === "queue";
    route.forEach((point) => {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), `${from} -> ${to} has valid waypoints`);
    });
    for (let index = 1; index < route.length; index += 1) {
      const previous = route[index - 1];
      const next = route[index];
      for (let sample = 0; sample <= 20; sample += 1) {
        const ratio = sample / 20;
        const point = {
          x: previous.x + (next.x - previous.x) * ratio,
          y: previous.y + (next.y - previous.y) * ratio,
        };
        assert.equal(pointBlocked(point, { allowQueue }), false, `${from} -> ${to} crosses a blocked object`);
      }
    }
  }
}
assert.equal(pointBlocked({ x: 590, y: 150 }), true, "table center is blocked");
assert.equal(pointBlocked(TABLES[0].servicePoint), false, "table service point is walkable");
assert.equal(pointBlocked({ x: 300, y: 390 }), true, "cashier counter is blocked");
assert.equal(pointBlocked({ x: 300, y: 290 }), true, "white kitchen wall is blocked");
assert.equal(pointBlocked(POINTS.pickupWaiter), false, "waiter pickup stays on the dining-room floor");
assert.equal(pointBlocked(POINTS.drinkPickupWaiter, { allowCashier: true }), false, "drink pickup stays on staff-accessible dining floor");
assert.equal(pointBlocked(KITCHEN_POINTS.pickup), true, "kitchen-side pickup is not public floor");
assert.equal(kitchenPointBlocked(KITCHEN_POINTS.pickup), false, "kitchen-side pickup remains reachable by chefs");
assert.ok(findPath(POINTS.entranceInside, TABLES[0].servicePoint).length > 2, "grid finds a route from entrance to table");
assert.ok(BLOCKED_RECTS.length >= 8, "collision map includes furniture and fixtures");
assert.equal(WAITING_QUEUE_POINTS.length, 3, "rug queue has three fixed positions");
assert.equal(new Set(WAITING_QUEUE_POINTS.map((point) => `${point.x},${point.y}`)).size, 3, "queue positions do not overlap");
assert.ok(WAITING_QUEUE_POINTS.every((point) => point.x === 120 && point.y >= 370 && point.y <= 450), "queue stays on the entrance rug");
assert.ok(WAITING_QUEUE_POINTS.every((point) => pointBlocked(point) && !pointBlocked(point, { allowQueue: true })), "only queue navigation may enter the protected rug");
assert.ok(TABLES.every((table) => !pointBlocked(table.seatApproachPoint)), "every guest approaches from walkable floor");
assert.ok(TABLES.every((table) => pointBlocked(table.seatPoints[0])), "seated poses remain inside blocked chair areas");
assert.ok(TABLES.every((table) => !("spriteOffset" in table.seatPoints[0])), "seat coordinates directly encode the shared foot anchor");
const checkoutRoute = findPath(TABLES[0].seatApproachPoint, POINTS.checkoutCustomer);
assert.ok(checkoutRoute.every((point) => point.x < QUEUE_PROTECTED_ZONE.left || point.x > QUEUE_PROTECTED_ZONE.right || point.y < QUEUE_PROTECTED_ZONE.top || point.y > QUEUE_PROTECTED_ZONE.bottom), "checkout route never crosses the entrance queue");
for (const point of Object.values(KITCHEN_POINTS)) assert.equal(kitchenPointBlocked(point), false, "kitchen work point is walkable");
for (const from of Object.values(KITCHEN_POINTS)) {
  for (const to of Object.values(KITCHEN_POINTS)) {
    const route = findPath(from, to, "kitchen");
    route.forEach((point) => assert.equal(kitchenPointBlocked(point), false, "chef route avoids kitchen equipment"));
    for (let index = 1; index < route.length; index += 1) {
      const previous = route[index - 1];
      const next = route[index];
      for (let sample = 0; sample <= 20; sample += 1) {
        const ratio = sample / 20;
        assert.equal(kitchenPointBlocked({
          x: previous.x + (next.x - previous.x) * ratio,
          y: previous.y + (next.y - previous.y) * ratio,
        }), false, "chef path segment crosses kitchen equipment");
      }
    }
  }
}
assert.ok(KITCHEN_BLOCKED_RECTS.length >= 3, "kitchen equipment has collision areas");

for (const table of TABLES) {
  assert.equal(pointBlocked(table.servicePoint), false, `table ${table.id} service point stays outside all furniture collision`);
  const head = { left: table.servicePoint.x - 24, right: table.servicePoint.x + 24, top: table.servicePoint.y - 80, bottom: table.servicePoint.y - 35 };
  const cover = { left: table.cover.x, right: table.cover.x + table.cover.w, top: table.cover.y, bottom: table.cover.y + table.cover.h };
  const overlaps = head.left < cover.right && head.right > cover.left && head.top < cover.bottom && head.bottom > cover.top;
  assert.equal(overlaps, false, `table ${table.id} service point keeps the waiter's head outside the tabletop foreground`);
  const lock = { left: table.lockRect.x, right: table.lockRect.x + table.lockRect.w, top: table.lockRect.y, bottom: table.lockRect.y + table.lockRect.h };
  assert.equal(table.servicePoint.x >= lock.left && table.servicePoint.x <= lock.right && table.servicePoint.y >= lock.top && table.servicePoint.y <= lock.bottom, false, `table ${table.id} service point is outside its locked overlay`);
}

const stress = freshState();
stress.running = true;
stress.upgrades.tables = 4;
stress.upgrades.chef = 4;
stress.upgrades.waiter = 4;
let maxGuests = 0;
const stressStates = new Set();
for (let step = 0; step < 12_000; step += 1) {
  tickGame(stress, 0.1);
  maxGuests = Math.max(maxGuests, stress.customers.length);
  stress.customers.forEach((customer) => stressStates.add(customer.state));
  for (const customer of stress.customers.filter((item) => !item.seated)) {
    const allowQueue = ["entering", "queueing", "waitingEscort", "seating", "waitingQueueExit", "leaving"].includes(customer.state);
    assert.equal(pointBlocked(customer, { allowQueue }), false, `stress customer ${customer.id} keeps its foot anchor on legal floor`);
  }
  assert.equal(pointBlocked(stress.waiters.male), false, "stress male waiter stays outside blocked areas");
  assert.equal(pointBlocked(stress.waiters.female, { allowCashier: true }), false, "stress female waiter stays outside blocked areas");
  assert.equal(kitchenPointBlocked(stress.kitchen.chef), false, "stress main chef stays outside equipment");
  assert.equal(kitchenPointBlocked(stress.kitchen.drinkChef), false, "stress drink chef stays outside equipment");
  const movingActors = [
    stress.kitchen.chef,
    stress.kitchen.drinkChef,
    stress.waiters.male,
    stress.waiters.female,
    ...stress.customers.filter((customer) => !customer.seated),
  ];
  const stressSpace = (point) => point.x <= 459 && point.y <= 299
    ? "kitchen"
    : point.x >= CASHIER_STAFF_ZONE.left && point.x <= CASHIER_STAFF_ZONE.right && point.y >= CASHIER_STAFF_ZONE.top && point.y <= CASHIER_STAFF_ZONE.bottom
      ? "cashier"
      : "public";
  for (let first = 0; first < movingActors.length; first += 1) {
    for (let second = first + 1; second < movingActors.length; second += 1) {
      if (stressSpace(movingActors[first]) !== stressSpace(movingActors[second])) continue;
      assert.ok(Math.hypot(movingActors[first].x - movingActors[second].x, movingActors[first].y - movingActors[second].y) >= 33.9, "six-guest stress actors never interpenetrate");
    }
  }
}
assert.ok(maxGuests >= 6, "stress run holds at least six simultaneous guests");
assert.ok(stress.served >= 8, "stress run keeps completing orders instead of deadlocking");
for (const expected of ["queueing", "seatingTransition", "waitingFood", "eating", "waitingPayment", "leaving"]) {
  assert.ok(stressStates.has(expected), `stress run reaches ${expected}`);
}

const waitingRestaurant = freshState();
waitingRestaurant.running = true;
waitingRestaurant.tables[0].occupiedBy = 999;
let sawImpatient = false;
let sawAngry = false;
let sawAbandon = false;
for (let step = 0; step < 380; step += 1) {
  tickGame(waitingRestaurant, 0.1);
  sawImpatient ||= waitingRestaurant.customers.some((customer) => customer.mood === "impatient");
  sawAngry ||= waitingRestaurant.customers.some((customer) => customer.mood === "angry");
  sawAbandon ||= waitingRestaurant.customers.some((customer) => customer.abandoned && customer.state === "leaving");
  assert.ok(waitingRestaurant.customers.every((customer) => customer.state === "queueing" || customer.mood === "normal"), "waiting mood exists only for stationary queue guests");
}
assert.equal(sawImpatient, true, "waiting guest shows an impatient mood after 10 seconds");
assert.equal(sawAngry, true, "waiting guest shows an angry mood after 20 seconds");
assert.equal(sawAbandon, true, "guest waiting over 30 seconds walks back out");

const saved = serializeState(restaurant, 10_000);
assert.deepEqual(normalizeSave(saved)?.upgrades, restaurant.upgrades);
const restored = hydrateState(saved, 11_000);
assert.equal(restored.coins, Math.floor(restaurant.coins));
assert.equal(restored.served, restaurant.served);
assert.equal(restored.running, true);
assert.equal(normalizeSave({ version: 0 }), null);

const offline = calculateOfflineIncome({ ...saved, running: true, lastSavedAt: 0 }, 60 * 60 * 1_000);
assert.ok(offline.amount > 0 && offline.seconds === 3_600, "offline income is calculated for a running restaurant");
assert.equal(calculateOfflineIncome({ ...saved, running: false }, 20_000).amount, 0);
const capped = calculateOfflineIncome({ ...saved, running: true, lastSavedAt: 0 }, 8 * 60 * 60 * 1_000);
const fourHours = calculateOfflineIncome({ ...saved, running: true, lastSavedAt: 0 }, 4 * 60 * 60 * 1_000);
assert.deepEqual(capped, fourHours, "offline income is capped at four hours");

console.log("Restaurant Rookie idle rules tests passed");
