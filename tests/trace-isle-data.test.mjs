import assert from "node:assert/strict";
import {
  DATA_FORMAT, DATA_VERSION, STORAGE_KEY, buildBackup, clearWorld, createEntry, createWorld,
  readWorld, restoreBackup, saveWorld,
} from "../site/trace-isle/world-model.mjs";

const storage = new Map();
const memoryStorage = {
  getItem(key) { return storage.get(key) ?? null; },
  setItem(key, value) { storage.set(key, value); },
  removeItem(key) { storage.delete(key); },
};
const hidden = createEntry({ id: "e1", date: "2026-08-06", text: "private words", retainText: false, responseId: "moss", positionId: "p1", createdAt: "2026-08-06T00:00:00.000Z" });
const kept = createEntry({ id: "e2", date: "2026-08-06", text: "keep this", retainText: true, responseId: "young-fern", positionId: "p2", createdAt: "2026-08-06T00:00:00.000Z" });
assert.equal("text" in hidden, false);
assert.equal(kept.text, "keep this");

const world = createWorld({ islandId: "cove", seed: 42, createdAt: "2026-08-06T00:00:00.000Z" });
world.entries.push(hidden, kept);
const backup = buildBackup(world, "2026-08-06T01:00:00.000Z");
assert.equal(backup.format, DATA_FORMAT);
assert.equal(backup.version, DATA_VERSION);
assert.equal(JSON.stringify(backup).includes("private words"), false);
assert.equal(restoreBackup(world, JSON.stringify({ format: DATA_FORMAT, version: 99 })), null);

assert.equal(saveWorld(world, memoryStorage), true);
assert.deepEqual(readWorld(memoryStorage), world);
storage.set(STORAGE_KEY, "not json");
assert.equal(readWorld(memoryStorage), null);
const before = JSON.stringify(world);
assert.equal(restoreBackup(world, '{"bad":true}'), null);
assert.equal(JSON.stringify(world), before);
const restored = restoreBackup(world, JSON.stringify(backup));
assert.deepEqual(restored, world);
assert.equal(clearWorld(memoryStorage), true);
assert.equal(memoryStorage.getItem(STORAGE_KEY), null);

console.log("Trace Isle data tests passed");
