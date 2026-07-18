(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.BearingData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const VERSION = 3;
  const STORAGE_KEY = "bearing-v3";
  const LEGACY_V2_KEY = "growth-compass-v2";
  const LEGACY_V1_KEY = "growth-compass-v1";

  function nowIso() {
    return new Date().toISOString();
  }

  function createEmptyData() {
    return {
      version: VERSION,
      updatedAt: nowIso(),
      observations: [],
      priorities: [],
      directionNotes: [],
      nextMoves: [],
      legacyImport: null
    };
  }

  function safeParse(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeDate(value) {
    if (typeof value !== "string") return "";
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : "";
  }

  function normalizeTimestamp(value, fallback) {
    if (typeof value === "string" && !Number.isNaN(Date.parse(value))) return value;
    return fallback || nowIso();
  }

  function normalizeObservation(item) {
    const content = cleanText(item?.content);
    const date = normalizeDate(item?.date);
    if (!content || !date) return null;
    const createdAt = normalizeTimestamp(item.createdAt);
    return {
      id: cleanText(item.id) || `observation-${date}-${createdAt}`,
      date,
      content,
      createdAt,
      updatedAt: normalizeTimestamp(item.updatedAt, createdAt)
    };
  }

  function normalizePriority(item) {
    const content = cleanText(item?.content);
    if (!content) return null;
    const createdAt = normalizeTimestamp(item.createdAt);
    return {
      id: cleanText(item.id) || `priority-${createdAt}`,
      observationId: cleanText(item.observationId),
      content,
      createdAt,
      updatedAt: normalizeTimestamp(item.updatedAt, createdAt)
    };
  }

  function normalizeDirectionNote(item) {
    const content = cleanText(item?.content);
    if (!content) return null;
    const createdAt = normalizeTimestamp(item.createdAt);
    return {
      id: cleanText(item.id) || `direction-${createdAt}`,
      periodStart: normalizeDate(item.periodStart) || normalizeDate(createdAt),
      content,
      createdAt,
      updatedAt: normalizeTimestamp(item.updatedAt, createdAt)
    };
  }

  function normalizeNextMove(item) {
    const content = cleanText(item?.content);
    if (!content) return null;
    const createdAt = normalizeTimestamp(item.createdAt);
    return {
      id: cleanText(item.id) || `move-${createdAt}`,
      priorityId: cleanText(item.priorityId),
      content,
      status: item.status === "done" ? "done" : "open",
      createdAt,
      updatedAt: normalizeTimestamp(item.updatedAt, createdAt)
    };
  }

  function normalizeLegacyArray(value) {
    return Array.isArray(value) ? JSON.parse(JSON.stringify(value)) : [];
  }

  function normalizeLegacyPayload(raw) {
    const payload = Array.isArray(raw) ? { dailyEntries: raw } : (raw || {});
    return {
      dailyEntries: normalizeLegacyArray(payload.dailyEntries || payload.entries),
      flowItems: normalizeLegacyArray(payload.flowItems),
      weeklyReviews: normalizeLegacyArray(payload.weeklyReviews),
      monthlyReviews: normalizeLegacyArray(payload.monthlyReviews),
      traceCards: normalizeLegacyArray(payload.traceCards)
    };
  }

  function migrateLegacy(raw, sourceVersion) {
    const data = createEmptyData();
    data.legacyImport = {
      sourceVersion: Number(sourceVersion) || 1,
      migratedAt: nowIso(),
      raw: normalizeLegacyPayload(raw)
    };
    return data;
  }

  function normalizeData(raw) {
    if (!raw || Number(raw.version) !== VERSION) return null;
    const data = createEmptyData();
    data.updatedAt = normalizeTimestamp(raw.updatedAt);
    data.observations = (raw.observations || []).map(normalizeObservation).filter(Boolean);
    data.priorities = (raw.priorities || []).map(normalizePriority).filter(Boolean);
    data.directionNotes = (raw.directionNotes || []).map(normalizeDirectionNote).filter(Boolean);
    data.nextMoves = (raw.nextMoves || []).map(normalizeNextMove).filter(Boolean);
    if (raw.legacyImport?.raw) {
      data.legacyImport = {
        sourceVersion: Number(raw.legacyImport.sourceVersion) || 1,
        migratedAt: normalizeTimestamp(raw.legacyImport.migratedAt),
        raw: normalizeLegacyPayload(raw.legacyImport.raw)
      };
    }
    return data;
  }

  function readStoredData(storage) {
    const current = safeParse(storage.getItem(STORAGE_KEY));
    const normalizedCurrent = normalizeData(current);
    if (normalizedCurrent) return { data: normalizedCurrent, sourceKey: STORAGE_KEY, migrated: false };

    const legacyV2 = safeParse(storage.getItem(LEGACY_V2_KEY));
    if (legacyV2) return { data: migrateLegacy(legacyV2, 2), sourceKey: LEGACY_V2_KEY, migrated: true };

    const legacyV1 = safeParse(storage.getItem(LEGACY_V1_KEY));
    if (legacyV1) return { data: migrateLegacy(legacyV1, 1), sourceKey: LEGACY_V1_KEY, migrated: true };

    return { data: createEmptyData(), sourceKey: null, migrated: false };
  }

  function writeData(storage, raw) {
    const data = normalizeData({ ...raw, version: VERSION, updatedAt: nowIso() }) || createEmptyData();
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function mergeById(currentItems, incomingItems, normalizer) {
    const merged = new Map();
    [...(currentItems || []), ...(incomingItems || [])].forEach((rawItem) => {
      const item = normalizer(rawItem);
      if (!item) return;
      const previous = merged.get(item.id);
      if (!previous || item.updatedAt >= previous.updatedAt) merged.set(item.id, item);
    });
    return Array.from(merged.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  function legacyIdentity(item, type) {
    if (item?.id) return String(item.id);
    if (type === "dailyEntries") return `${item?.date || ""}-${item?.pillar || item?.state || ""}`;
    if (type === "weeklyReviews") return `${item?.weekStartDate || ""}-${item?.pillar || ""}`;
    if (type === "monthlyReviews") return String(item?.monthKey || "");
    return JSON.stringify(item || {});
  }

  function mergeLegacyArray(currentItems, incomingItems, type) {
    const merged = new Map();
    [...(currentItems || []), ...(incomingItems || [])].forEach((item) => {
      if (!item || typeof item !== "object") return;
      const key = legacyIdentity(item, type);
      const previous = merged.get(key);
      const itemUpdated = item.updatedAt || item.createdAt || "";
      const previousUpdated = previous?.updatedAt || previous?.createdAt || "";
      if (!previous || itemUpdated >= previousUpdated) merged.set(key, JSON.parse(JSON.stringify(item)));
    });
    return Array.from(merged.values());
  }

  function mergeLegacy(currentLegacy, incomingLegacy) {
    if (!currentLegacy) return incomingLegacy || null;
    if (!incomingLegacy) return currentLegacy;
    const currentRaw = normalizeLegacyPayload(currentLegacy.raw);
    const incomingRaw = normalizeLegacyPayload(incomingLegacy.raw);
    const raw = {};
    Object.keys(currentRaw).forEach((key) => {
      raw[key] = mergeLegacyArray(currentRaw[key], incomingRaw[key], key);
    });
    return {
      sourceVersion: Math.max(Number(currentLegacy.sourceVersion) || 1, Number(incomingLegacy.sourceVersion) || 1),
      migratedAt: currentLegacy.migratedAt || incomingLegacy.migratedAt || nowIso(),
      raw
    };
  }

  function mergeData(currentRaw, incomingRaw) {
    const current = normalizeData(currentRaw) || createEmptyData();
    let incoming = normalizeData(incomingRaw);
    if (!incoming) {
      const sourceVersion = Number(incomingRaw?.version) || 1;
      incoming = migrateLegacy(incomingRaw, sourceVersion);
    }
    return {
      version: VERSION,
      updatedAt: nowIso(),
      observations: mergeById(current.observations, incoming.observations, normalizeObservation),
      priorities: mergeById(current.priorities, incoming.priorities, normalizePriority),
      directionNotes: mergeById(current.directionNotes, incoming.directionNotes, normalizeDirectionNote),
      nextMoves: mergeById(current.nextMoves, incoming.nextMoves, normalizeNextMove),
      legacyImport: mergeLegacy(current.legacyImport, incoming.legacyImport)
    };
  }

  function recordCount(data) {
    const normalized = normalizeData(data) || createEmptyData();
    const legacy = normalized.legacyImport?.raw || {};
    return normalized.observations.length + normalized.priorities.length + normalized.directionNotes.length + normalized.nextMoves.length +
      (legacy.dailyEntries || []).length + (legacy.weeklyReviews || []).length + (legacy.monthlyReviews || []).length;
  }

  function hasMeaningfulData(data) {
    return recordCount(data) > 0;
  }

  return {
    VERSION,
    STORAGE_KEY,
    LEGACY_V2_KEY,
    LEGACY_V1_KEY,
    createEmptyData,
    safeParse,
    normalizeData,
    migrateLegacy,
    readStoredData,
    writeData,
    mergeData,
    recordCount,
    hasMeaningfulData
  };
});
