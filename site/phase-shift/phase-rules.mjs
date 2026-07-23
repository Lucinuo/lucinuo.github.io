export const PHASE_MAX = 100;

const LINE_PHASE = [0, 18, 38, 62, 84];

export function phaseReward(cleared, combo) {
  return (LINE_PHASE[cleared] || 0) + Math.max(0, combo) * 6;
}

export function shiftAttackBonus() {
  return 2;
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
