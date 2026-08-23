import assert from "node:assert/strict";
import {
  calculateOfflineIncome,
  chefSeconds,
  freshState,
  hydrateState,
  incomePerGuest,
  normalizeSave,
  purchaseUpgrade,
  routeBetween,
  serializeState,
  tickGame,
  upgradeCost,
  waiterSpeed,
} from "../site/four-shifts/game-rules.mjs";

const state = freshState(1_000);
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
for (let step = 0; step < 4_000 && restaurant.served === 0; step += 1) {
  tickGame(restaurant, 0.1);
  for (const customer of restaurant.customers) seen.add(customer.state);
}
assert.equal(restaurant.served, 1, "a guest completes the full restaurant flow");
assert.ok(restaurant.coins > 160, "payment increases coins");
for (const expected of ["entering", "queueing", "seating", "ordering", "waitingFood", "eating", "checkout", "paying", "leaving"]) {
  assert.ok(seen.has(expected), `customer reaches ${expected}`);
}

const paused = freshState();
tickGame(paused, 30);
assert.equal(paused.customers.length, 0, "paused restaurant does not spawn guests");

for (const from of ["queue", "pass", "table1", "table2", "table3", "table4", "checkout"]) {
  for (const to of ["queue", "pass", "table1", "table2", "table3", "table4", "checkout"]) {
    const route = routeBetween(from, to);
    route.forEach((point) => {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), `${from} -> ${to} has valid waypoints`);
    });
  }
}

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
