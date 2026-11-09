const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

function segmentOrientation(a, b, c) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function segmentsCross(a, b, c, d) {
  const abC = segmentOrientation(a, b, c);
  const abD = segmentOrientation(a, b, d);
  const cdA = segmentOrientation(c, d, a);
  const cdB = segmentOrientation(c, d, b);
  return abC * abD < 0 && cdA * cdB < 0;
}

function hasSelfCrossing(points) {
  for (let first = 0; first < points.length - 1; first += 1) {
    for (let second = first + 2; second < points.length - 1; second += 1) {
      if (segmentsCross(points[first], points[first + 1], points[second], points[second + 1])) return true;
    }
  }
  return false;
}

function strokeBounds(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

export function tapMaterial(intervalMs) {
  if (intervalMs < 260) return "splatter";
  if (intervalMs > 1100) return "wash";
  return "pool";
}

export function classifyGesture(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { kind: "tap", texture: "wet", speed: 0, length: 0 };
  }

  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += distance(points[index - 1], points[index]);
  }
  const duration = Math.max(1, points.at(-1).t - points[0].t);
  const speed = length / (duration / 1000);
  const closed = length > 0.4 && distance(points[0], points.at(-1)) <= 0.09;
  const crossing = hasSelfCrossing(points);

  return {
    kind: crossing ? "crossing" : closed ? "vessel" : "current",
    texture: speed >= 1.55 ? "dry" : "wet",
    speed,
    length,
    closed,
    crossing,
    bounds: strokeBounds(points)
  };
}

export function shouldResolveComposition({ actions, idleMs, coherence }) {
  return actions >= 8 && idleMs >= 2200 && coherence >= 0.58;
}

export function detectTaiwanEasterEgg(strokes) {
  if (!Array.isArray(strokes) || strokes.length < 3) return false;
  const candidates = strokes
    .filter((stroke) => Array.isArray(stroke) && stroke.length >= 2)
    .map((stroke) => ({ stroke, bounds: strokeBounds(stroke) }));

  return candidates.some(({ stroke, bounds: spine }) => {
    const runsNorthToSouth = stroke[0].y < stroke.at(-1).y;
    const isCentralSpine =
      runsNorthToSouth &&
      spine.height >= 0.45 &&
      spine.height / Math.max(spine.width, 0.03) >= 2.5 &&
      spine.centerX >= 0.38 &&
      spine.centerX <= 0.62;
    if (!isCentralSpine) return false;

    const surrounding = candidates.filter((candidate) => candidate.stroke !== stroke && candidate.bounds.height >= 0.25);
    const hasWestCurrent = surrounding.some(({ bounds }) => bounds.centerX <= spine.centerX - 0.14);
    const hasEastCurrent = surrounding.some(({ bounds }) => bounds.centerX >= spine.centerX + 0.14);
    return hasWestCurrent && hasEastCurrent;
  });
}
