const ASSET_PATHS = Object.freeze({
  cove: "./assets/starter-cove.webp",
  river: "./assets/starter-river.webp",
  ridge: "./assets/starter-ridge.webp",
});

const images = new Map();
const lastTransforms = new WeakMap();
const ISLAND_ASPECT = 2 / 3;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function loadIslandAssets() {
  await Promise.all(Object.entries(ASSET_PATHS).map(async ([id, src]) => images.set(id, await loadImage(src))));
  return images;
}

function boundsFor(world) {
  const points = [{ x: 0, y: 0 }, { x: 1, y: ISLAND_ASPECT }, ...world.objects.map(({ x, y }) => ({ x, y: y * ISLAND_ASPECT }))];
  return {
    minX: Math.min(...points.map(({ x }) => x)), maxX: Math.max(...points.map(({ x }) => x)),
    minY: Math.min(...points.map(({ y }) => y)), maxY: Math.max(...points.map(({ y }) => y)),
  };
}

function transformFor(canvas, world, zoom = 1) {
  const bounds = boundsFor(world);
  if (bounds.minX === 0 && bounds.maxX === 1 && bounds.minY === 0 && bounds.maxY === ISLAND_ASPECT) {
    return { scale: canvas.clientWidth * zoom, offsetX: (canvas.clientWidth - canvas.clientWidth * zoom) / 2, offsetY: (canvas.clientHeight - canvas.clientHeight * zoom) / 2, pixelRatio: globalThis.devicePixelRatio || 1 };
  }
  const width = bounds.maxX - bounds.minX || 1;
  const height = bounds.maxY - bounds.minY || 1;
  const padding = .12;
  const scale = Math.min(canvas.clientWidth / (width + padding * 2), canvas.clientHeight / (height + padding * 2)) * zoom;
  const offsetX = canvas.clientWidth / 2 - ((bounds.minX + bounds.maxX) / 2) * scale;
  const offsetY = canvas.clientHeight / 2 - ((bounds.minY + bounds.maxY) / 2) * scale;
  return { scale, offsetX, offsetY, pixelRatio: globalThis.devicePixelRatio || 1 };
}

function pointAt(transform, point) {
  return { x: point.x * transform.scale + transform.offsetX, y: point.y * ISLAND_ASPECT * transform.scale + transform.offsetY };
}

function drawMoss(context, x, y, size) {
  context.fillStyle = "#48744b";
  for (let index = 0; index < 7; index += 1) {
    const angle = index * .9;
    context.beginPath(); context.arc(x + Math.cos(angle) * size * .4, y + Math.sin(angle) * size * .35, size * .32, 0, Math.PI * 2); context.fill();
  }
}
function drawFern(context, x, y, size) {
  context.strokeStyle = "#285f3f"; context.lineWidth = Math.max(1.5, size * .12); context.lineCap = "round";
  context.beginPath(); context.moveTo(x, y + size * .6); context.quadraticCurveTo(x + size * .1, y, x, y - size * .65); context.stroke();
  for (let index = 0; index < 4; index += 1) {
    const rise = y + size * .35 - index * size * .26;
    context.beginPath(); context.moveTo(x, rise); context.quadraticCurveTo(x - size * .55, rise - size * .12, x - size * .65, rise - size * .38); context.moveTo(x, rise); context.quadraticCurveTo(x + size * .55, rise - size * .12, x + size * .65, rise - size * .38); context.stroke();
  }
}
function drawPebbles(context, x, y, size) {
  context.fillStyle = "#786c5c";
  for (let index = 0; index < 9; index += 1) { const px = x + ((index % 3) - 1) * size * .48; const py = y + (Math.floor(index / 3) - 1) * size * .42; context.beginPath(); context.ellipse(px, py, size * .23, size * .16, index, 0, Math.PI * 2); context.fill(); }
}
function drawRipple(context, x, y, size) { context.strokeStyle = "rgba(111, 225, 232, .9)"; context.lineWidth = Math.max(1.2, size * .09); for (const factor of [.35, .65, 1]) { context.beginPath(); context.ellipse(x, y, size * factor, size * factor * .42, 0, 0, Math.PI * 2); context.stroke(); } }
function drawMist(context, x, y, size) { context.fillStyle = "rgba(232, 245, 237, .62)"; for (let index = -2; index <= 2; index += 1) { context.beginPath(); context.ellipse(x + index * size * .35, y + Math.sin(index) * size * .12, size * .55, size * .25, 0, 0, Math.PI * 2); context.fill(); } }
function drawLight(context, x, y, size) { const gradient = context.createRadialGradient(x, y, 1, x, y, size); gradient.addColorStop(0, "rgba(255, 243, 174, .92)"); gradient.addColorStop(1, "rgba(255, 243, 174, 0)"); context.fillStyle = gradient; context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill(); }
function drawObject(context, object, transform, reveal) {
  const { x, y } = pointAt(transform, object);
  const size = 16 * reveal;
  context.save(); context.globalAlpha = reveal;
  ({ moss: drawMoss, "young-fern": drawFern, "pebble-field": drawPebbles, ripple: drawRipple, "thin-mist": drawMist, "warm-light": drawLight }[object.variant] || drawMoss)(context, x, y, size);
  context.restore();
}

export function revealProgress({ reducedMotion = false, elapsed = 600 } = {}) {
  return reducedMotion ? 1 : Math.min(1, Math.max(0, elapsed / 600));
}

export function drawWorld(canvas, world, { zoom = 1, revealObjectId = null, reducedMotion = false, elapsed = 600 } = {}) {
  const ratio = globalThis.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  const transform = transformFor(canvas, world, zoom);
  lastTransforms.set(canvas, transform);
  const island = images.get(world.islandId);
  if (island) {
    const topLeft = pointAt(transform, { x: 0, y: 0 });
    context.drawImage(island, topLeft.x, topLeft.y, transform.scale, transform.scale * ISLAND_ASPECT);
  } else {
    context.fillStyle = "#123e4b"; context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }
  for (const object of world.objects) {
    const reveal = object.id === revealObjectId ? revealProgress({ reducedMotion, elapsed }) : 1;
    drawObject(context, object, transform, reveal);
  }
  for (const evolution of world.evolutions) {
    if (evolution.kind !== "young-grove") continue;
    const members = world.objects.filter((object) => evolution.sourceObjectIds.includes(object.id));
    if (!members.length) continue;
    const x = members.reduce((sum, item) => sum + item.x, 0) / members.length;
    const y = members.reduce((sum, item) => sum + item.y, 0) / members.length;
    const point = pointAt(transform, { x, y });
    context.save(); context.strokeStyle = "rgba(33, 81, 47, .72)"; context.lineWidth = 3;
    context.beginPath(); context.arc(point.x, point.y, 29, 0, Math.PI * 2); context.stroke(); context.restore();
  }
  return transform;
}

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const transform = lastTransforms.get(canvas);
  if (!transform) return null;
  return { x: ((event.clientX - rect.left) - transform.offsetX) / transform.scale, y: ((event.clientY - rect.top) - transform.offsetY) / (transform.scale * ISLAND_ASPECT), radius: 28 / transform.scale };
}

export function hitTest(world, point) {
  if (!world || !point) return null;
  let nearest = null;
  for (const object of world.objects) {
    const distance = Math.hypot(object.x - point.x, object.y - point.y);
    if (distance <= (point.radius ?? .04) && (!nearest || distance < nearest.distance)) nearest = { object, distance };
  }
  return nearest?.object || null;
}
