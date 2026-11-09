import {
  classifyGesture,
  detectTaiwanEasterEgg,
  shouldResolveComposition,
  tapMaterial
} from "./ink-rules.mjs";

const canvas = document.querySelector("[data-ink-canvas]");
const context = canvas.getContext("2d", { alpha: true });
const experience = document.querySelector("[data-experience]");
const intro = document.querySelector("[data-intro]");
const finale = document.querySelector("[data-finale]");
const finaleCopy = document.querySelector("[data-finale-copy]");
const status = document.querySelector("[data-status]");
const resetButton = document.querySelector("[data-reset]");
const saveButton = document.querySelector("[data-save]");
const soundButton = document.querySelector("[data-sound]");
const soundLabel = document.querySelector("[data-sound-label]");
const keyboardCursor = document.querySelector("[data-keyboard-cursor]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const paperImage = new Image();
paperImage.src = "./assets/paper-texture.webp";
const dryBrushImage = new Image();
dryBrushImage.src = "./assets/dry-brush.webp";
const wetBloomImage = new Image();
wetBloomImage.src = "./assets/wet-bloom.webp";

const inkLayer = document.createElement("canvas");
const ink = inkLayer.getContext("2d", { alpha: true });
const actions = [];
const strokes = [];
let drawing = null;
let lastTapAt = 0;
let lastInteractionAt = performance.now();
let resolveTimer = 0;
let resolved = false;
let resolvedTaiwan = false;
let soundOn = false;
let audioContext = null;
let keyboardPoint = { x: 0.5, y: 0.55 };
let keyboardStroke = null;
let pixelRatio = 1;

function storedLanguage() {
  try {
    return localStorage.getItem("lucinuo-language") || "en";
  } catch {
    return "en";
  }
}

function setLanguage(language) {
  const next = language === "zh" ? "zh" : "en";
  document.documentElement.dataset.lang = next;
  document.documentElement.lang = next === "zh" ? "zh-Hant" : "en";
  canvas.setAttribute("aria-label", next === "zh" ? "互動水墨紙面" : "Interactive ink paper");
}

function copyText(en, zh) {
  return document.documentElement.dataset.lang === "zh" ? zh : en;
}

function announce(en, zh) {
  status.textContent = copyText(en, zh);
}

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    t: performance.now()
  };
}

function px(point) {
  return { x: point.x * inkLayer.width, y: point.y * inkLayer.height };
}

function drawIrregularBlob(target, x, y, radius, alpha, random) {
  const points = 34;
  target.save();
  target.fillStyle = `rgba(10, 9, 8, ${alpha})`;
  target.beginPath();
  for (let index = 0; index <= points; index += 1) {
    const angle = (index / points) * Math.PI * 2;
    const wobble = 0.68 + random() * 0.42;
    const stretch = 0.72 + random() * 0.4;
    const nextX = x + Math.cos(angle) * radius * wobble;
    const nextY = y + Math.sin(angle) * radius * stretch;
    if (index === 0) target.moveTo(nextX, nextY);
    else target.lineTo(nextX, nextY);
  }
  target.closePath();
  target.fill();
  target.restore();
}

function drawTap(target, action) {
  const random = randomGenerator(action.seed);
  const point = px(action);
  const shortEdge = Math.min(inkLayer.width, inkLayer.height);
  const base = shortEdge * (action.material === "wash" ? 0.16 : action.material === "pool" ? 0.11 : 0.075);

  target.save();
  target.globalCompositeOperation = "source-over";
  if (wetBloomImage.complete && wetBloomImage.naturalWidth) {
    const width = base * (1.65 + random() * 0.45);
    const height = base * (1.05 + random() * 0.28);
    target.translate(point.x, point.y);
    target.rotate((random() - 0.5) * Math.PI * 0.8);
    target.globalAlpha = action.material === "wash" ? 0.42 : action.material === "pool" ? 0.76 : 0.88;
    target.drawImage(wetBloomImage, -width / 2, -height / 2, width, height);
    target.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    for (let layer = 9; layer > 0; layer -= 1) {
      drawIrregularBlob(target, point.x, point.y, base * (0.28 + layer * 0.045), 0.035 + layer * 0.022, random);
    }
  }

  if (action.material === "splatter") {
    const droplets = 9 + Math.floor(random() * 9);
    for (let index = 0; index < droplets; index += 1) {
      const angle = random() * Math.PI * 2;
      const reach = base * (0.55 + random() * 2.2);
      const radius = base * (0.012 + random() * 0.035);
      drawIrregularBlob(
        target,
        point.x + Math.cos(angle) * reach,
        point.y + Math.sin(angle) * reach,
        radius,
        0.55 + random() * 0.35,
        random
      );
    }
  }
  target.restore();
}

function drawBrushStamp(target, start, end, width, alpha, random) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length < 2) return;
  const angle = Math.atan2(dy, dx);
  const drawWidth = length + width * 1.1;
  const drawHeight = width * 2.75;
  target.save();
  target.translate((start.x + end.x) / 2, (start.y + end.y) / 2);
  target.rotate(angle);
  if (random() > 0.5) target.scale(1, -1);
  target.globalAlpha = alpha;
  target.drawImage(dryBrushImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  target.restore();
}

function drawBristleStroke(target, action, progress = 1) {
  const count = Math.max(2, Math.ceil(action.points.length * progress));
  const points = action.points.slice(0, count).map(px);
  if (points.length < 2) return;
  const random = randomGenerator(action.seed);
  const shortEdge = Math.min(inkLayer.width, inkLayer.height);
  const wet = action.gesture.texture === "wet";
  const width = shortEdge * (wet ? 0.072 : 0.052);

  target.save();
  if (dryBrushImage.complete && dryBrushImage.naturalWidth) {
    if (action.gesture.kind === "current") {
      drawBrushStamp(target, points[0], points.at(-1), width * (0.9 + random() * 0.24), wet ? 0.62 : 0.88, random);
      target.restore();
      return;
    }
    const threshold = shortEdge * 0.15;
    let anchor = points[0];
    for (let index = 1; index < points.length; index += 1) {
      const point = points[index];
      const isLast = index === points.length - 1;
      if (Math.hypot(point.x - anchor.x, point.y - anchor.y) >= threshold || isLast) {
        drawBrushStamp(target, anchor, point, width * (0.82 + random() * 0.36), wet ? 0.62 : 0.88, random);
        anchor = point;
      }
    }
  } else {
    target.lineCap = "round";
    target.lineJoin = "round";
    target.beginPath();
    points.forEach((point, index) => index === 0 ? target.moveTo(point.x, point.y) : target.lineTo(point.x, point.y));
    target.lineWidth = width;
    target.strokeStyle = wet ? "rgba(8, 8, 7, .55)" : "rgba(8, 8, 7, .8)";
    target.stroke();
  }
  target.restore();
}

function drawGestureResponse(target, action) {
  const random = randomGenerator(action.seed + 997);
  const points = action.points.map(px);
  const first = points[0];
  const last = points.at(-1);
  const shortEdge = Math.min(inkLayer.width, inkLayer.height);

  target.save();
  if (action.gesture.kind === "crossing") {
    const center = points[Math.floor(points.length / 2)];
    if (wetBloomImage.complete && wetBloomImage.naturalWidth) {
      const size = shortEdge * 0.16;
      target.globalAlpha = 0.68;
      target.drawImage(wetBloomImage, center.x - size / 2, center.y - size * 0.34, size, size * 0.68);
      target.globalAlpha = 1;
    }
    for (let ray = 0; ray < 7; ray += 1) {
      const angle = random() * Math.PI * 2;
      const reach = shortEdge * (0.06 + random() * 0.16);
      drawIrregularBlob(target, center.x + Math.cos(angle) * reach, center.y + Math.sin(angle) * reach, shortEdge * (0.002 + random() * 0.005), 0.5 + random() * 0.35, random);
    }
  } else if (action.gesture.kind === "vessel") {
    const bounds = action.gesture.bounds;
    const center = px({ x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 });
    if (wetBloomImage.complete && wetBloomImage.naturalWidth) {
      const size = shortEdge * 0.22;
      target.globalAlpha = 0.48;
      target.drawImage(wetBloomImage, center.x - size / 2, center.y - size * 0.34, size, size * 0.68);
      target.globalAlpha = 1;
    }
  } else {
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    for (let filament = 0; filament < 2; filament += 1) {
      target.beginPath();
      target.moveTo(last.x, last.y);
      target.quadraticCurveTo(
        last.x + dx * (0.3 + random() * 0.3) + (random() - 0.5) * shortEdge * 0.06,
        last.y + dy * (0.3 + random() * 0.3) + (random() - 0.5) * shortEdge * 0.06,
        last.x + dx * (0.55 + random() * 0.5),
        last.y + dy * (0.55 + random() * 0.5)
      );
      target.strokeStyle = `rgba(8, 8, 7, ${0.12 + random() * 0.32})`;
      target.lineWidth = Math.max(pixelRatio * 0.35, shortEdge * (0.00035 + random() * 0.0008));
      target.stroke();
    }
  }
  target.restore();
}

function drawAction(target, action) {
  if (action.type === "tap") drawTap(target, action);
  else {
    drawBristleStroke(target, action);
    drawGestureResponse(target, action);
  }
}

function drawFinalSweeps(target, seed) {
  const random = randomGenerator(seed);
  const shortEdge = Math.min(inkLayer.width, inkLayer.height);
  if (wetBloomImage.complete && wetBloomImage.naturalWidth) {
    const bloomWidth = shortEdge * 0.34;
    const bloomHeight = shortEdge * 0.27;
    target.save();
    target.globalAlpha = 0.68;
    target.translate(inkLayer.width * 0.63, inkLayer.height * 0.47);
    target.rotate(-0.16);
    target.drawImage(wetBloomImage, -bloomWidth / 2, -bloomHeight / 2, bloomWidth, bloomHeight);
    target.restore();
  }
  const sweeps = inkLayer.width >= inkLayer.height
    ? [
        [[0.07, 0.74], [0.64, 0.48], 0.075, 0.82],
        [[0.28, 0.17], [0.88, 0.11], 0.055, 0.74],
        [[0.58, 0.8], [0.84, 0.57], 0.085, 0.68]
      ]
    : [
        [[0.08, 0.7], [0.68, 0.48], 0.09, 0.82],
        [[0.24, 0.18], [0.86, 0.12], 0.068, 0.74],
        [[0.52, 0.84], [0.82, 0.55], 0.095, 0.68]
      ];
  sweeps.forEach(([[startX, startY], [endX, endY], width, alpha]) => {
    drawBrushStamp(
      target,
      { x: startX * inkLayer.width, y: startY * inkLayer.height },
      { x: endX * inkLayer.width, y: endY * inkLayer.height },
      shortEdge * width,
      alpha,
      random
    );
  });

  target.save();
  target.lineCap = "round";
  for (let line = 0; line < 3; line += 1) {
    target.beginPath();
    target.moveTo(inkLayer.width * (0.34 + line * 0.025), inkLayer.height * (0.7 - line * 0.03));
    target.quadraticCurveTo(
      inkLayer.width * (0.55 + line * 0.015),
      inkLayer.height * (0.22 + line * 0.04),
      inkLayer.width * (0.86 + line * 0.012),
      inkLayer.height * (0.38 + line * 0.02)
    );
    target.strokeStyle = `rgba(8, 8, 7, ${0.16 + line * 0.06})`;
    target.lineWidth = Math.max(pixelRatio * 0.5, shortEdge * (0.00045 + line * 0.00018));
    target.stroke();
  }
  target.restore();
}

function taiwanPath(target) {
  const width = inkLayer.width;
  const height = inkLayer.height;
  const scale = Math.min(width, height);
  const centerX = width * 0.52;
  const centerY = height * 0.5;
  const islandWidth = scale * 0.12;
  const islandHeight = scale * 0.48;
  target.beginPath();
  target.moveTo(centerX + islandWidth * 0.08, centerY - islandHeight * 0.5);
  target.bezierCurveTo(
    centerX + islandWidth * 0.52, centerY - islandHeight * 0.35,
    centerX + islandWidth * 0.46, centerY - islandHeight * 0.08,
    centerX + islandWidth * 0.28, centerY + islandHeight * 0.12
  );
  target.bezierCurveTo(
    centerX + islandWidth * 0.08, centerY + islandHeight * 0.34,
    centerX - islandWidth * 0.08, centerY + islandHeight * 0.48,
    centerX - islandWidth * 0.2, centerY + islandHeight * 0.5
  );
  target.bezierCurveTo(
    centerX - islandWidth * 0.5, centerY + islandHeight * 0.2,
    centerX - islandWidth * 0.46, centerY - islandHeight * 0.14,
    centerX - islandWidth * 0.12, centerY - islandHeight * 0.43
  );
  target.closePath();
}

function drawTaiwanReveal(target, seed) {
  const random = randomGenerator(seed);
  const scale = Math.min(inkLayer.width, inkLayer.height);
  target.save();
  if (wetBloomImage.complete && wetBloomImage.naturalWidth) {
    const bloomWidth = scale * 0.72;
    const bloomHeight = scale * 0.68;
    target.globalAlpha = 0.9;
    target.drawImage(
      wetBloomImage,
      inkLayer.width * 0.52 - bloomWidth / 2,
      inkLayer.height * 0.5 - bloomHeight / 2,
      bloomWidth,
      bloomHeight
    );
    target.globalAlpha = 1;
  }
  target.globalCompositeOperation = "destination-out";
  taiwanPath(target);
  target.fillStyle = "rgba(0, 0, 0, .96)";
  target.fill();
  target.globalCompositeOperation = "source-over";

  const ridge = [
    { x: 0.525, y: 0.31, t: 0 },
    { x: 0.5, y: 0.43, t: 120 },
    { x: 0.515, y: 0.57, t: 240 },
    { x: 0.49, y: 0.69, t: 360 }
  ];
  drawBristleStroke(target, { type: "stroke", points: ridge, gesture: { texture: "dry" }, seed: seed + 71 });

  const redX = inkLayer.width * 0.56;
  const redY = inkLayer.height * 0.38;
  target.fillStyle = "#a93624";
  target.beginPath();
  target.arc(redX, redY, Math.max(2 * pixelRatio, scale * 0.0045), 0, Math.PI * 2);
  target.fill();
  target.strokeStyle = `rgba(169, 54, 36, ${0.45 + random() * 0.2})`;
  target.lineWidth = Math.max(pixelRatio * 0.6, scale * 0.001);
  target.beginPath();
  target.moveTo(redX, redY);
  target.lineTo(redX + scale * 0.026, redY - scale * 0.008);
  target.stroke();
  target.restore();
}

function compositeResolvedLayer(isTaiwan) {
  const result = document.createElement("canvas");
  result.width = inkLayer.width;
  result.height = inkLayer.height;
  const target = result.getContext("2d", { alpha: true });
  target.drawImage(inkLayer, 0, 0);
  const seed = 7001 + actions.length * 311;
  drawFinalSweeps(target, seed);
  if (isTaiwan) drawTaiwanReveal(target, seed + 509);
  return result;
}

function paintDisplay(layer = inkLayer, alpha = 1) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.globalAlpha = alpha;
  context.drawImage(layer, 0, 0);
  context.restore();
}

function replayActions() {
  ink.clearRect(0, 0, inkLayer.width, inkLayer.height);
  actions.forEach((action) => drawAction(ink, action));
  paintDisplay();
}

function coherence() {
  const kinds = new Set(actions.map((action) => action.type === "tap" ? "tap" : action.gesture.kind));
  return Math.min(0.9, 0.36 + actions.length * 0.04 + kinds.size * 0.06);
}

function scheduleResolution() {
  window.clearTimeout(resolveTimer);
  if (resolved) return;
  resolveTimer = window.setTimeout(() => {
    const idleMs = performance.now() - lastInteractionAt;
    if (shouldResolveComposition({ actions: actions.length, idleMs, coherence: coherence() })) resolveComposition();
  }, 2350);
}

function resolveComposition() {
  if (resolved) return;
  resolved = true;
  resolvedTaiwan = detectTaiwanEasterEgg(strokes);
  const result = compositeResolvedLayer(resolvedTaiwan);
  const duration = reducedMotion.matches ? 1 : 1700;
  const startedAt = performance.now();
  announce("The ink is finding its balance.", "墨正在尋找平衡。");

  function animate(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(inkLayer, 0, 0);
    context.save();
    context.globalAlpha = eased;
    context.drawImage(result, 0, 0);
    context.restore();
    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    ink.clearRect(0, 0, inkLayer.width, inkLayer.height);
    ink.drawImage(result, 0, 0);
    paintDisplay();
    saveButton.disabled = false;
    finale.hidden = false;
    finale.classList.toggle("is-easter-egg", resolvedTaiwan);
    if (resolvedTaiwan) {
      finaleCopy.textContent = copyText("You found the island.", "你找到了這座島。");
      announce("A hidden island appeared. The composition can now be saved.", "隱藏的島嶼出現了，現在可以儲存作品。");
      playTone(392, 0.7);
    } else {
      finaleCopy.textContent = copyText("The current has settled.", "墨流已定。");
      announce("The current has settled. The composition can now be saved.", "墨流已定，現在可以儲存作品。");
      playTone(294, 0.55);
    }
  }
  requestAnimationFrame(animate);
}

function addTap(point, source = "pointer") {
  if (resolved) return;
  const now = performance.now();
  const interval = lastTapAt ? now - lastTapAt : 620;
  lastTapAt = now;
  const action = {
    type: "tap",
    x: point.x,
    y: point.y,
    material: tapMaterial(interval),
    seed: Math.floor(point.x * 10000 + point.y * 7000 + actions.length * 977)
  };
  actions.push(action);
  drawAction(ink, action);
  paintDisplay();
  didInteract(source);
  playInkSound(action.material === "splatter" ? 0.08 : 0.16);
}

function addStroke(points, source = "pointer") {
  if (resolved || points.length < 2) return;
  const gesture = classifyGesture(points);
  const action = {
    type: "stroke",
    points,
    gesture,
    seed: Math.floor(points[0].x * 9000 + points.at(-1).y * 11000 + actions.length * 1297)
  };
  actions.push(action);
  strokes.push(points);
  drawAction(ink, action);
  paintDisplay();
  didInteract(source);
  playInkSound(gesture.texture === "dry" ? 0.1 : 0.22);
}

function didInteract(source) {
  lastInteractionAt = performance.now();
  intro.classList.add("is-dismissed");
  const remaining = Math.max(0, 8 - actions.length);
  if (remaining > 0) {
    announce(
      source === "keyboard" ? `The current moved. ${remaining} gestures before it can settle.` : `${remaining} more gestures before the ink can settle.`,
      `墨流動了；再留下 ${remaining} 個動作，它才可能安定。`
    );
  } else {
    announce("Pause and let the ink answer.", "停一下，讓墨回應你。");
  }
  scheduleResolution();
}

function pointerDown(event) {
  if (resolved || event.button > 0) return;
  canvas.setPointerCapture(event.pointerId);
  drawing = { pointerId: event.pointerId, points: [canvasPoint(event)] };
}

function pointerMove(event) {
  if (!drawing || drawing.pointerId !== event.pointerId) return;
  const point = canvasPoint(event);
  const previous = drawing.points.at(-1);
  if (Math.hypot(point.x - previous.x, point.y - previous.y) >= 0.006) drawing.points.push(point);
}

function pointerUp(event) {
  if (!drawing || drawing.pointerId !== event.pointerId) return;
  const point = canvasPoint(event);
  const points = drawing.points;
  drawing = null;
  if (points.length === 1 || Math.hypot(point.x - points[0].x, point.y - points[0].y) < 0.018) {
    addTap(point);
  } else {
    if (Math.hypot(point.x - points.at(-1).x, point.y - points.at(-1).y) >= 0.006) points.push(point);
    addStroke(points);
  }
}

function updateKeyboardCursor() {
  keyboardCursor.style.left = `${keyboardPoint.x * 100}%`;
  keyboardCursor.style.top = `${keyboardPoint.y * 100}%`;
}

function keyboardInput(event) {
  if (resolved) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    addTap({ ...keyboardPoint, t: performance.now() }, "keyboard");
    return;
  }
  const delta = event.shiftKey ? 0.045 : 0.025;
  const move = {
    ArrowLeft: [-delta, 0],
    ArrowRight: [delta, 0],
    ArrowUp: [0, -delta],
    ArrowDown: [0, delta]
  }[event.key];
  if (!move) return;
  event.preventDefault();
  const before = { ...keyboardPoint, t: performance.now() };
  keyboardPoint = {
    x: Math.min(0.96, Math.max(0.04, keyboardPoint.x + move[0])),
    y: Math.min(0.94, Math.max(0.1, keyboardPoint.y + move[1]))
  };
  updateKeyboardCursor();
  if (event.shiftKey) {
    keyboardStroke = keyboardStroke || [before];
    keyboardStroke.push({ ...keyboardPoint, t: performance.now() });
    window.clearTimeout(keyboardInput.finishTimer);
    keyboardInput.finishTimer = window.setTimeout(() => {
      addStroke(keyboardStroke, "keyboard");
      keyboardStroke = null;
    }, 180);
  }
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  inkLayer.width = canvas.width;
  inkLayer.height = canvas.height;
  replayActions();
  if (resolved) {
    const result = compositeResolvedLayer(resolvedTaiwan);
    ink.clearRect(0, 0, inkLayer.width, inkLayer.height);
    ink.drawImage(result, 0, 0);
    paintDisplay();
  }
  updateKeyboardCursor();
}

function resetExperience() {
  window.clearTimeout(resolveTimer);
  actions.length = 0;
  strokes.length = 0;
  drawing = null;
  lastTapAt = 0;
  lastInteractionAt = performance.now();
  resolved = false;
  resolvedTaiwan = false;
  saveButton.disabled = true;
  finale.hidden = true;
  finale.classList.remove("is-easter-egg");
  finaleCopy.textContent = copyText("The current has settled.", "墨流已定。");
  intro.classList.remove("is-dismissed");
  ink.clearRect(0, 0, inkLayer.width, inkLayer.height);
  paintDisplay();
  announce("The paper is waiting.", "紙正在等你。");
  canvas.focus();
}

function drawPaper(target) {
  target.fillStyle = "#f8f5ee";
  target.fillRect(0, 0, target.canvas.width, target.canvas.height);
  if (!paperImage.complete || !paperImage.naturalWidth) return;
  const scale = Math.max(target.canvas.width / paperImage.naturalWidth, target.canvas.height / paperImage.naturalHeight);
  const width = paperImage.naturalWidth * scale;
  const height = paperImage.naturalHeight * scale;
  target.globalAlpha = 0.58;
  target.drawImage(paperImage, (target.canvas.width - width) / 2, (target.canvas.height - height) / 2, width, height);
  target.globalAlpha = 1;
}

function saveComposition() {
  if (!resolved) return;
  const output = document.createElement("canvas");
  output.width = canvas.width;
  output.height = canvas.height;
  const target = output.getContext("2d");
  drawPaper(target);
  target.drawImage(inkLayer, 0, 0);
  output.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement("a");
    link.download = `ink-current-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    announce("The composition was saved to this device.", "作品已儲存到這台裝置。");
  }, "image/png");
}

function ensureAudio() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume();
}

function playInkSound(amount) {
  if (!soundOn) return;
  ensureAudio();
  const duration = 0.18 + amount;
  const frames = Math.max(1, Math.floor(audioContext.sampleRate * duration));
  const buffer = audioContext.createBuffer(1, frames, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < frames; index += 1) {
    data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / frames, 2.5);
  }
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  filter.type = "lowpass";
  filter.frequency.value = 620 + amount * 900;
  gain.gain.value = 0.035;
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(audioContext.destination);
  source.start();
}

function playTone(frequency, duration) {
  if (!soundOn) return;
  ensureAudio();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function toggleSound() {
  soundOn = !soundOn;
  soundButton.setAttribute("aria-pressed", String(soundOn));
  soundLabel.textContent = copyText(soundOn ? "Sound on" : "Sound off", soundOn ? "聲音開啟" : "聲音關閉");
  if (soundOn) {
    ensureAudio();
    playTone(220, 0.25);
  }
}

canvas.addEventListener("pointerdown", pointerDown);
canvas.addEventListener("pointermove", pointerMove);
canvas.addEventListener("pointerup", pointerUp);
canvas.addEventListener("pointercancel", pointerUp);
canvas.addEventListener("keydown", keyboardInput);
resetButton.addEventListener("click", resetExperience);
saveButton.addEventListener("click", saveComposition);
soundButton.addEventListener("click", toggleSound);
window.addEventListener("resize", resize);

setLanguage(storedLanguage());
updateKeyboardCursor();
resize();
