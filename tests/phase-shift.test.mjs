import assert from "node:assert/strict";
import {
  B2B_ATTACK_BONUS,
  advanceLock,
  advanceRepeat,
  COMBO_ATTACK_CAP,
  PHASE_MAX,
  TSPIN_ATTACK_BONUS,
  attackLines,
  isSpecialClear,
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

// 攻擊計算：基礎表、連擊、T-spin、Back-to-Back
assert.equal(attackLines({ cleared: 0, combo: 5 }), 0, "沒有消除就不送出干擾");
assert.equal(attackLines({ cleared: 1, combo: -1 }), 0, "單消不送出");
assert.equal(attackLines({ cleared: 2, combo: -1 }), 1, "雙消送 1");
assert.equal(attackLines({ cleared: 3, combo: -1 }), 2, "三消送 2");
assert.equal(attackLines({ cleared: 4, combo: -1 }), 4, "四消送 4");

// combo 語意：-1 未連擊、0 首次消除（不加成）、1 起才開始加成
assert.equal(attackLines({ cleared: 2, combo: 0 }), 1, "首次消除沒有連擊加成");
assert.equal(attackLines({ cleared: 2, combo: 1 }), 2, "連擊 1 加 1");
assert.equal(attackLines({ cleared: 2, combo: 3 }), 3, "連擊 3 加 2");
assert.equal(attackLines({ cleared: 2, combo: 7 }), 5, "連擊 7 加 4");
assert.equal(
  attackLines({ cleared: 2, combo: 40 }),
  1 + COMBO_ATTACK_CAP,
  "連擊加成有上限"
);

// T-spin 只在併同雙消時加成
assert.equal(
  attackLines({ cleared: 2, combo: -1, tspin: true }),
  1 + TSPIN_ATTACK_BONUS,
  "T-spin 雙消加成"
);
assert.equal(
  attackLines({ cleared: 1, combo: -1, tspin: true }),
  0,
  "T-spin 單消不給該項加成"
);

// Back-to-Back 只在高階消除之間連續時給
assert.equal(
  attackLines({ cleared: 4, combo: -1, backToBack: true }),
  4 + B2B_ATTACK_BONUS,
  "連續四消加成"
);
assert.equal(
  attackLines({ cleared: 2, combo: -1, backToBack: true }),
  1,
  "普通雙消不吃 Back-to-Back"
);
assert.equal(
  attackLines({ cleared: 2, combo: -1, tspin: true, backToBack: true }),
  1 + TSPIN_ATTACK_BONUS + B2B_ATTACK_BONUS,
  "T-spin 雙消可同時吃兩種加成"
);

assert.equal(isSpecialClear(4), true);
assert.equal(isSpecialClear(2, true), true);
assert.equal(isSpecialClear(2, false), false);
assert.equal(isSpecialClear(0, true), false, "沒消除就不算高階消除");

// 長按節奏：先等 190ms 初始延遲，之後每 75ms 一次
{
  const DAS = 190;
  const ARR = 75;
  const state = { elapsed: 0, repeating: false };
  assert.equal(advanceRepeat(state, 100, DAS, ARR), 0, "初始延遲未滿不觸發");
  assert.equal(advanceRepeat(state, 90, DAS, ARR), 1, "累計滿 190ms 觸發第一次");
  assert.equal(advanceRepeat(state, 70, DAS, ARR), 0, "重複間隔未滿不觸發");
  assert.equal(advanceRepeat(state, 10, DAS, ARR), 1, "累計滿 75ms 再觸發");

  // 整段長按 1 秒：190ms 後開始，之後每 75ms 一次 → 應為 1 + floor((1000-190)/75)
  const held = { elapsed: 0, repeating: false };
  let total = 0;
  for (let i = 0; i < 100; i += 1) total += advanceRepeat(held, 10, DAS, ARR);
  assert.equal(total, 1 + Math.floor((1000 - DAS) / ARR), "長按一秒的觸發次數符合 DAS/ARR");

  // 掉幀時用扣除而非歸零，節奏不會被吞掉
  const laggy = { elapsed: 0, repeating: false };
  assert.equal(advanceRepeat(laggy, 190 + ARR * 3, DAS, ARR), 4, "單一大 delta 會補齊應觸發次數");
  assert.ok(advanceRepeat({ elapsed: 0, repeating: true }, 100000, DAS, ARR) <= 8, "極端延遲有單幀上限");
}

// 落地緩衝：離地歸零、落地累計、滿 500ms 才鎖定
{
  const LOCK = 500;
  const state = { timer: 0 };
  assert.equal(advanceLock(state, 300, LOCK, true), false, "落地 300ms 還不鎖定");
  assert.equal(state.timer, 300);
  assert.equal(advanceLock(state, 100, LOCK, false), false, "離地就不該鎖定");
  assert.equal(state.timer, 0, "離地後緩衝歸零");
  assert.equal(advanceLock(state, 499, LOCK, true), false, "差 1ms 仍不鎖定");
  assert.equal(advanceLock(state, 1, LOCK, true), true, "累計滿 500ms 才鎖定");
}

console.log("Phase Shift rule tests passed.");
