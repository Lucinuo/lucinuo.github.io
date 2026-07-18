const assert = require("node:assert/strict");
const BearingData = require("../site/bearing/data-model.js");

class MemoryStorage {
  constructor(values = {}) { this.values = { ...values }; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.values, key) ? this.values[key] : null; }
  setItem(key, value) { this.values[key] = String(value); }
}

function testV1Migration() {
  const storage = new MemoryStorage({
    "growth-compass-v1": JSON.stringify([{ date: "2026-07-01", pillar: "knowledge", note: "Legacy note" }])
  });
  const result = BearingData.readStoredData(storage);
  assert.equal(result.sourceKey, "growth-compass-v1");
  assert.equal(result.migrated, true);
  assert.equal(result.data.legacyImport.raw.dailyEntries.length, 1);
  assert.equal(result.data.observations.length, 0);
}

function testV2Migration() {
  const storage = new MemoryStorage({
    "growth-compass-v2": JSON.stringify({ version: 2, dailyEntries: [{ date: "2026-07-02", pillar: "emotion", note: "Keep the original meaning" }], weeklyReviews: [{ id: "w1", weekStartDate: "2026-06-29", pillar: "emotion", content: "Legacy review" }] })
  });
  const result = BearingData.readStoredData(storage);
  assert.equal(result.sourceKey, "growth-compass-v2");
  assert.equal(result.data.legacyImport.sourceVersion, 2);
  assert.equal(result.data.legacyImport.raw.weeklyReviews.length, 1);
}

function testV3WinsOverLegacy() {
  const v3 = BearingData.createEmptyData();
  v3.observations.push({ id: "o1", date: "2026-07-03", content: "Current", createdAt: "2026-07-03T00:00:00.000Z", updatedAt: "2026-07-03T00:00:00.000Z" });
  const storage = new MemoryStorage({
    "bearing-v3": JSON.stringify(v3),
    "growth-compass-v2": JSON.stringify({ version: 2, dailyEntries: [{ date: "2026-07-02", note: "Legacy" }] })
  });
  const result = BearingData.readStoredData(storage);
  assert.equal(result.sourceKey, "bearing-v3");
  assert.equal(result.data.observations.length, 1);
  assert.equal(result.migrated, false);
}

function testCorruptV3FallsBack() {
  const storage = new MemoryStorage({
    "bearing-v3": "{not valid",
    "growth-compass-v2": JSON.stringify({ version: 2, dailyEntries: [{ date: "2026-07-02", note: "Legacy" }] })
  });
  const result = BearingData.readStoredData(storage);
  assert.equal(result.sourceKey, "growth-compass-v2");
}

function testMergeUsesNewestVersion() {
  const current = BearingData.createEmptyData();
  current.observations.push({ id: "o1", date: "2026-07-03", content: "Old", createdAt: "2026-07-03T00:00:00.000Z", updatedAt: "2026-07-03T00:00:00.000Z" });
  const incoming = BearingData.createEmptyData();
  incoming.observations.push({ id: "o1", date: "2026-07-03", content: "New", createdAt: "2026-07-03T00:00:00.000Z", updatedAt: "2026-07-04T00:00:00.000Z" });
  const merged = BearingData.mergeData(current, incoming);
  assert.equal(merged.observations.length, 1);
  assert.equal(merged.observations[0].content, "New");
}

function testLegacyImportStaysLegacy() {
  const current = BearingData.createEmptyData();
  const merged = BearingData.mergeData(current, { version: 2, dailyEntries: [{ id: "d1", date: "2026-07-05", pillar: "knowledge", note: "Do not reinterpret" }] });
  assert.equal(merged.observations.length, 0);
  assert.equal(merged.legacyImport.raw.dailyEntries[0].pillar, "knowledge");
}

[
  testV1Migration,
  testV2Migration,
  testV3WinsOverLegacy,
  testCorruptV3FallsBack,
  testMergeUsesNewestVersion,
  testLegacyImportStaysLegacy
].forEach((test) => test());

console.log("Bearing data migration tests passed (6/6).");
