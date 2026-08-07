import { buildBackup, clearWorld, createWorld, readWorld, restoreBackup, saveWorld } from "./world-model.mjs";
import { responseChoices, starterChoices } from "./nature-rules.mjs";
import { applyResponse, candidatePositions } from "./world-rules.mjs";
import { canvasPoint, drawWorld, hitTest, loadIslandAssets } from "./renderer.mjs";

const $ = (selector) => document.querySelector(selector);
const canvas = $("[data-world]");
const form = $("[data-trace-form]");
const input = $("[data-input]");
const retain = $("[data-retain]");
const status = $("[data-status]");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const objectDialog = $("[data-object-dialog]");
let world = readWorld();
let pending = null;
let selectedResponse = null;
let zoom = 1;
let pendingRestore = null;
let storageWarningShown = false;
let detailTrigger = null;

function dateNow() { return new Date().toISOString(); }
function idNow() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function isZh() { return document.documentElement.dataset.lang === "zh"; }
function label(pair) { return pair?.[isZh() ? 0 : 1] || ""; }
function say(en, zh = en) { status.textContent = isZh() ? zh : en; }
function hide(selector) { $(selector).hidden = true; }
function show(selector) { $(selector).hidden = false; }

function setLanguageAndTheme() {
  try {
    const language = localStorage.getItem("lucinuo-language") || localStorage.getItem("growth-compass-language") || "en";
    document.documentElement.dataset.lang = language === "zh" ? "zh" : "en";
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    document.documentElement.dataset.theme = localStorage.getItem("lucinuo-theme") || localStorage.getItem("growth-compass-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch { /* The playable session does not depend on browser preferences. */ }
}

function save() {
  if (!world) return false;
  const saved = saveWorld(world);
  if (!saved && !storageWarningShown) {
    storageWarningShown = true;
    say("Storage is unavailable. This island can still be played and backed up, but it will disappear after reload.", "儲存空間目前無法使用。島嶼仍可遊玩與備份，但重新載入後會消失。");
  }
  return saved;
}

function responseName(response) { return label(response.title); }
function responseDescription(response) { return label(response.description); }

function renderObjectList() {
  const list = $("[data-object-list]");
  list.replaceChildren(...(world?.objects || []).map((object) => {
    const entry = world.entries.find((item) => item.id === object.sourceEntryId);
    const button = document.createElement("button"); button.type = "button";
    button.dataset.objectId = object.id;
    button.textContent = `${entry?.date || ""} — ${object.variant}`;
    button.addEventListener("click", () => openObject(object, button));
    const item = document.createElement("li"); item.append(button); return item;
  }));
}

function renderPositions() {
  const layer = $("[data-positions]");
  layer.replaceChildren();
  if (!world || !selectedResponse) return;
  const transform = drawWorld(canvas, world, { zoom });
  for (const position of candidatePositions(world, selectedResponse, pending?.seed || 0)) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "position-choice"; button.dataset.position = position.id;
    button.style.left = `${position.x * transform.scale + transform.offsetX}px`;
    button.style.top = `${position.y * (2 / 3) * transform.scale + transform.offsetY}px`;
    button.style.transform = "translate(-50%, -50%)";
    button.setAttribute("aria-label", isZh() ? `選擇位置 ${position.id}` : `Choose location ${position.id}`);
    button.addEventListener("click", () => place(position));
    layer.append(button);
  }
}

function redraw({ revealObjectId = null } = {}) {
  $("[data-empty]").hidden = Boolean(world);
  $("[data-add]").hidden = !world;
  if (!world) { const context = canvas.getContext("2d"); canvas.width = canvas.clientWidth * (devicePixelRatio || 1); canvas.height = canvas.clientHeight * (devicePixelRatio || 1); context.fillStyle = "#123e4b"; context.fillRect(0, 0, canvas.width, canvas.height); return; }
  if (!revealObjectId || reducedMotion.matches) { drawWorld(canvas, world, { zoom, reducedMotion: reducedMotion.matches }); return; }
  const started = performance.now();
  const frame = (time) => { drawWorld(canvas, world, { zoom, revealObjectId, elapsed: time - started }); if (time - started < 600) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}

function clearChoices() { hide("[data-starters]"); hide("[data-responses]"); $("[data-positions]").replaceChildren(); selectedResponse = null; }

function renderStarters() {
  const list = $("[data-starter-list]"); list.replaceChildren();
  for (const choice of starterChoices(pending.text, pending.seed)) {
    const button = document.createElement("button"); button.type = "button"; button.className = "starter-card";
    const image = document.createElement("img"); image.src = choice.asset; image.alt = label(choice.title);
    const title = document.createElement("strong"); title.textContent = label(choice.title);
    const accent = document.createElement("small"); accent.textContent = responseName(choice.accentResponse);
    button.append(image, title, accent); button.addEventListener("click", () => chooseStarter(choice)); list.append(button);
  }
  show("[data-starters]");
}

function renderResponses() {
  const list = $("[data-response-list]"); list.replaceChildren();
  for (const response of responseChoices(pending.text, pending.seed)) {
    const button = document.createElement("button"); button.type = "button"; button.className = "response-card"; button.dataset.response = response.id;
    const title = document.createElement("strong"); title.textContent = responseName(response);
    const description = document.createElement("small"); description.textContent = responseDescription(response);
    button.append(title, description); button.addEventListener("click", () => { selectedResponse = response; hide("[data-responses]"); renderPositions(); say("Choose a place on the island.", "選擇島上的一個位置。"); }); list.append(button);
  }
  show("[data-responses]");
}

function chooseStarter(choice) {
  world = createWorld({ islandId: choice.id, seed: pending.seed, createdAt: dateNow() });
  save(); hide("[data-starters]"); redraw(); renderResponses();
  say("Choose the first small change.", "選擇第一個小變化。");
}

function place(position) {
  const applied = applyResponse(world, selectedResponse, position, { id: idNow(), date: dateNow().slice(0, 10), text: pending.text, retainText: pending.retainText, createdAt: dateNow(), seed: pending.seed });
  if (!applied) { say("That place is no longer available. Choose another one.", "這個位置已經不適合了，請選另一個。" ); renderPositions(); return; }
  world = applied.world; save(); clearChoices(); input.value = ""; retain.checked = false;
  redraw({ revealObjectId: applied.object.id }); renderObjectList();
  pending = null; say("The island changed.", "島嶼出現了一點變化。");
  requestAnimationFrame(() => openObject(applied.object, document.querySelector(`[data-object-id="${applied.object.id}"]`)));
}

function openObject(object, trigger = null) {
  detailTrigger = trigger;
  const entry = world?.entries.find((item) => item.id === object.sourceEntryId);
  $("[data-object-title]").textContent = object.variant;
  $("[data-object-date]").textContent = entry?.date || "";
  $("[data-object-text]").textContent = entry?.text || (isZh() ? "這次只留下了島嶼的變化。" : "Only the island's change was kept this time.");
  objectDialog.showModal();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim().replace(/\s+/g, " ").slice(0, 200);
  if (!text) { say("Please leave one sentence before continuing.", "請先留下一句話，再繼續。" ); input.focus(); return; }
  pending = { text, retainText: retain.checked, seed: Math.floor(Math.random() * 2 ** 31) };
  clearChoices();
  if (!world) renderStarters(); else renderResponses();
});

$("[data-clear-input]").addEventListener("click", () => { input.value = ""; input.focus(); });
$("[data-add]").addEventListener("click", () => { input.focus(); });
document.querySelectorAll("[data-zoom]").forEach((button) => button.addEventListener("click", () => { const levels = [.8, 1, 1.25, 1.5]; const index = levels.indexOf(zoom); zoom = levels[Math.max(0, Math.min(levels.length - 1, index + (button.dataset.zoom === "in" ? 1 : -1)))]; redraw(); renderPositions(); }));
$("[data-settings]").addEventListener("click", () => $("[data-settings-dialog]").showModal());
$("[data-close-object]").addEventListener("click", () => objectDialog.close());
objectDialog.addEventListener("close", () => {
  const trigger = detailTrigger;
  detailTrigger = null;
  requestAnimationFrame(() => trigger?.focus());
});
canvas.addEventListener("click", (event) => { const object = hitTest(world, canvasPoint(canvas, event)); if (object) openObject(object, canvas); });
addEventListener("resize", () => { redraw(); renderPositions(); });
reducedMotion.addEventListener("change", () => redraw());

$("[data-backup]").addEventListener("click", () => {
  if (!world) { say("There is no island to back up yet.", "目前還沒有可備份的島嶼。" ); return; }
  const blob = new Blob([JSON.stringify(buildBackup(world), null, 2)], { type: "application/json" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `trace-isle-${dateNow().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 0);
});
$("[data-restore]").addEventListener("change", async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  const restored = restoreBackup(world, await file.text()); event.target.value = "";
  if (!restored) { say("That backup could not be read. Your island was unchanged.", "這份備份無法讀取；你的島嶼沒有被改變。" ); return; }
  pendingRestore = restored; $("[data-restore-summary]").textContent = isZh() ? `這份備份有 ${restored.objects.length} 個自然變化。` : `This backup contains ${restored.objects.length} natural change${restored.objects.length === 1 ? "" : "s"}.`;
  $("[data-restore-dialog]").showModal();
});
$("[data-cancel-restore]").addEventListener("click", () => { pendingRestore = null; $("[data-restore-dialog]").close(); });
$("[data-confirm-restore]").addEventListener("click", () => { if (!pendingRestore) return; world = pendingRestore; pendingRestore = null; save(); clearChoices(); redraw(); renderObjectList(); $("[data-restore-dialog]").close(); $("[data-settings-dialog]").close(); say("Island restored.", "島嶼已復原。" ); });
$("[data-clear-world]").addEventListener("click", () => {
  if (!world || !confirm("Clear this island from this device? / 要從這台裝置清除這座島嗎？")) return;
  clearWorld(); world = null; pending = null; clearChoices(); redraw(); renderObjectList(); $("[data-settings-dialog]").close(); say("The island was cleared from this device.", "島嶼已從這台裝置清除。" );
});

setLanguageAndTheme();
await loadIslandAssets();
redraw(); renderObjectList();
if (world) say("Your island is here.", "你的島嶼在這裡。" );
