import { SHIFTS, applyChoice, endingFor, initialState } from "./game-rules.mjs";

const $ = (selector) => document.querySelector(selector);
let state = initialState();

function renderOrders() {
  const count = Math.min(12, 4 + state.shift * 2 + Math.floor(state.strain / 10));
  $("[data-orders]").replaceChildren(...Array.from({ length: count }, (_, index) => {
    const slip = document.createElement("i");
    slip.className = "order";
    slip.style.setProperty("--tilt", `${(index % 3 - 1) * 3}deg`);
    return slip;
  }));
}

function renderShift() {
  if (state.shift >= SHIFTS.length) return finish();
  const shift = SHIFTS[state.shift];
  $("[data-shift-label]").textContent = shift.label;
  $("[data-shift-time]").textContent = shift.time;
  $("[data-shift-crowd]").textContent = shift.crowd;
  $("[data-context]").textContent = shift.context;
  $("[data-speaker]").textContent = shift.speaker;
  $("[data-line]").textContent = shift.line;
  $("[data-thought]").textContent = shift.thought;
  $("[data-learned]").textContent = `${state.learned}%`;
  $("[data-assumed]").textContent = `${state.assumed}%`;
  $("[data-learned-meter]").style.width = `${state.learned}%`;
  $("[data-assumed-meter]").style.width = `${state.assumed}%`;
  $("[data-choices]").replaceChildren(...shift.choices.map((label, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.innerHTML = `<b>${index + 1}</b>${label}`;
    button.addEventListener("click", () => choose(index));
    return button;
  }));
  renderOrders();
  $("[data-choices] button")?.focus();
}

function choose(index) {
  state = applyChoice(state, index);
  renderShift();
}

function finish() {
  const ending = endingFor(state);
  $("[data-play]").hidden = true;
  $("[data-ending]").hidden = false;
  $("[data-ending-title]").textContent = ending.title;
  $("[data-ending-copy]").textContent = ending.copy;
  $("[data-restart]").focus();
}

function start() {
  state = initialState();
  $("[data-intro]").hidden = true;
  $("[data-ending]").hidden = true;
  $("[data-play]").hidden = false;
  renderShift();
}

$("[data-start]").addEventListener("click", start);
$("[data-restart]").addEventListener("click", start);
addEventListener("keydown", (event) => {
  if ($("[data-play]").hidden || !/^[1-3]$/.test(event.key)) return;
  choose(Number(event.key) - 1);
});
