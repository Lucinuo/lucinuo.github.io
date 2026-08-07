const GROUPS = {
  begin: ["開始", "起點", "start", "begin", "new"],
  finish: ["完成", "結束", "終於", "finish", "done", "complete"],
  pause: ["停", "休息", "等待", "pause", "rest", "wait"],
  connect: ["一起", "相遇", "連", "connect", "meet", "with"],
  separate: ["離開", "分開", "告別", "leave", "apart", "goodbye"],
  move: ["走", "去", "移動", "move", "walk", "go"],
  repeat: ["再", "又", "重複", "again", "repeat", "return"],
  notice: ["看見", "發現", "注意", "notice", "saw", "found"],
};

const RESPONSES = {
  begin: [["young-fern", "plant", "young-fern"], ["ripple", "water", "ripple"], ["warm-light", "light", "warm-light"]],
  finish: [["moss", "plant", "moss"], ["pebble-field", "rock", "pebble-field"], ["warm-light", "light", "warm-light"]],
  pause: [["thin-mist", "weather", "thin-mist"], ["moss", "plant", "moss"], ["ripple", "water", "ripple"]],
  connect: [["ripple", "water", "ripple"], ["young-fern", "plant", "young-fern"], ["warm-light", "light", "warm-light"]],
  separate: [["pebble-field", "rock", "pebble-field"], ["thin-mist", "weather", "thin-mist"], ["moss", "plant", "moss"]],
  move: [["ripple", "water", "ripple"], ["pebble-field", "rock", "pebble-field"], ["young-fern", "plant", "young-fern"]],
  repeat: [["moss", "plant", "moss"], ["ripple", "water", "ripple"], ["thin-mist", "weather", "thin-mist"]],
  notice: [["warm-light", "light", "warm-light"], ["young-fern", "plant", "young-fern"], ["pebble-field", "rock", "pebble-field"]],
  neutral: [["moss", "plant", "moss"], ["ripple", "water", "ripple"], ["warm-light", "light", "warm-light"], ["pebble-field", "rock", "pebble-field"], ["thin-mist", "weather", "thin-mist"], ["young-fern", "plant", "young-fern"]],
};

const LABELS = {
  moss: ["苔蘚", "Moss"], "young-fern": ["幼蕨", "Young fern"], ripple: ["水紋", "Ripple"],
  "warm-light": ["暖光", "Warm light"], "pebble-field": ["礫地", "Pebble field"], "thin-mist": ["薄霧", "Thin mist"],
};
const DESCRIPTIONS = {
  moss: ["一小片安靜地貼近地表", "A quiet patch settles close to the ground."],
  "young-fern": ["一株幼蕨向光展開", "A young fern opens toward the light."],
  ripple: ["水面留下緩慢擴散的紋路", "Slow rings spread across water."],
  "warm-light": ["一束光停留在這裡", "A warm beam rests here."],
  "pebble-field": ["地表露出細小的礫石", "Fine pebbles surface here."],
  "thin-mist": ["一層薄霧輕輕經過", "A thin mist moves through."],
};

export function normalizeTrace(text) {
  return String(text || "").trim().replace(/\s+/g, " ").slice(0, 200);
}

export function mulberry32(seed) {
  let state = (Number(seed) || 0) >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function matchedGroup(text) {
  const lower = text.toLowerCase();
  return Object.keys(GROUPS).find((group) => GROUPS[group].some((token) => lower.includes(token))) || "neutral";
}

function makeResponse([id, kind, variant]) {
  return { id, kind, variant, titleKey: id, descriptionKey: id, title: LABELS[id], description: DESCRIPTIONS[id] };
}

export function responseChoices(text, seed = 0) {
  const trace = normalizeTrace(text);
  if (!trace) return [];
  const pool = RESPONSES[matchedGroup(trace)];
  const random = mulberry32(seed + trace.length);
  const shuffled = [...pool].sort(() => random() - 0.5);
  const unique = [];
  for (const item of shuffled) {
    if (!unique.some((choice) => choice[1] === item[1])) unique.push(item);
    if (unique.length === 3) break;
  }
  for (const item of RESPONSES.neutral) {
    if (!unique.some((choice) => choice[1] === item[1])) unique.push(item);
    if (unique.length === 3) break;
  }
  return unique.slice(0, 3).map(makeResponse);
}

const STARTERS = [
  ["cove", "潮灣", "Tidal cove", "starter-cove.webp"],
  ["river", "內流河", "Inland river", "starter-river.webp"],
  ["ridge", "岩脊", "Rocky ridge", "starter-ridge.webp"],
];

export function starterChoices(text, seed = 0) {
  const responses = responseChoices(text, seed);
  if (!responses.length) return [];
  return STARTERS.map(([id, zh, en, asset], index) => ({ id, titleKey: id, descriptionKey: id, title: [zh, en], asset: `./assets/${asset}`, accentResponse: responses[index] }));
}
