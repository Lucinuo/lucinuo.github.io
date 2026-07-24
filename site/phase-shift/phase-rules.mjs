export const PHASE_MAX = 100;

const LINE_PHASE = [0, 18, 38, 62, 84];

export function phaseReward(cleared, combo) {
  return (LINE_PHASE[cleared] || 0) + Math.max(0, combo) * 6;
}

export function shiftAttackBonus() {
  return 2;
}

// 長按重複排程：先等滿 dasDelay，之後每 arrInterval 觸發一次。
// 用扣除而非歸零，才不會在畫面延遲時吞掉節奏；回傳這一幀應觸發的次數。
export function advanceRepeat(state, delta, dasDelay, arrInterval, maxPerFrame = 8) {
  state.elapsed += delta;
  let fires = 0;
  while (fires < maxPerFrame) {
    const threshold = state.repeating ? arrInterval : dasDelay;
    if (state.elapsed < threshold) break;
    state.elapsed -= threshold;
    state.repeating = true;
    fires += 1;
  }
  return fires;
}

// 落地緩衝：已落地才累計，離地即歸零；累計超過 lockDelay 就該鎖定。
export function advanceLock(state, delta, lockDelay, grounded) {
  if (!grounded) {
    state.timer = 0;
    return false;
  }
  state.timer += delta;
  return state.timer >= lockDelay;
}

export const COMBO_ATTACK_CAP = 4;
export const TSPIN_ATTACK_BONUS = 3;
export const B2B_ATTACK_BONUS = 2;

const LINE_ATTACK = [0, 0, 1, 2, 4];

// 四消與 T-spin 屬於高階消除，連續達成可取得 Back-to-Back 加成。
export function isSpecialClear(cleared, tspin = false) {
  return cleared > 0 && (cleared === 4 || Boolean(tspin));
}

// 消除行數換算送出的干擾行數。
// 行為參考 ylsung/TetrisBattle（MIT）的 compute_scores：基礎攻擊 + 連擊 + T-spin + Back-to-Back。
// combo 沿用本作語意：尚未連擊為 -1，首次消除為 0，因此 combo > 0 才開始給連擊加成。
export function attackLines({ cleared, combo = -1, tspin = false, backToBack = false }) {
  if (!cleared) return 0;
  let lines = LINE_ATTACK[cleared] || 0;
  if (combo > 0) lines += Math.min(COMBO_ATTACK_CAP, Math.floor((combo + 1) / 2));
  if (tspin && cleared === 2) lines += TSPIN_ATTACK_BONUS;
  if (backToBack && isSpecialClear(cleared, tspin)) lines += B2B_ATTACK_BONUS;
  return lines;
}

export function removeInterferenceRows(board, columns, limit = 2, interferenceValue = 8) {
  let removed = 0;
  for (let y = board.length - 1; y >= 0 && removed < limit; y -= 1) {
    const interferenceCells = board[y].filter((cell) => cell === interferenceValue).length;
    if (interferenceCells >= columns - 1) {
      board.splice(y, 1);
      board.unshift(Array(columns).fill(0));
      removed += 1;
      y += 1;
    }
  }
  return removed;
}
