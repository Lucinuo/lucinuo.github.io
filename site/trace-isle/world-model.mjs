export const DATA_FORMAT = "lucinuo.trace-isle.data";
export const DATA_VERSION = 1;
export const STORAGE_KEY = "trace-isle-v1";

const ISLANDS = new Set(["cove", "river", "ridge"]);
const RESPONSE_KINDS = new Set(["plant", "water", "rock", "terrain", "light", "weather"]);

const copy = (value) => JSON.parse(JSON.stringify(value));
const isText = (value) => typeof value === "string" && value.length <= 200;
const isDate = (value) => typeof value === "string" && !Number.isNaN(Date.parse(value));

function validEntry(entry) {
  return entry && typeof entry.id === "string" && isDate(entry.date) && typeof entry.responseId === "string"
    && typeof entry.positionId === "string" && isDate(entry.createdAt)
    && (!("text" in entry) || isText(entry.text));
}

function validObject(object) {
  return object && typeof object.id === "string" && RESPONSE_KINDS.has(object.kind)
    && typeof object.variant === "string" && Number.isFinite(object.x) && Number.isFinite(object.y)
    && typeof object.sourceEntryId === "string" && isDate(object.createdAt);
}

function validEvolution(evolution) {
  return evolution && typeof evolution.id === "string" && typeof evolution.kind === "string"
    && Array.isArray(evolution.sourceObjectIds) && evolution.sourceObjectIds.every((id) => typeof id === "string")
    && isDate(evolution.createdAt);
}

export function isValidWorld(world) {
  return Boolean(world) && world.format === DATA_FORMAT && world.version === DATA_VERSION
    && ISLANDS.has(world.islandId) && Number.isFinite(world.seed) && isDate(world.createdAt)
    && isDate(world.updatedAt) && Array.isArray(world.entries) && Array.isArray(world.objects)
    && Array.isArray(world.evolutions) && world.entries.every(validEntry)
    && world.objects.every(validObject) && world.evolutions.every(validEvolution);
}

export function createWorld({ islandId, seed, createdAt = new Date().toISOString() }) {
  if (!ISLANDS.has(islandId) || !Number.isFinite(seed) || !isDate(createdAt)) throw new TypeError("Invalid island world");
  return { format: DATA_FORMAT, version: DATA_VERSION, islandId, seed, createdAt, updatedAt: createdAt, entries: [], objects: [], evolutions: [] };
}

export function createEntry({ id, date, text, retainText, responseId, positionId, createdAt = new Date().toISOString() }) {
  if (![id, date, responseId, positionId, createdAt].every((value) => typeof value === "string") || !isDate(date) || !isDate(createdAt)) {
    throw new TypeError("Invalid trace entry");
  }
  const entry = { id, date, responseId, positionId, createdAt };
  if (retainText) entry.text = String(text || "").slice(0, 200);
  return entry;
}

export function readWorld(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const world = JSON.parse(raw);
    return isValidWorld(world) ? world : null;
  } catch {
    return null;
  }
}

export function saveWorld(world, storage = globalThis.localStorage) {
  if (!isValidWorld(world)) return false;
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(world));
    return true;
  } catch {
    return false;
  }
}

export function clearWorld(storage = globalThis.localStorage) {
  try {
    storage?.removeItem?.(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function buildBackup(world, exportedAt = new Date().toISOString()) {
  if (!isValidWorld(world) || !isDate(exportedAt)) throw new TypeError("Invalid backup world");
  return { format: DATA_FORMAT, version: DATA_VERSION, exportedAt, world: copy(world) };
}

export function restoreBackup(current, raw) {
  try {
    const backup = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (backup?.format !== DATA_FORMAT || backup?.version !== DATA_VERSION || !isDate(backup.exportedAt) || !isValidWorld(backup.world)) return null;
    return copy(backup.world);
  } catch {
    return null;
  }
}
