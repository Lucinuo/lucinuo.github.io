import {
  PHASE_MAX,
  phaseReward,
  removeInterferenceRows,
  shiftAttackBonus
} from "./phase-rules.mjs";

const COLS = 10;
const ROWS = 20;
const CELL = 32;
const PREVIEW_CELL = 18;
const BLOCK_NORMAL = 1;
const BLOCK_GARBAGE = 8;

const BASE_SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]]
};

const SHAPE_KEYS = Object.keys(BASE_SHAPES);
const LINE_ATTACK = [0, 0, 1, 2, 4];
const LINE_SCORE = [0, 100, 300, 500, 800];

const ui = {
  shell: document.querySelector("[data-game-shell]"),
  playerCanvas: document.querySelector("[data-player-board]"),
  aiCanvas: document.querySelector("[data-ai-board]"),
  playerHold: document.querySelector("[data-player-hold]"),
  playerNext: document.querySelector("[data-player-next]"),
  aiNext: document.querySelector("[data-ai-next]"),
  playerScore: document.querySelector("[data-player-score]"),
  playerLines: document.querySelector("[data-player-lines]"),
  playerCombo: document.querySelector("[data-player-combo]"),
  aiScore: document.querySelector("[data-ai-score]"),
  aiLines: document.querySelector("[data-ai-lines]"),
  aiIncoming: document.querySelector("[data-ai-incoming]"),
  mobileScore: document.querySelector("[data-mobile-score]"),
  mobileLines: document.querySelector("[data-mobile-lines]"),
  mobileCombo: document.querySelector("[data-mobile-combo]"),
  mobileIncoming: document.querySelector("[data-mobile-incoming]"),
  phaseState: document.querySelector("[data-phase-state]"),
  mobilePhaseState: document.querySelector("[data-mobile-phase-state]"),
  phaseMeter: document.querySelector(".phase-meter"),
  mobilePhaseMeter: document.querySelector(".mobile-phase-meter"),
  phaseFill: document.querySelector("[data-phase-fill]"),
  mobilePhaseFill: document.querySelector("[data-mobile-phase-fill]"),
  phaseValue: document.querySelector("[data-phase-value]"),
  phaseActivate: document.querySelector("[data-phase-activate]"),
  touchPhase: document.querySelector("[data-control='phase']"),
  pause: document.querySelector("[data-pause]"),
  pauseLabel: document.querySelector("[data-pause-label]"),
  sound: document.querySelector("[data-sound]"),
  startLayer: document.querySelector("[data-start-layer]"),
  start: document.querySelector("[data-start]"),
  overlayTitle: document.querySelector("[data-overlay-title]"),
  overlayCopy: document.querySelector("[data-overlay-copy]"),
  announcement: document.querySelector("[data-announcement]"),
  playerFlash: document.querySelector("[data-player-flash]"),
  aiFlash: document.querySelector("[data-ai-flash]"),
  playerWins: document.querySelector("[data-player-wins]"),
  aiWins: document.querySelector("[data-ai-wins]")
};

const tileImage = new Image();
tileImage.src = "./assets/block-tile.png";

let audioContext = null;
let muted = false;
let started = false;
let paused = true;
let gameOver = false;
let playerWins = 0;
let aiWins = 0;
let lastFrame = 0;
let announcementTimer = 0;
let animationFrame = 0;

const rotationCache = Object.fromEntries(
  SHAPE_KEYS.map((key) => [key, buildRotations(BASE_SHAPES[key])])
);

const player = createSide("player", ui.playerCanvas, false);
const ai = createSide("ai", ui.aiCanvas, true);

function createSide(name, canvas, isAI) {
  return {
    name,
    isAI,
    canvas,
    ctx: prepareCanvas(canvas, COLS * CELL, ROWS * CELL),
    board: emptyBoard(),
    bag: [],
    queue: [],
    current: null,
    hold: null,
    canHold: true,
    score: 0,
    lines: 0,
    combo: -1,
    incoming: 0,
    phase: 0,
    phaseMode: "attack",
    attackBoost: 0,
    slowUntil: 0,
    fallAccumulator: 0,
    aiTarget: null
  };
}

function prepareCanvas(canvas, width, height) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.dataset.logicalWidth = String(width);
  canvas.dataset.logicalHeight = String(height);
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.imageSmoothingEnabled = true;
  return context;
}

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function trimMatrix(matrix) {
  const rows = matrix.map((row) => row.slice());
  while (rows.length && rows[0].every((cell) => !cell)) rows.shift();
  while (rows.length && rows.at(-1).every((cell) => !cell)) rows.pop();
  if (!rows.length) return [[1]];

  let left = 0;
  let right = rows[0].length - 1;
  while (left <= right && rows.every((row) => !row[left])) left += 1;
  while (right >= left && rows.every((row) => !row[right])) right -= 1;
  return rows.map((row) => row.slice(left, right + 1));
}

function rotateMatrix(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;
  return trimMatrix(
    Array.from({ length: width }, (_, x) =>
      Array.from({ length: height }, (_, y) => matrix[height - 1 - y][x])
    )
  );
}

function buildRotations(base) {
  const rotations = [];
  let current = trimMatrix(base);
  for (let index = 0; index < 4; index += 1) {
    rotations.push(current);
    current = rotateMatrix(current);
  }
  return rotations;
}

function shuffledBag() {
  const values = SHAPE_KEYS.slice();
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

function nextType(side) {
  if (!side.bag.length) side.bag.push(...shuffledBag());
  return side.bag.shift();
}

function fillQueue(side) {
  while (side.queue.length < 5) side.queue.push(nextType(side));
}

function createPiece(type) {
  const rotations = rotationCache[type];
  const matrix = rotations[0];
  return {
    type,
    rotations,
    rotation: 0,
    x: Math.floor((COLS - matrix[0].length) / 2),
    y: -matrix.length
  };
}

function matrixFor(piece, rotation = piece.rotation) {
  return piece.rotations[((rotation % 4) + 4) % 4];
}

function spawn(side) {
  fillQueue(side);
  side.current = createPiece(side.queue.shift());
  fillQueue(side);
  side.canHold = true;
  side.aiTarget = side.isAI ? chooseAIPlacement(side) : null;
  if (collides(side, side.current, 0, 0)) endMatch(side.isAI ? "player" : "ai");
}

function collides(side, piece, offsetX = 0, offsetY = 0, rotation = piece.rotation) {
  const matrix = matrixFor(piece, rotation);
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const boardX = piece.x + x + offsetX;
      const boardY = piece.y + y + offsetY;
      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) return true;
      if (boardY >= 0 && side.board[boardY][boardX]) return true;
    }
  }
  return false;
}

function mergePiece(side) {
  const matrix = matrixFor(side.current);
  let crossedTop = false;
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const boardX = side.current.x + x;
      const boardY = side.current.y + y;
      if (boardY < 0) {
        crossedTop = true;
      } else {
        side.board[boardY][boardX] = BLOCK_NORMAL;
      }
    }
  }
  return !crossedTop;
}

function clearFullLines(board) {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (board[y].every(Boolean)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      cleared += 1;
      y += 1;
    }
  }
  return cleared;
}

function lockPiece(side, opponent) {
  if (!mergePiece(side)) {
    endMatch(side.isAI ? "player" : "ai");
    return;
  }

  const cleared = clearFullLines(side.board);
  if (cleared > 0) {
    side.combo += 1;
    side.lines += cleared;
    side.score += LINE_SCORE[cleared] * (side.combo + 1);
    side.phase = Math.min(PHASE_MAX, side.phase + phaseReward(cleared, side.combo));
    flashBoard(side);
    tone(cleared >= 4 ? 620 : 420 + cleared * 42, 0.08);
  } else {
    side.combo = -1;
  }

  let outgoing = LINE_ATTACK[cleared] || 0;
  if (cleared > 0 && side.combo > 0) outgoing += Math.min(3, Math.floor((side.combo + 1) / 2));
  if (cleared > 0 && side.attackBoost > 0) {
    outgoing += side.attackBoost;
    side.attackBoost = 0;
    announce(side.isAI ? "AI shifted attack" : "Shift attack released");
    tone(780, 0.12);
  }

  if (outgoing > 0 && side.incoming > 0) {
    const cancelled = Math.min(outgoing, side.incoming);
    outgoing -= cancelled;
    side.incoming -= cancelled;
  }
  if (outgoing > 0) opponent.incoming += outgoing;

  if (cleared === 0 && side.incoming > 0) {
    const amount = Math.min(4, side.incoming);
    side.incoming -= amount;
    addGarbage(side, amount);
  }

  if (side.isAI && side.phase >= PHASE_MAX) useAIPhase(side);
  spawn(side);
  updateHUD();
}

function addGarbage(side, amount) {
  for (let count = 0; count < amount; count += 1) {
    side.board.shift();
    const hole = Math.floor(Math.random() * COLS);
    side.board.push(Array.from({ length: COLS }, (_, x) => (x === hole ? 0 : BLOCK_GARBAGE)));
  }
  tone(160, 0.08);
  if (side.board[0].some(Boolean)) endMatch(side.isAI ? "player" : "ai");
}

function removeGarbageRows(side, limit = 2) {
  return removeInterferenceRows(side.board, COLS, limit, BLOCK_GARBAGE);
}

function move(side, offsetX) {
  if (!side.current || collides(side, side.current, offsetX, 0)) return false;
  side.current.x += offsetX;
  return true;
}

function rotate(side) {
  if (!side.current) return false;
  const nextRotation = (side.current.rotation + 1) % 4;
  for (const kick of [0, -1, 1, -2, 2]) {
    if (!collides(side, side.current, kick, 0, nextRotation)) {
      side.current.rotation = nextRotation;
      side.current.x += kick;
      return true;
    }
  }
  return false;
}

function softDrop(side, opponent) {
  if (!side.current) return;
  if (!collides(side, side.current, 0, 1)) {
    side.current.y += 1;
    if (!side.isAI) side.score += 1;
  } else {
    lockPiece(side, opponent);
  }
}

function hardDrop(side, opponent) {
  if (!side.current) return;
  let distance = 0;
  while (!collides(side, side.current, 0, distance + 1)) distance += 1;
  side.current.y += distance;
  if (!side.isAI) side.score += distance * 2;
  lockPiece(side, opponent);
  tone(250, 0.04);
}

function holdPiece(side) {
  if (!side.current || !side.canHold) return;
  const currentType = side.current.type;
  if (side.hold) {
    side.current = createPiece(side.hold);
  } else {
    fillQueue(side);
    side.current = createPiece(side.queue.shift());
    fillQueue(side);
  }
  side.hold = currentType;
  side.canHold = false;
}

function ghostDistance(side) {
  let distance = 0;
  while (!collides(side, side.current, 0, distance + 1)) distance += 1;
  return distance;
}

function chooseAIPlacement(side) {
  if (!side.current) return null;
  let best = null;
  for (let rotation = 0; rotation < 4; rotation += 1) {
    const matrix = matrixFor(side.current, rotation);
    for (let x = -matrix[0].length; x < COLS + matrix[0].length; x += 1) {
      const testPiece = {
        ...side.current,
        rotation,
        x,
        y: -matrix.length
      };
      if (collides(side, testPiece, 0, 0, rotation)) continue;
      let distance = 0;
      while (!collides(side, testPiece, 0, distance + 1, rotation)) distance += 1;
      testPiece.y += distance;

      const simulated = cloneBoard(side.board);
      let valid = true;
      for (let y = 0; y < matrix.length; y += 1) {
        for (let cellX = 0; cellX < matrix[y].length; cellX += 1) {
          if (!matrix[y][cellX]) continue;
          const boardY = testPiece.y + y;
          const boardX = testPiece.x + cellX;
          if (boardY < 0 || boardX < 0 || boardX >= COLS) {
            valid = false;
            break;
          }
          simulated[boardY][boardX] = BLOCK_NORMAL;
        }
        if (!valid) break;
      }
      if (!valid) continue;

      const cleared = clearFullLines(simulated);
      const metrics = boardMetrics(simulated);
      const score =
        cleared * 1.15 -
        metrics.aggregateHeight * 0.48 -
        metrics.holes * 1.35 -
        metrics.bumpiness * 0.24 -
        metrics.maxHeight * 0.18 +
        Math.random() * 0.08;
      if (!best || score > best.score) {
        best = { rotation, x, score };
      }
    }
  }
  return best;
}

function boardMetrics(board) {
  const heights = [];
  let holes = 0;
  for (let x = 0; x < COLS; x += 1) {
    let first = ROWS;
    let foundBlock = false;
    for (let y = 0; y < ROWS; y += 1) {
      if (board[y][x]) {
        if (!foundBlock) first = y;
        foundBlock = true;
      } else if (foundBlock) {
        holes += 1;
      }
    }
    heights.push(ROWS - first);
  }
  const bumpiness = heights.slice(1).reduce((total, value, index) => total + Math.abs(value - heights[index]), 0);
  return {
    aggregateHeight: heights.reduce((total, value) => total + value, 0),
    holes,
    bumpiness,
    maxHeight: Math.max(...heights)
  };
}

function useAIPhase(side) {
  const metrics = boardMetrics(side.board);
  if (side.incoming >= 2 || metrics.maxHeight >= 14) {
    const removed = removeGarbageRows(side, 2);
    side.slowUntil = performance.now() + 5000;
    announce(removed ? "AI shifted guard" : "AI slowed the field");
  } else {
    side.attackBoost = shiftAttackBonus();
    announce("AI prepared shift attack");
  }
  side.phase = 0;
}

function setPhaseMode(mode) {
  player.phaseMode = mode;
  document.querySelectorAll("[data-phase-mode], [data-mobile-phase-mode]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.phaseMode === mode || button.dataset.mobilePhaseMode === mode);
  });
}

function activatePlayerPhase() {
  if (!started || paused || gameOver || player.phase < PHASE_MAX) return;
  if (player.phaseMode === "attack") {
    player.attackBoost = shiftAttackBonus();
    announce("Shift attack prepared");
  } else {
    const removed = removeGarbageRows(player, 2);
    player.slowUntil = performance.now() + 5000;
    announce(removed ? `Shift guard removed ${removed} interference ${removed === 1 ? "row" : "rows"}` : "Shift guard slowed the field");
  }
  player.phase = 0;
  flashBoard(player);
  tone(720, 0.16);
  updateHUD();
}

function resetSide(side) {
  side.board = emptyBoard();
  side.bag = [];
  side.queue = [];
  side.current = null;
  side.hold = null;
  side.canHold = true;
  side.score = 0;
  side.lines = 0;
  side.combo = -1;
  side.incoming = 0;
  side.phase = 0;
  side.phaseMode = "attack";
  side.attackBoost = 0;
  side.slowUntil = 0;
  side.fallAccumulator = 0;
  side.aiTarget = null;
  fillQueue(side);
  spawn(side);
}

function resetMatch() {
  gameOver = false;
  resetSide(player);
  resetSide(ai);
  setPhaseMode("attack");
  updateHUD();
  drawAll();
}

function startMatch() {
  if (gameOver || !player.current || !ai.current) resetMatch();
  started = true;
  paused = false;
  gameOver = false;
  ui.shell.classList.remove("is-paused");
  ui.startLayer.classList.remove("is-visible");
  ui.pauseLabel.textContent = "Pause";
  lastFrame = performance.now();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(loop);
  tone(360, 0.05);
}

function togglePause() {
  if (!started || gameOver) return;
  paused = !paused;
  ui.shell.classList.toggle("is-paused", paused);
  ui.pauseLabel.textContent = paused ? "Resume" : "Pause";
  ui.pause.setAttribute("aria-label", paused ? "Resume game" : "Pause game");
  if (paused) {
    ui.overlayTitle.textContent = "Paused";
    ui.overlayCopy.textContent = "The field will wait.";
    ui.start.textContent = "Resume";
    ui.startLayer.classList.add("is-visible");
  } else {
    ui.startLayer.classList.remove("is-visible");
    lastFrame = performance.now();
    animationFrame = requestAnimationFrame(loop);
  }
}

function endMatch(winner) {
  if (gameOver) return;
  gameOver = true;
  paused = true;
  if (winner === "player") {
    playerWins += 1;
    ui.overlayTitle.textContent = "You shifted the match";
    ui.overlayCopy.textContent = "The AI field reached its limit.";
    tone(880, 0.18);
  } else {
    aiWins += 1;
    ui.overlayTitle.textContent = "AI holds the field";
    ui.overlayCopy.textContent = "Reset, reorient, and try again.";
    tone(120, 0.22);
  }
  ui.playerWins.textContent = String(playerWins);
  ui.aiWins.textContent = String(aiWins);
  ui.start.textContent = "Play again";
  ui.startLayer.classList.add("is-visible");
  ui.shell.classList.add("is-paused");
  updateHUD();
}

function gravityInterval(side) {
  const base = Math.max(120, 820 - side.lines * 11);
  const slowed = performance.now() < side.slowUntil ? base * 1.45 : base;
  return side.isAI ? slowed * 0.82 : slowed;
}

function updateAI(delta) {
  if (!ai.current) return;
  if (!ai.aiTarget) ai.aiTarget = chooseAIPlacement(ai);
  if (ai.aiTarget) {
    ai.current.rotation = ai.aiTarget.rotation;
    ai.current.x = ai.aiTarget.x;
  }
  ai.fallAccumulator += delta;
  if (ai.fallAccumulator >= gravityInterval(ai)) {
    ai.fallAccumulator = 0;
    softDrop(ai, player);
  }
}

function loop(time) {
  if (paused || gameOver) return;
  const delta = Math.min(time - lastFrame, 80);
  lastFrame = time;
  player.fallAccumulator += delta;
  if (player.fallAccumulator >= gravityInterval(player)) {
    player.fallAccumulator = 0;
    softDrop(player, ai);
  }
  updateAI(delta);
  updateHUD();
  drawAll();
  animationFrame = requestAnimationFrame(loop);
}

function drawAll() {
  drawBoard(player);
  drawBoard(ai);
  drawPreview(ui.playerHold, player.hold ? [player.hold] : []);
  drawPreview(ui.playerNext, player.queue.slice(0, 4));
  drawPreview(ui.aiNext, ai.queue.slice(0, 4));
}

function clearLogicalCanvas(context, canvas) {
  const width = Number(canvas.dataset.logicalWidth || COLS * CELL);
  const height = Number(canvas.dataset.logicalHeight || ROWS * CELL);
  context.clearRect(0, 0, width, height);
  return { width, height };
}

function drawBoard(side) {
  const context = side.ctx;
  clearLogicalCanvas(context, side.canvas);
  context.fillStyle = "rgba(2, 7, 11, 0.78)";
  context.fillRect(0, 0, COLS * CELL, ROWS * CELL);

  context.strokeStyle = "rgba(94, 121, 141, 0.28)";
  context.lineWidth = 1;
  context.beginPath();
  for (let x = 0; x <= COLS; x += 1) {
    context.moveTo(x * CELL + 0.5, 0);
    context.lineTo(x * CELL + 0.5, ROWS * CELL);
  }
  for (let y = 0; y <= ROWS; y += 1) {
    context.moveTo(0, y * CELL + 0.5);
    context.lineTo(COLS * CELL, y * CELL + 0.5);
  }
  context.stroke();

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (side.board[y][x]) drawCell(context, x, y, side.board[y][x], 1);
    }
  }

  if (!side.current) return;
  if (!side.isAI) {
    drawPiece(context, side.current, ghostDistance(side), 0.18);
  }
  drawPiece(context, side.current, 0, 1, side.attackBoost > 0);
}

function drawPiece(context, piece, offsetY = 0, alpha = 1, energized = false) {
  const matrix = matrixFor(piece);
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const boardY = piece.y + y + offsetY;
      if (boardY < 0) continue;
      drawCell(context, piece.x + x, boardY, BLOCK_NORMAL, alpha, energized);
    }
  }
}

function drawCell(context, x, y, type, alpha = 1, energized = false) {
  const px = x * CELL;
  const py = y * CELL;
  context.save();
  context.globalAlpha = alpha;
  if (tileImage.complete && tileImage.naturalWidth) {
    context.drawImage(tileImage, px + 1, py + 1, CELL - 2, CELL - 2);
  } else {
    const gradient = context.createLinearGradient(px, py, px, py + CELL);
    gradient.addColorStop(0, "#d5d8d8");
    gradient.addColorStop(1, "#4a5054");
    context.fillStyle = gradient;
    context.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
  }

  if (type === BLOCK_GARBAGE) {
    context.fillStyle = "rgba(2, 6, 9, 0.66)";
    context.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
    context.strokeStyle = "rgba(171, 181, 187, 0.2)";
    context.beginPath();
    context.moveTo(px + 5, py + 5);
    context.lineTo(px + CELL - 5, py + CELL - 5);
    context.moveTo(px + CELL - 5, py + 5);
    context.lineTo(px + 5, py + CELL - 5);
    context.stroke();
  }

  if (energized) {
    context.globalCompositeOperation = "screen";
    context.fillStyle = "rgba(245, 169, 31, 0.38)";
    context.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
    context.shadowColor = "rgba(245, 169, 31, 0.7)";
    context.shadowBlur = 10;
    context.strokeStyle = "rgba(255, 211, 104, 0.84)";
    context.strokeRect(px + 2, py + 2, CELL - 4, CELL - 4);
  }
  context.restore();
}

function drawPreview(canvas, types) {
  const width = Number(canvas.getAttribute("width"));
  const height = Number(canvas.getAttribute("height"));
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(2, 7, 11, 0.56)";
  context.fillRect(0, 0, width, height);

  types.forEach((type, index) => {
    const matrix = rotationCache[type][0];
    const groupHeight = types.length > 1 ? height / types.length : height;
    const originY = index * groupHeight;
    const pieceWidth = matrix[0].length * PREVIEW_CELL;
    const pieceHeight = matrix.length * PREVIEW_CELL;
    const startX = (width - pieceWidth) / 2;
    const startY = originY + (groupHeight - pieceHeight) / 2;
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (!matrix[y][x]) continue;
        const px = startX + x * PREVIEW_CELL;
        const py = startY + y * PREVIEW_CELL;
        if (tileImage.complete && tileImage.naturalWidth) {
          context.drawImage(tileImage, px, py, PREVIEW_CELL, PREVIEW_CELL);
        } else {
          context.fillStyle = "#a9adae";
          context.fillRect(px + 1, py + 1, PREVIEW_CELL - 2, PREVIEW_CELL - 2);
        }
      }
    }
    if (types.length > 1 && index < types.length - 1) {
      context.strokeStyle = "rgba(162, 178, 189, 0.24)";
      context.beginPath();
      context.moveTo(8, originY + groupHeight);
      context.lineTo(width - 8, originY + groupHeight);
      context.stroke();
    }
  });
}

function updateHUD() {
  const combo = Math.max(0, player.combo);
  ui.playerScore.textContent = player.score.toLocaleString("en-US");
  ui.playerLines.textContent = String(player.lines);
  ui.playerCombo.textContent = String(combo);
  ui.aiScore.textContent = ai.score.toLocaleString("en-US");
  ui.aiLines.textContent = String(ai.lines);
  ui.aiIncoming.textContent = String(ai.incoming);
  ui.mobileScore.textContent = player.score.toLocaleString("en-US");
  ui.mobileLines.textContent = String(player.lines);
  ui.mobileCombo.textContent = String(combo);
  ui.mobileIncoming.textContent = String(player.incoming);

  const phase = Math.round(player.phase);
  const ready = phase >= PHASE_MAX;
  ui.phaseFill.style.height = `${phase}%`;
  ui.mobilePhaseFill.style.width = `${phase}%`;
  ui.phaseValue.textContent = `${phase}%`;
  ui.phaseState.textContent = ready ? "Phase ready" : "Phase charging";
  ui.mobilePhaseState.textContent = ready ? "Phase ready" : "Phase charging";
  ui.phaseState.classList.toggle("is-ready", ready);
  ui.mobilePhaseState.classList.toggle("is-ready", ready);
  ui.phaseMeter.classList.toggle("is-phase-ready", ready);
  ui.mobilePhaseMeter.classList.toggle("is-phase-ready", ready);
  ui.phaseMeter.setAttribute("aria-valuenow", String(phase));
  ui.mobilePhaseMeter.setAttribute("aria-valuenow", String(phase));
  ui.phaseActivate.disabled = !ready;
  ui.touchPhase.disabled = !ready;
}

function flashBoard(side) {
  const element = side.isAI ? ui.aiFlash : ui.playerFlash;
  element.classList.remove("is-active");
  requestAnimationFrame(() => element.classList.add("is-active"));
}

function announce(message) {
  window.clearTimeout(announcementTimer);
  ui.announcement.textContent = message;
  ui.announcement.classList.add("is-visible");
  announcementTimer = window.setTimeout(() => {
    ui.announcement.classList.remove("is-visible");
  }, 1500);
}

function tone(frequency, duration) {
  if (muted) return;
  try {
    audioContext ||= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    muted = true;
    ui.shell.classList.add("is-muted");
  }
}

function runPlayerAction(action) {
  if (!started || paused || gameOver) return;
  if (action === "left") move(player, -1);
  if (action === "right") move(player, 1);
  if (action === "rotate") rotate(player);
  if (action === "soft") softDrop(player, ai);
  if (action === "drop") hardDrop(player, ai);
  if (action === "hold") holdPiece(player);
  if (action === "phase") activatePlayerPhase();
  updateHUD();
  drawAll();
}

function bindControls() {
  ui.start.addEventListener("click", startMatch);
  ui.pause.addEventListener("click", togglePause);
  ui.sound.addEventListener("click", () => {
    muted = !muted;
    ui.shell.classList.toggle("is-muted", muted);
    ui.sound.setAttribute("aria-label", muted ? "Turn sound on" : "Mute sound");
    if (!muted) tone(440, 0.05);
  });

  document.querySelectorAll("[data-phase-mode]").forEach((button) => {
    button.addEventListener("click", () => setPhaseMode(button.dataset.phaseMode));
  });
  document.querySelectorAll("[data-mobile-phase-mode]").forEach((button) => {
    button.addEventListener("click", () => setPhaseMode(button.dataset.mobilePhaseMode));
  });
  ui.phaseActivate.addEventListener("click", activatePlayerPhase);

  const repeatable = new Set(["left", "right", "down"]);
  document.querySelectorAll("[data-control]").forEach((button) => {
    const action = button.dataset.control;
    let delayTimer = 0;
    let repeatTimer = 0;
    const stop = () => {
      window.clearTimeout(delayTimer);
      window.clearInterval(repeatTimer);
    };
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      runPlayerAction(action);
      if (repeatable.has(action)) {
        delayTimer = window.setTimeout(() => {
          repeatTimer = window.setInterval(() => runPlayerAction(action), 75);
        }, 190);
      }
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const controls = {
      arrowleft: "left",
      arrowright: "right",
      arrowup: "rotate",
      arrowdown: "down",
      " ": "drop",
      c: "hold",
      x: "phase"
    };
    if (key === "p" || key === "escape") {
      event.preventDefault();
      togglePause();
      return;
    }
    if (!controls[key]) return;
    event.preventDefault();
    runPlayerAction(controls[key]);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && started && !paused && !gameOver) togglePause();
  });
}

tileImage.addEventListener("load", drawAll);
bindControls();
resetMatch();
ui.overlayTitle.textContent = "Phase Shift";
ui.overlayCopy.textContent = "Clear the field. Change the phase.";
ui.start.textContent = "Start match";
