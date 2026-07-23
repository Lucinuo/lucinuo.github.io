import assert from "node:assert/strict";
import {
  PHASE_MAX,
  phaseReward,
  removeInterferenceRows,
  shiftAttackBonus
} from "../site/phase-shift/phase-rules.mjs";

assert.equal(PHASE_MAX, 100);
assert.equal(phaseReward(1, 0), 18);
assert.equal(phaseReward(2, 2), 50);
assert.equal(phaseReward(4, 3), 102);
assert.equal(shiftAttackBonus(), 2);

const empty = () => Array(10).fill(0);
const interference = (hole) =>
  Array.from({ length: 10 }, (_, column) => (column === hole ? 0 : 8));

const guardedBoard = [
  ...Array.from({ length: 16 }, empty),
  interference(2),
  Array(10).fill(1),
  interference(4),
  interference(7)
];
const originalLength = guardedBoard.length;
const removed = removeInterferenceRows(guardedBoard, 10, 2);

assert.equal(removed, 2);
assert.equal(guardedBoard.length, originalLength);
assert.equal(
  guardedBoard.filter((row) => row.filter((cell) => cell === 8).length >= 9).length,
  1
);
assert.ok(guardedBoard.some((row) => row.every((cell) => cell === 1)));

const cleanBoard = Array.from({ length: 20 }, empty);
assert.equal(removeInterferenceRows(cleanBoard, 10, 2), 0);

console.log("Phase Shift rule tests passed.");
