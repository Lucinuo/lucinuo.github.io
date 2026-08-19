import assert from "node:assert/strict";
import { SHIFTS, completeDelivery, createOrder, freshState, normalizeSave, periodFor, scoreDoneness, scorePlate } from "../site/four-shifts/game-rules.mjs";

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

console.log("Restaurant Rookie rules tests passed");
