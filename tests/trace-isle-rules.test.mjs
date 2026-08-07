import assert from "node:assert/strict";
import { responseChoices, starterChoices } from "../site/trace-isle/nature-rules.mjs";
import { candidatePositions, applyResponse, deriveEvolutions } from "../site/trace-isle/world-rules.mjs";
import { createWorld } from "../site/trace-isle/world-model.mjs";
import { revealProgress } from "../site/trace-isle/renderer.mjs";

const trace = "今天終於完成一件拖了很久的事";
const starters = starterChoices(trace, 42);
assert.deepEqual(starters.map(({ id }) => id), ["cove", "river", "ridge"]);
assert.equal(new Set(starters.map(({ accentResponse }) => accentResponse.id)).size, 3);
const first = responseChoices(trace, 42);
assert.deepEqual(first, responseChoices(trace, 42));
assert.equal(first.length, 3);
assert.equal(new Set(first.map(({ id }) => id)).size, 3);
assert.equal(JSON.stringify(first).includes("開心"), false);
assert.equal(responseChoices("ordinary day", 7).length, 3);
assert.deepEqual(responseChoices("   ", 7), []);
assert.equal(responseChoices("a".repeat(201), 7).length, 3);

const world = createWorld({ islandId: "cove", seed: 42, createdAt: "2026-08-06T00:00:00.000Z" });
const choices = candidatePositions(world, first[0], 1);
assert.equal(choices.length, 3);
assert.equal(new Set(choices.map(({ id }) => id)).size, 3);
assert.ok(choices.every(({ x, y }) => x >= .12 && x <= .88 && y >= .16 && y <= .84));
world.objects.push({ id: "occupied", kind: "plant", variant: "moss", x: choices[0].x, y: choices[0].y, sourceEntryId: "old", createdAt: "2026-08-06T00:00:00.000Z" });
const spaced = candidatePositions(world, first[0], 1);
assert.ok(spaced.every(({ x, y }) => Math.hypot(x - choices[0].x, y - choices[0].y) >= .08));
for (let index = 0; index < 11; index += 1) world.objects.push({ id: `full-${index}`, kind: "rock", variant: "pebble-field", x: [.2,.37,.56,.74,.27,.48,.68,.22,.42,.6,.78][index], y: [.27,.22,.28,.35,.45,.43,.5,.65,.62,.7,.68][index], sourceEntryId: `old-${index}`, createdAt: "2026-08-06T00:00:00.000Z" });
assert.ok(candidatePositions(world, first[0], 2).some(({ id }) => id.startsWith("ring-1-")));

const fresh = createWorld({ islandId: "river", seed: 7, createdAt: "2026-08-06T00:00:00.000Z" });
const response = responseChoices("ordinary day", 7)[0];
const firstPosition = candidatePositions(fresh, response, 3)[0];
const hidden = applyResponse(fresh, response, firstPosition, { id: "hidden", text: "do not keep", retainText: false, createdAt: "2026-08-06T00:00:00.000Z", seed: 3 });
assert.equal("text" in hidden.entry, false);
assert.equal(hidden.world.objects[0].sourceEntryId, "hidden");
const keptResponse = responseChoices("begin", 8)[0];
const secondPosition = candidatePositions(hidden.world, keptResponse, 4)[0];
const kept = applyResponse(hidden.world, keptResponse, secondPosition, { id: "kept", text: "keep me", retainText: true, createdAt: "2026-08-06T00:01:00.000Z", seed: 4 });
assert.equal(kept.entry.text, "keep me");

const grove = createWorld({ islandId: "ridge", seed: 9, createdAt: "2026-08-06T00:00:00.000Z" });
grove.objects.push(...[[.3,.3],[.36,.32],[.33,.38]].map(([x, y], index) => ({ id: `plant-${index}`, kind: "plant", variant: "moss", x, y, sourceEntryId: `entry-${index}`, createdAt: "2026-08-06T00:00:00.000Z" })));
assert.equal(deriveEvolutions(grove).length, 1);
grove.evolutions.push(...deriveEvolutions(grove));
assert.equal(deriveEvolutions(grove).length, 0);
assert.equal(revealProgress({ elapsed: 300 }), .5);
assert.equal(revealProgress({ reducedMotion: true, elapsed: 0 }), 1);

console.log("Trace Isle rules tests passed");
