import { createEntry, isValidWorld } from "./world-model.mjs";
import { mulberry32 } from "./nature-rules.mjs";

const BASE_ANCHORS = {
  cove: [[.2,.27],[.37,.22],[.56,.28],[.74,.35],[.27,.45],[.48,.43],[.68,.5],[.22,.65],[.42,.62],[.6,.7],[.78,.68],[.5,.82]],
  river: [[.2,.28],[.43,.23],[.68,.25],[.28,.42],[.55,.4],[.76,.47],[.2,.62],[.44,.58],[.66,.65],[.32,.78],[.54,.8],[.78,.75]],
  ridge: [[.19,.24],[.4,.26],[.67,.22],[.25,.43],[.53,.44],[.78,.46],[.18,.64],[.41,.65],[.68,.64],[.29,.8],[.54,.78],[.79,.76]],
};
const MIN_DISTANCE = .08;

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const anchor = (coords, id) => ({ id, x: coords[0], y: coords[1] });

function ring(index) {
  const radius = .48 + index * .12;
  return Array.from({ length: 12 }, (_, point) => {
    const angle = -Math.PI / 2 + (point / 12) * Math.PI * 2;
    return { id: `ring-${index}-${point + 1}`, x: .5 + Math.cos(angle) * radius, y: .5 + Math.sin(angle) * radius };
  });
}

function allAnchors(world) {
  const bases = BASE_ANCHORS[world.islandId].map((coords, index) => anchor(coords, `base-${index + 1}`));
  const rings = [];
  for (let index = 1; index <= 12; index += 1) rings.push(...ring(index));
  return [...bases, ...rings];
}

export function candidatePositions(world, response, seed = 0) {
  if (!isValidWorld(world) || !response) return [];
  const anchors = allAnchors(world);
  let safe = anchors.slice(0, 12).filter((candidate) => world.objects.every((object) => distance(candidate, object) >= MIN_DISTANCE));
  if (safe.length < 3) {
    for (let start = 12; start < anchors.length && safe.length < 3; start += 12) {
      safe.push(...anchors.slice(start, start + 12).filter((candidate) => world.objects.every((object) => distance(candidate, object) >= MIN_DISTANCE)));
    }
  }
  const random = mulberry32(world.seed + Number(seed) + response.id.length);
  return safe.map((position) => ({ position, score: random() + (response.kind === "water" ? 1 - Math.abs(position.x - .5) : 0) }))
    .sort((a, b) => b.score - a.score || a.position.id.localeCompare(b.position.id))
    .slice(0, 3).map(({ position }) => position);
}

export function deriveEvolutions(world) {
  const existing = new Set(world.evolutions.map((item) => item.kind + item.sourceObjectIds.slice().sort().join("|")));
  const plants = world.objects.filter((object) => object.kind === "plant");
  const additions = [];
  for (let first = 0; first < plants.length; first += 1) {
    const cluster = [plants[first]];
    for (let next = first + 1; next < plants.length && cluster.length < 3; next += 1) {
      if (cluster.every((item) => distance(item, plants[next]) <= .22)) cluster.push(plants[next]);
    }
    if (cluster.length === 3) {
      const sourceObjectIds = cluster.map((item) => item.id).sort();
      const key = `young-grove${sourceObjectIds.join("|")}`;
      if (!existing.has(key)) additions.push({ id: `evolution-${sourceObjectIds.join("-")}`, kind: "young-grove", sourceObjectIds, createdAt: new Date().toISOString() });
    }
  }
  return additions;
}

export function applyResponse(world, response, position, { id, date = new Date().toISOString().slice(0, 10), text = "", retainText = false, createdAt = new Date().toISOString(), seed = 0 } = {}) {
  if (!isValidWorld(world) || !response || !id) return null;
  const permitted = candidatePositions(world, response, seed).find((item) => item.id === position?.id && item.x === position?.x && item.y === position?.y);
  if (!permitted) return null;
  const next = structuredClone(world);
  const entry = createEntry({ id, date, text, retainText, responseId: response.id, positionId: permitted.id, createdAt });
  const object = { id: `object-${id}`, kind: response.kind, variant: response.variant, x: permitted.x, y: permitted.y, sourceEntryId: id, createdAt };
  next.entries.push(entry);
  next.objects.push(object);
  next.evolutions.push(...deriveEvolutions(next));
  next.updatedAt = createdAt;
  return { world: next, entry, object };
}
