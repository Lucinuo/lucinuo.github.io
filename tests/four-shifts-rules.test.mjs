import assert from "node:assert/strict";
import { SHIFTS, applyChoice, endingFor, initialState } from "../site/four-shifts/game-rules.mjs";

assert.equal(SHIFTS.length, 4);
const start = initialState();
assert.deepEqual(applyChoice(start, 9), start);
const asked = [0, 0, 0, 0].reduce((state, choice) => applyChoice(state, choice), start);
assert.equal(asked.shift, 4);
assert.equal(asked.asked, 4);
assert.match(endingFor(asked).title, /說得很清楚/);
const rushed = [2, 2, 2, 2].reduce((state, choice) => applyChoice(state, choice), start);
assert.equal(rushed.assumed, 100);
assert.match(endingFor(rushed).title, /撐過/);

console.log("Four Shifts rules tests passed");
