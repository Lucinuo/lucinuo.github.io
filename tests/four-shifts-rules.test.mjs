import assert from "node:assert/strict";
import { GUEST_PATHS, SCENE_BLOCKERS, SCENE_DESTINATIONS, SHIFTS, advanceMotion, completeDelivery, createMotion, createOrder, freshState, normalizeSave, periodFor, routeBetween, scoreDoneness, scorePlate } from "../site/four-shifts/game-rules.mjs";

assert.equal(SHIFTS.length, 4);
assert.equal(scoreDoneness(7.8, "normal"), 100);
assert.equal(scoreDoneness(2, "soft"), 15);
const order = createOrder(1, 0);
assert.equal(scorePlate(order, "番茄醬", "起司"), 100);
assert.equal(scorePlate(order, "白醬", "起司"), 50);

let state = freshState();
state.orders[0] = { ...state.orders[0], status: "ready", cookScore: 100, plateScore: 100 };
state = completeDelivery(state, 1);
assert.equal(state.completed, 1);
assert.equal(state.shift, 1);
assert.equal(state.orders.length, 1);
assert.equal(state.orders[0].status, "waiting");
for (let id = 2; id <= 4; id += 1) {
  state.orders[0] = { ...state.orders[0], id, status: "ready", cookScore: 70, plateScore: 100 };
  state = completeDelivery(state, id);
}
assert.match(periodFor(state).label, /日常營運/);
assert.equal(normalizeSave({ version: 0 }), null);
assert.equal(normalizeSave({ ...state, station: "wrong" }).station, "order");

const crossesFurniture = (route) => route.some((point, index) => {
  if (index === 0) return false;
  const previous = route[index - 1];
  return Array.from({ length: 21 }, (_, step) => step / 20).some((ratio) => {
    const x = previous[0] + (point[0] - previous[0]) * ratio;
    const y = previous[1] + (point[1] - previous[1]) * ratio;
    return SCENE_BLOCKERS.some(([left, top, right, bottom]) => x > left && x < right && y > top && y < bottom);
  });
});
for (const from of ["hub", ...Object.keys(SCENE_DESTINATIONS)]) {
  for (const to of Object.keys(SCENE_DESTINATIONS)) {
    assert.equal(crossesFurniture(routeBetween(from, to)), false, `${from} -> ${to} crosses furniture`);
  }
}
assert.equal(crossesFurniture(GUEST_PATHS.male.walk), false, "male guest crosses furniture");
assert.equal(crossesFurniture(GUEST_PATHS.female.walk), false, "female guest crosses furniture");
assert.notDeepEqual(GUEST_PATHS.male.seat, GUEST_PATHS.female.seat);
assert.equal(GUEST_PATHS.male.table, 1);
assert.equal(GUEST_PATHS.female.table, 2);
assert.ok(GUEST_PATHS.male.seat[1] < 30 && GUEST_PATHS.female.seat[1] < 30, "guests sit on the wall banquette");

let motion = createMotion([[0, 0], [100, 0], [100, 100]]);
motion = advanceMotion(motion, 0.1, { maxSpeed: 100, acceleration: 200, deceleration: 240, stride: 10 });
assert.ok(motion.speed > 0 && motion.speed < 100, "actor accelerates instead of jumping to full speed");
const firstSpeed = motion.speed;
motion = advanceMotion(motion, 0.1, { maxSpeed: 100, acceleration: 200, deceleration: 240, stride: 10 });
assert.ok(motion.speed > firstSpeed, "actor continues accelerating");
while (motion.segment === 0) motion = advanceMotion(motion, 0.05, { maxSpeed: 100, acceleration: 200, deceleration: 240, stride: 10 });
assert.ok(motion.speed > 0, "actor does not stop at a route corner");
assert.equal(motion.direction, "down");
assert.ok(motion.frame >= 1 && motion.frame <= 4, "walking frame follows travelled distance");
while (!motion.done) motion = advanceMotion(motion, 0.05, { maxSpeed: 100, acceleration: 200, deceleration: 240, stride: 10 });
assert.deepEqual([motion.x, motion.y], [100, 100]);
assert.equal(motion.speed, 0);
assert.equal(motion.frame, 0);

console.log("Restaurant Rookie rules tests passed");
