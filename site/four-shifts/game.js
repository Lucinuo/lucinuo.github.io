import { DONENESS, MENU, SHIFTS, STEPS, completeDelivery, freshState, normalizeSave, periodFor, scoreDoneness, scorePlate } from "./game-rules.mjs";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const SAVE_KEY = "restaurant-rookie-v1";
const FLOOR_POSITIONS = { 1: [54, 32], 2: [72, 32], 3: [34, 75], 4: [59, 68], 5: [83, 73] };
const INTERRUPTIONS = [
  { line: "等一下再教，先幫 4 號桌補水。", task: { type: "補水", table: 4 } },
  { line: "先幫我收一下 5 號桌。", task: { type: "收桌", table: 5 } },
  { line: "今天先消毒，有空再練。", task: { type: "消毒", table: 2 } },
  { line: "這個照剛才那樣做。", task: { type: "擦桌", table: 3 } },
];

let state = freshState();
let message = "先到接單區看看今天的第一張單。";

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}

function load() {
  try { return normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY))); } catch { return null; }
}

function describe(order) {
  const dish = MENU[order.dish];
  return `${dish.label}｜${DONENESS[order.doneness].label}｜${dish.topping}`;
}

function activeOrder(status) {
  return state.orders.find((order) => order.status === status);
}

function update(nextMessage = message) {
  message = nextMessage;
  save();
  render();
}

function render() {
  const period = periodFor(state);
  $("[data-period]").textContent = period.label;
  $("[data-rush]").textContent = period.rush;
  $("[data-completed]").textContent = state.completed;
  $("[data-reputation]").textContent = state.reputation;
  $("[data-ready]").textContent = state.orders.filter((order) => order.status === "ready").length;
  $("[data-floor-count]").textContent = state.floorTasks.length;
  $("[data-message]").textContent = message;
  $$('[data-station]').forEach((button) => button.setAttribute("aria-current", String(button.dataset.station === state.station)));
  renderTickets();
  renderNotes(period.known);
  renderInterruption();
  renderStation();
}

function renderTickets() {
  const labels = { waiting: "等候接單", accepted: "待下麵", cooking: "料理中", cooked: "待擺盤", ready: "待送餐" };
  $("[data-tickets]").replaceChildren(...state.orders.map((order) => {
    const ticket = document.createElement("article");
    ticket.className = "ticket";
    ticket.dataset.status = order.status;
    ticket.innerHTML = `<strong>${order.table}</strong><div><p>${MENU[order.dish].label}</p><small>${DONENESS[order.doneness].label}・${MENU[order.dish].topping}・${labels[order.status]}</small></div>`;
    return ticket;
  }));
}

function renderNotes(known) {
  $("[data-known-count]").textContent = `${known}/${STEPS.length}`;
  $("[data-notes]").innerHTML = STEPS.map((step, index) => `<li class="${index < known ? "" : "unknown"}">${index < known ? step : "???"}</li>`).join("");
}

function renderInterruption() {
  const box = $("[data-interruption]");
  box.hidden = state.interruption == null;
  if (state.interruption == null) return;
  const event = INTERRUPTIONS[state.interruption];
  $("[data-interruption-line]").textContent = event.line;
  $("[data-interruption-actions]").innerHTML = `
    <button class="choice-button" type="button" data-interrupt-choice="finish">先完成手上工作</button>
    <button class="choice-button" type="button" data-interrupt-choice="switch">改去處理</button>`;
}

function renderStation() {
  ({ order: renderOrder, cook: renderCook, plate: renderPlate, floor: renderFloor })[state.station]();
}

function renderOrder() {
  const order = activeOrder("waiting");
  $("[data-view]").innerHTML = `<div class="station-canvas order-desk"><article class="order-card">
    <p class="kicker">接單區</p>
    ${order ? `<h2>${order.table} 號桌的新訂單</h2><dl><dt>餐點</dt><dd>${MENU[order.dish].label}</dd><dt>麵條</dt><dd>${DONENESS[order.doneness].label}</dd><dt>指定配料</dt><dd>${MENU[order.dish].topping}</dd></dl><button class="primary" type="button" data-action="accept" data-order="${order.id}">確認接單</button>` : `<h2>目前沒有新單</h2><p class="empty-state">看看右側單據目前卡在哪一站，或到店面處理臨時工作。</p>`}
  </article></div>`;
}

function renderCook() {
  const order = activeOrder("accepted") || activeOrder("cooking");
  const potHtml = state.pots.map((pot, index) => `<div class="pot"><div class="timer" data-pot-time="${index}">${pot ? "0.0" : "空鍋"}</div><button class="action" type="button" data-action="${pot ? "lift" : "boil"}" data-pot="${index}" ${!pot && !activeOrder("accepted") ? "disabled" : ""}>${pot ? "起鍋" : "下麵"}</button></div>`).join("");
  $("[data-view]").innerHTML = `<div class="station-canvas cook-canvas"><div class="pot-grid">${potHtml}</div>${order ? `<article class="cook-ticket"><strong>${order.table} 號桌｜${MENU[order.dish].label}</strong><p>目標：${DONENESS[order.doneness].label}</p><p>提示：${DONENESS[order.doneness].seconds} 秒附近起鍋</p></article>` : ""}</div>`;
  updateTimers();
}

function renderPlate() {
  const order = activeOrder("cooked");
  const sauces = ["番茄醬", "白醬", "青醬"];
  const toppings = ["起司", "蘑菇", "羅勒", "培根", "番茄", "堅果"];
  const options = (items, type) => items.map((item) => `<button type="button" data-plate-option="${type}" data-value="${item}" aria-pressed="${state.plate[type] === item}">${item}</button>`).join("");
  $("[data-view]").innerHTML = `<div class="station-canvas plate-canvas"><article class="panel">
    ${order ? `<h2>${order.table} 號桌｜${MENU[order.dish].label}</h2><div class="dish-preview" data-dish="${MENU[order.dish].dish}" role="img" aria-label="${MENU[order.dish].label}"></div><div class="option-group"><strong>選醬料</strong><div class="options">${options(sauces, "sauce")}</div></div><div class="option-group"><strong>加一種配料</strong><div class="options">${options(toppings, "topping")}</div></div><button class="primary plate-submit" type="button" data-action="plate" data-order="${order.id}" ${!state.plate.sauce || !state.plate.topping ? "disabled" : ""}>完成擺盤</button>` : `<h2>目前沒有餐點可擺盤</h2><p class="empty-state">先到料理區把麵煮好。</p>`}
  </article></div>`;
}

function renderFloor() {
  const ready = activeOrder("ready");
  const alerts = new Set([...state.floorTasks.map((task) => task.table), ...(ready ? [ready.table] : [])]);
  const markers = [1, 2, 3, 4, 5].map((table) => `<button class="table-marker" type="button" data-table="${table}" data-alert="${alerts.has(table)}" aria-label="前往 ${table} 號桌">${table}</button>`).join("");
  const taskButtons = [ready ? `<button type="button" data-table="${ready.table}">送餐到 ${ready.table} 號桌</button>` : "", ...state.floorTasks.map((task) => `<button type="button" data-task="${task.id}">${task.type}・${task.table} 號桌</button>`)].join("");
  $("[data-view]").innerHTML = `<div class="station-canvas floor-canvas">${markers}<img class="rookie" data-rookie src="./assets/rookie.webp" width="1024" height="1536" alt="餐廳新人角色"><div class="floor-actions">${taskButtons || "<button type=\"button\" disabled>店面目前沒有待辦</button>"}</div></div>`;
}

function accept(orderId) {
  const order = state.orders.find((item) => item.id === orderId && item.status === "waiting");
  if (!order) return;
  order.status = "accepted";
  state.station = "cook";
  if (state.shift < SHIFTS.length && !state.seenInterruptions.includes(state.shift)) {
    state.interruption = state.shift;
    state.seenInterruptions.push(state.shift);
  }
  update("接單完成。到料理區選一口空鍋下麵。");
}

function boil(potIndex) {
  const order = activeOrder("accepted");
  if (!order || state.pots[potIndex]) return;
  order.status = "cooking";
  state.pots[potIndex] = { orderId: order.id, startedAt: Date.now() };
  update(`第 ${potIndex + 1} 口鍋開始計時。`);
}

function lift(potIndex) {
  const pot = state.pots[potIndex];
  if (!pot) return;
  const order = state.orders.find((item) => item.id === pot.orderId);
  const elapsed = (Date.now() - pot.startedAt) / 1000;
  order.cookScore = scoreDoneness(elapsed, order.doneness);
  order.status = "cooked";
  state.pots[potIndex] = null;
  state.station = "plate";
  update(`起鍋完成：熟度 ${order.cookScore >= 70 ? "合格" : "有偏差"}。接著選醬料與配料。`);
}

function plate(orderId) {
  const order = state.orders.find((item) => item.id === orderId && item.status === "cooked");
  if (!order) return;
  order.plateScore = scorePlate(order, state.plate.sauce, state.plate.topping);
  order.status = "ready";
  state.station = "floor";
  update(`擺盤完成：${order.plateScore === 100 ? "內容正確" : "餐點有誤"}。送到 ${order.table} 號桌。`);
}

function visitTable(table) {
  const [x, y] = FLOOR_POSITIONS[table];
  const rookie = $("[data-rookie]");
  rookie?.style.setProperty("--x", `${x}%`);
  rookie?.style.setProperty("--y", `${y}%`);
  const ready = state.orders.find((order) => order.status === "ready" && order.table === table);
  if (ready) {
    state = completeDelivery(state, ready.id);
    update(`送餐完成。${state.shift === SHIFTS.length && state.completed === SHIFTS.length ? "新手班次結束，進入日常營運。" : "下一張單已經進來了。"}`);
    return;
  }
  const task = state.floorTasks.find((item) => item.table === table);
  if (task) return completeTask(task.id);
  update(`${table} 號桌目前沒有待辦。`);
}

function completeTask(id) {
  const task = state.floorTasks.find((item) => item.id === id);
  if (!task) return;
  state.floorTasks = state.floorTasks.filter((item) => item.id !== id);
  state.reputation = Math.min(100, state.reputation + 1);
  update(`${task.table} 號桌的「${task.type}」完成。`);
}

function chooseInterruption(choice) {
  const event = INTERRUPTIONS[state.interruption];
  if (!event) return;
  if (choice === "switch") {
    state.floorTasks.push({ ...event.task, id: `interrupt-${state.shift}` });
    state.station = "floor";
    message = `先去處理「${event.task.type}」。原本的餐點還在等。`;
  } else {
    state.reputation = Math.max(0, state.reputation - 1);
    message = "先把手上的餐點完成；臨時要求沒有消失，但順序比較清楚。";
  }
  state.interruption = null;
  update(message);
}

function updateTimers() {
  state.pots.forEach((pot, index) => {
    const node = $(`[data-pot-time="${index}"]`);
    if (node && pot) node.textContent = `${((Date.now() - pot.startedAt) / 1000).toFixed(1)}s`;
  });
}

function start(nextState) {
  state = nextState;
  $("[data-intro]").hidden = true;
  $("[data-play]").hidden = false;
  update(message);
}

$("[data-start]").addEventListener("click", () => {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  message = "先到接單區看看今天的第一張單。";
  start(freshState());
});
$("[data-continue]").addEventListener("click", () => {
  message = "已載入上次進度。";
  start(load() || freshState());
});
$$('[data-station]').forEach((button) => button.addEventListener("click", () => { state.station = button.dataset.station; update(); }));
$("[data-game]").addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.action === "accept") accept(Number(target.dataset.order));
  if (target.dataset.action === "boil") boil(Number(target.dataset.pot));
  if (target.dataset.action === "lift") lift(Number(target.dataset.pot));
  if (target.dataset.action === "plate") plate(Number(target.dataset.order));
  if (target.dataset.plateOption) { state.plate[target.dataset.plateOption] = target.dataset.value; update(); }
  if (target.dataset.table) visitTable(Number(target.dataset.table));
  if (target.dataset.task) completeTask(target.dataset.task);
  if (target.dataset.interruptChoice) chooseInterruption(target.dataset.interruptChoice);
});
addEventListener("keydown", (event) => {
  if ($("[data-play]").hidden || !/^[1-4]$/.test(event.key)) return;
  state.station = ["order", "cook", "plate", "floor"][Number(event.key) - 1];
  update();
});
setInterval(updateTimers, 100);

$("[data-continue]").hidden = !load();
