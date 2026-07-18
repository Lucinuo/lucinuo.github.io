(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.BearingData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const VERSION = 4;
  const DATA_FORMAT = "lucinuo.bearing.data";
  const STORAGE_KEY = "bearing-v4";
  const LEGACY_V3_KEY = "bearing-v3";
  const LEGACY_V2_KEY = "growth-compass-v2";
  const LEGACY_V1_KEY = "growth-compass-v1";
  const PERSPECTIVE_IDS = ["knowledge", "expression", "aesthetic", "solitude", "emotion"];

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
      lifeOverviews: [],
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

  function normalizePerspectives(raw) {
    const perspectives = {};
    PERSPECTIVE_IDS.forEach((id) => {
      const content = cleanText(raw?.[id]);
      if (content) perspectives[id] = content;
    });
    return perspectives;
  }

  function normalizeLifeOverview(item) {
    const date = normalizeDate(item?.date);
    const focus = cleanText(item?.focus);
    const perspectives = normalizePerspectives(item?.perspectives);
    if (!date || !focus || !Object.keys(perspectives).length) return null;
    const createdAt = normalizeTimestamp(item.createdAt);
    return {
      id: cleanText(item.id) || `overview-${date}-${createdAt}`,
      date,
      perspectives,
      focus,
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

  function isCompatibleBackup(raw) {
    if (Array.isArray(raw)) return true;
    if (!raw || typeof raw !== "object") return false;

    const version = Number(raw.version);
    if (version === VERSION) return Boolean(normalizeData(raw));
    if (version === 3) return Boolean(migrateV3(raw));
    if (version === 1 || version === 2) return true;
    if (version) return false;

    return ["dailyEntries", "entries", "flowItems", "weeklyReviews", "monthlyReviews", "traceCards"]
      .some((key) => Array.isArray(raw[key]));
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

  function normalizeBearingData(raw, sourceVersion) {
    if (!raw || Number(raw.version) !== sourceVersion) return null;
    const data = createEmptyData();
    data.updatedAt = normalizeTimestamp(raw.updatedAt);
    data.observations = (raw.observations || []).map(normalizeObservation).filter(Boolean);
    data.priorities = (raw.priorities || []).map(normalizePriority).filter(Boolean);
    data.directionNotes = (raw.directionNotes || []).map(normalizeDirectionNote).filter(Boolean);
    data.nextMoves = (raw.nextMoves || []).map(normalizeNextMove).filter(Boolean);
    data.lifeOverviews = sourceVersion >= 4 ? (raw.lifeOverviews || []).map(normalizeLifeOverview).filter(Boolean) : [];
    if (raw.legacyImport?.raw) {
      data.legacyImport = {
        sourceVersion: Number(raw.legacyImport.sourceVersion) || 1,
        migratedAt: normalizeTimestamp(raw.legacyImport.migratedAt),
        raw: normalizeLegacyPayload(raw.legacyImport.raw)
      };
    }
    return data;
  }

  function normalizeData(raw) {
    return normalizeBearingData(raw, VERSION);
  }

  function migrateV3(raw) {
    return normalizeBearingData(raw, 3);
  }

  function normalizeCompatibleBearing(raw) {
    return normalizeData(raw) || migrateV3(raw);
  }

  function readStoredData(storage) {
    const current = safeParse(storage.getItem(STORAGE_KEY));
    const normalizedCurrent = normalizeData(current);
    if (normalizedCurrent) return { data: normalizedCurrent, sourceKey: STORAGE_KEY, migrated: false };

    const legacyV3 = safeParse(storage.getItem(LEGACY_V3_KEY));
    const migratedV3 = migrateV3(legacyV3);
    if (migratedV3) return { data: migratedV3, sourceKey: LEGACY_V3_KEY, migrated: true };

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
    const current = normalizeCompatibleBearing(currentRaw) || createEmptyData();
    let incoming = normalizeCompatibleBearing(incomingRaw);
    if (!incoming) {
      const sourceVersion = Number(incomingRaw?.version) || 1;
      if (sourceVersion === 1 || sourceVersion === 2 || Array.isArray(incomingRaw)) incoming = migrateLegacy(incomingRaw, sourceVersion);
    }
    if (!incoming) return current;
    return {
      version: VERSION,
      updatedAt: nowIso(),
      observations: mergeById(current.observations, incoming.observations, normalizeObservation),
      priorities: mergeById(current.priorities, incoming.priorities, normalizePriority),
      directionNotes: mergeById(current.directionNotes, incoming.directionNotes, normalizeDirectionNote),
      nextMoves: mergeById(current.nextMoves, incoming.nextMoves, normalizeNextMove),
      lifeOverviews: mergeById(current.lifeOverviews, incoming.lifeOverviews, normalizeLifeOverview),
      legacyImport: mergeLegacy(current.legacyImport, incoming.legacyImport)
    };
  }

  function recordCount(data) {
    const normalized = normalizeCompatibleBearing(data) || createEmptyData();
    const legacy = normalized.legacyImport?.raw || {};
    return normalized.observations.length + normalized.priorities.length + normalized.directionNotes.length + normalized.nextMoves.length + normalized.lifeOverviews.length +
      (legacy.dailyEntries || []).length + (legacy.weeklyReviews || []).length + (legacy.monthlyReviews || []).length;
  }

  function hasMeaningfulData(data) {
    return recordCount(data) > 0;
  }

  return {
    VERSION,
    DATA_FORMAT,
    STORAGE_KEY,
    LEGACY_V3_KEY,
    LEGACY_V2_KEY,
    LEGACY_V1_KEY,
    PERSPECTIVE_IDS,
    createEmptyData,
    safeParse,
    isCompatibleBackup,
    normalizeData,
    migrateV3,
    migrateLegacy,
    readStoredData,
    writeData,
    mergeData,
    recordCount,
    hasMeaningfulData
  };
});
