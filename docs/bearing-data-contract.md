# Bearing data contract

Bearing uses one versioned data contract across browser storage, portable JSON backups, Google Drive app data, and future Apple clients.

## Identity

- Format identifier: `lucinuo.bearing.data`
- Current schema version: `3`
- Browser storage key: `bearing-v3`
- Public JSON Schema: `/bearing/data-schema.json`

The `format` field is included in new portable exports. Existing version 3 records without this field remain valid so current browser data is not invalidated.

## Record groups

- `observations`: an honest description of the present situation.
- `priorities`: what matters now, linked to an observation by `observationId`.
- `directionNotes`: reflections about what changed and the direction it suggests.
- `nextMoves`: a small next action, linked to a priority by `priorityId`.
- `legacyImport`: a lossless envelope for compatible Growth Compass records that Bearing does not reinterpret.

Every native Bearing record has a stable `id`, `createdAt`, and `updatedAt`. Dates use ISO 8601 strings.

## Merge rules

1. Records are matched by stable `id`.
2. When the same id appears more than once, the record with the newest `updatedAt` wins.
3. Re-importing the same backup is idempotent and does not duplicate records.
4. Current records are merged, never replaced as a batch.
5. Growth Compass v1 and v2 content remains inside `legacyImport` unless a future migration explicitly maps its meaning.
6. Unknown future versions and unrelated JSON files are rejected before import.

## Apple migration path

The first native Apple version will import a Bearing JSON backup after showing a preview. Browser-local data cannot be read directly by a native app, so export and confirmed import are the safe bridge. The native app will use iCloud for Apple-device sync; the web app continues to use its existing local-first storage and optional Google Drive sync during the first phase.
