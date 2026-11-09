import assert from "node:assert/strict";
import {
  classifyGesture,
  detectTaiwanEasterEgg,
  shouldResolveComposition,
  tapMaterial
} from "../site/ink-current/ink-rules.mjs";

assert.equal(tapMaterial(140), "splatter", "rapid taps should create a lively splatter");
assert.equal(tapMaterial(620), "pool", "an ordinary tap rhythm should create pooled ink");
assert.equal(tapMaterial(1500), "wash", "a pause before tapping should create a softer wash");

const current = classifyGesture([
  { x: 0.1, y: 0.45, t: 0 },
  { x: 0.4, y: 0.38, t: 160 },
  { x: 0.8, y: 0.28, t: 320 }
]);
assert.equal(current.kind, "current", "an open directional stroke should pull ink into a current");
assert.equal(current.texture, "dry", "a quick stroke should leave dry-brush texture");

const vessel = classifyGesture([
  { x: 0.35, y: 0.25, t: 0 },
  { x: 0.62, y: 0.28, t: 240 },
  { x: 0.7, y: 0.54, t: 480 },
  { x: 0.48, y: 0.7, t: 720 },
  { x: 0.28, y: 0.5, t: 960 },
  { x: 0.35, y: 0.25, t: 1200 }
]);
assert.equal(vessel.kind, "vessel", "a closed gesture should gather ink");
assert.equal(vessel.texture, "wet", "a slow gesture should remain wet and pooled");

const crossing = classifyGesture([
  { x: 0.2, y: 0.2, t: 0 },
  { x: 0.8, y: 0.8, t: 220 },
  { x: 0.8, y: 0.2, t: 440 },
  { x: 0.2, y: 0.8, t: 660 }
]);
assert.equal(crossing.kind, "crossing", "a self-crossing gesture should burst ink outward");

assert.equal(
  shouldResolveComposition({ actions: 6, idleMs: 3000, coherence: 0.8 }),
  false,
  "the composition should not resolve before the visitor has explored enough"
);
assert.equal(
  shouldResolveComposition({ actions: 8, idleMs: 1800, coherence: 0.8 }),
  false,
  "the composition should not resolve while the visitor is still interacting"
);
assert.equal(
  shouldResolveComposition({ actions: 8, idleMs: 2400, coherence: 0.64 }),
  true,
  "a sufficiently explored, coherent, resting composition should resolve"
);

const taiwanPattern = [
  [
    { x: 0.51, y: 0.18, t: 0 },
    { x: 0.48, y: 0.42, t: 280 },
    { x: 0.53, y: 0.78, t: 620 }
  ],
  [
    { x: 0.2, y: 0.28, t: 0 },
    { x: 0.15, y: 0.5, t: 240 },
    { x: 0.32, y: 0.72, t: 500 }
  ],
  [
    { x: 0.8, y: 0.28, t: 0 },
    { x: 0.86, y: 0.5, t: 240 },
    { x: 0.7, y: 0.72, t: 500 }
  ]
];
assert.equal(
  detectTaiwanEasterEgg(taiwanPattern),
  true,
  "a central north-south spine with currents on both sides should reveal the Taiwan easter egg"
);
assert.equal(
  detectTaiwanEasterEgg(taiwanPattern.slice(0, 2)),
  false,
  "an incomplete one-sided pattern should stay abstract"
);

console.log("Ink Current rule tests passed.");
