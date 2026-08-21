import { DONENESS, MENU, SHIFTS, STEPS, advanceMotion, completeDelivery, createMotion, freshState, normalizeSave, periodFor, routeBetween, scoreDoneness, scorePlate } from "./game-rules.mjs";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const SAVE_KEY = "restaurant-rookie-v1";
const SETTINGS_KEY = "restaurant-rookie-settings-v1";
const ROOKIE_FRAME_OFFSETS = [
  [[3.41, -2.21], [1.82, 0], [0.28, 0.26], [-1.88, -0.13], [-1.84, 0.52]],
  [[3.29, 0], [1.7, 0], [0.2, 0], [-1.35, -2.99], [-1.76, 0]],
  [[3.41, 0], [1.5, 0], [-0.21, 0], [-1.55, 0], [-2.49, 0]],
  [[3.69, -0.13], [1.62, 0], [-0.25, -0.13], [-1.68, 0.13], [-2.21, 0.26]],
];
const INTERRUPTIONS = [
  { zh: "等一下再教，先幫 4 號桌補水。", en: "I'll show you later. Refill water at table 4 first.", task: { type: "補水", table: 4 } },
  { zh: "先幫我收一下 5 號桌。", en: "Please clear table 5 first.", task: { type: "收桌", table: 5 } },
  { zh: "今天先消毒，有空再練。", en: "Sanitizing comes first today. Practice when there's time.", task: { type: "消毒", table: 2 } },
  { zh: "這個照剛才那樣做。", en: "Do this the same way as before.", task: { type: "擦桌", table: 3 } },
];
const COPY = {
  zh: {
    title: "餐廳菜鳥", back: "返回作品", genre: "餐廳新人模擬遊戲", introTitle: "先看清楚。<br>再動起來。",
    start: "開始第一班", continue: "繼續上次進度", soundHint: "開始後會以低音量播放音樂與餐廳環境聲，可隨時關閉。",
    completed: "完成", ordersUnit: "單", reputation: "店內評價", music: "音樂", ambience: "環境聲",
    orderStation: "接單", cookStation: "料理", plateStation: "擺盤", coworkerRequest: "同事臨時交代",
    tickets: "待辦單", ready: "待出餐", floorTasks: "店面雜務", notes: "流程小抄",
    close: "關閉", newOrder: "號桌的新訂單", meal: "餐點", noodles: "麵條", topping: "指定配料",
    accept: "確認接單", noOrder: "目前沒有新單", noOrderHelp: "看看待辦單目前卡在哪一站，或到桌邊處理臨時工作。",
    emptyPot: "空鍋", lift: "起鍋", boil: "下麵", target: "目標", timerHint: "秒附近起鍋",
    noCook: "目前沒有餐點可料理", noCookHelp: "先到接單櫃台確認新訂單。",
    sauce: "選醬料", addTopping: "加一種配料", finishPlate: "完成擺盤",
    noPlate: "目前沒有餐點可擺盤", noPlateHelp: "先到料理區把麵煮好。",
    finishFirst: "先完成手上工作", switchTask: "改去處理",
    unknown: "???", table: "號桌", goTable: "前往", soundOn: "開啟", soundOff: "關閉",
    statuses: { waiting: "等候接單", accepted: "待下麵", cooking: "料理中", cooked: "待擺盤", ready: "待送餐" },
    tasks: { "補水": "補水", "收桌": "收桌", "消毒": "消毒", "擦桌": "擦桌" },
    dishes: { tomato: "番茄麵", cream: "白醬麵", pesto: "青醬麵" },
    doneness: { firm: "偏硬", normal: "正常", soft: "偏軟" },
    ingredients: { "番茄醬": "番茄醬", "白醬": "白醬", "青醬": "青醬", "起司": "起司", "蘑菇": "蘑菇", "羅勒": "羅勒", "培根": "培根", "番茄": "番茄", "堅果": "堅果" },
    steps: STEPS,
    shifts: SHIFTS.map((shift) => [shift.label, shift.rush]),
    daily: (day) => `日常營運・第 ${day} 天`,
    dailyRush: (completed) => completed % 3 === 1 ? "午餐尖峰" : "正常營業",
    messages: {
      first: "先走到接單櫃台，看看今天的第一張單。", loaded: "已載入上次進度。",
      walk: "菜鳥正走過去……", accepted: "接單完成。走到料理區選一口空鍋下麵。",
      pot: (n) => `第 ${n} 口鍋開始計時。`, lifted: (ok) => `起鍋完成：熟度${ok ? "合格" : "有偏差"}。接著走到擺盤區。`,
      plated: (ok, table) => `擺盤完成：${ok ? "內容正確" : "餐點有誤"}。送到 ${table} 號桌。`,
      delivered: (finished) => `送餐完成。${finished ? "新手班次結束，進入日常營運。" : "下一張單已經進來了。"}`,
      noTask: (table) => `${table} 號桌目前沒有待辦。`, taskDone: (table, task) => `${table} 號桌的「${task}」完成。`,
      switched: (task) => `先去處理「${task}」。原本的餐點還在等。`,
    },
  },
  en: {
    title: "Restaurant Rookie", back: "Back to projects", genre: "New-hire restaurant simulator", introTitle: "Look first.<br>Then get moving.",
    start: "Start first shift", continue: "Continue saved game", soundHint: "Soft music and restaurant ambience begin after you start. Both can be turned off anytime.",
    completed: "Completed", ordersUnit: "orders", reputation: "Rating", music: "Music", ambience: "Ambience",
    orderStation: "Orders", cookStation: "Kitchen", plateStation: "Plating", coworkerRequest: "Coworker request",
    tickets: "Order tickets", ready: "Ready to serve", floorTasks: "Floor tasks", notes: "Process notes",
    close: "Close", newOrder: " has a new order", meal: "Dish", noodles: "Noodles", topping: "Requested topping",
    accept: "Confirm order", noOrder: "No new orders", noOrderHelp: "Check the ticket status, or handle a floor task at a table.",
    emptyPot: "Empty", lift: "Lift", boil: "Boil", target: "Target", timerHint: " seconds",
    noCook: "Nothing to cook", noCookHelp: "Confirm the new ticket at the order counter first.",
    sauce: "Choose sauce", addTopping: "Add one topping", finishPlate: "Finish plating",
    noPlate: "Nothing to plate", noPlateHelp: "Cook the noodles in the kitchen first.",
    finishFirst: "Finish current task", switchTask: "Switch tasks",
    unknown: "???", table: "Table", goTable: "Go to table", soundOn: "Turn on", soundOff: "Turn off",
    statuses: { waiting: "Waiting", accepted: "Ready to boil", cooking: "Cooking", cooked: "Ready to plate", ready: "Ready to serve" },
    tasks: { "補水": "refill water", "收桌": "clear table", "消毒": "sanitize", "擦桌": "wipe table" },
    dishes: { tomato: "Tomato pasta", cream: "Cream pasta", pesto: "Pesto pasta" },
    doneness: { firm: "Firm", normal: "Regular", soft: "Soft" },
    ingredients: { "番茄醬": "Tomato sauce", "白醬": "Cream sauce", "青醬": "Pesto", "起司": "Cheese", "蘑菇": "Mushrooms", "羅勒": "Basil", "培根": "Bacon", "番茄": "Tomato", "堅果": "Nuts" },
    steps: ["Confirm table and dish", "Choose noodles and boil", "Time the doneness", "Lift and drain", "Mix in the right sauce", "Add the requested topping", "Serve the correct table"],
    shifts: [["Shift 1", "Opening prep"], ["Shift 2", "Lunch rush"], ["Shift 3", "Sanitizing"], ["Shift 4", "Dinner pickup"]],
    daily: (day) => `Daily service · Day ${day}`,
    dailyRush: (completed) => completed % 3 === 1 ? "Lunch rush" : "Regular service",
    messages: {
      first: "Walk to the order counter and check the first ticket.", loaded: "Saved progress loaded.",
      walk: "The rookie is walking over…", accepted: "Order confirmed. Walk to the kitchen and choose an empty pot.",
      pot: (n) => `Pot ${n} is timing.`, lifted: (ok) => `Noodles lifted: doneness ${ok ? "on target" : "was off"}. Walk to plating next.`,
      plated: (ok, table) => `Plating finished: ${ok ? "correct" : "something is wrong"}. Serve table ${table}.`,
      delivered: (finished) => `Order served. ${finished ? "Training shifts complete; daily service begins." : "A new ticket just came in."}`,
      noTask: (table) => `Table ${table} has nothing pending.`, taskDone: (table, task) => `Table ${table}: ${task} complete.`,
      switched: (task) => `Handle “${task}” first. The original order is still waiting.`,
    },
  },
};

let state = freshState();
let settings = loadSettings();
let messageKey = "first";
let messageArgs = [];
let panelOpen = false;
let moving = false;
let actorDestination = "hub";
let coworkerPatrolStarted = false;
let audioContext;
let musicGain;
let ambienceGain;
let ambienceSource;
let musicTimer;

const copy = () => COPY[settings.locale];
const dishName = (dish) => copy().dishes[dish];
const donenessName = (value) => copy().doneness[value];
const ingredientName = (value) => copy().ingredients[value] || value;
const taskName = (value) => copy().tasks[value] || value;
const messageText = () => {
  const value = copy().messages[messageKey];
  return typeof value === "function" ? value(...messageArgs) : value;
};

function loadSettings() {
  try {
    return { locale: "zh", music: true, ambience: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) };
  } catch {
    return { locale: "zh", music: true, ambience: true };
  }
}
function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
}
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}
function load() {
  try { return normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY))); } catch { return null; }
}
function activeOrder(status) {
  return state.orders.find((order) => order.status === status);
}
function say(key, ...args) {
  messageKey = key;
  messageArgs = args;
  $("[data-message]").textContent = messageText();
}
function update(key, ...args) {
  if (key) {
    messageKey = key;
    messageArgs = args;
  }
  save();
  render();
}

function applyLanguage() {
  document.documentElement.lang = settings.locale === "zh" ? "zh-Hant" : "en";
  $$("[data-i18n]").forEach((node) => { node.textContent = copy()[node.dataset.i18n]; });
  $$("[data-i18n-html]").forEach((node) => { node.innerHTML = copy()[node.dataset.i18nHtml]; });
  $("[data-close-panel]").ariaLabel = copy().close;
  $$("[data-table]").forEach((button) => {
    button.ariaLabel = `${copy().goTable} ${button.dataset.table}`;
  });
}

function localizedPeriod() {
  const period = periodFor(state);
  if (state.shift < SHIFTS.length) return { label: copy().shifts[state.shift][0], rush: copy().shifts[state.shift][1], known: period.known };
  return { label: copy().daily(state.day), rush: copy().dailyRush(state.completed), known: period.known };
}

function render() {
  applyLanguage();
  const period = localizedPeriod();
  $("[data-period]").textContent = period.label;
  $("[data-rush]").textContent = period.rush;
  $("[data-completed]").textContent = state.completed;
  $("[data-reputation]").textContent = state.reputation;
  $("[data-ready]").textContent = state.orders.filter((order) => order.status === "ready").length;
  $("[data-floor-count]").textContent = state.floorTasks.length;
  $("[data-message]").textContent = messageText();
  $("[data-music]").setAttribute("aria-pressed", String(settings.music));
  $("[data-ambience]").setAttribute("aria-pressed", String(settings.ambience));
  renderTickets();
  renderNotes(period.known);
  renderAlerts();
  renderInterruption();
  if (panelOpen) renderStation();
  const rookie = $("[data-rookie]");
  rookie.classList.toggle("carrying", Boolean(activeOrder("ready")) && !moving);
}

function renderTickets() {
  $("[data-tickets]").replaceChildren(...state.orders.map((order) => {
    const ticket = document.createElement("article");
    ticket.className = "ticket";
    ticket.dataset.status = order.status;
    ticket.innerHTML = `<strong>${order.table}</strong><div><p>${dishName(order.dish)}</p><small>${donenessName(order.doneness)} · ${ingredientName(MENU[order.dish].topping)} · ${copy().statuses[order.status]}</small></div>`;
    return ticket;
  }));
}
function renderNotes(known) {
  $("[data-known-count]").textContent = `${known}/${STEPS.length}`;
  $("[data-notes]").innerHTML = copy().steps.map((step, index) => `<li class="${index < known ? "" : "unknown"}">${index < known ? step : copy().unknown}</li>`).join("");
}
function renderAlerts() {
  const ready = activeOrder("ready");
  const alerts = new Set([...state.floorTasks.map((task) => task.table), ...(ready ? [ready.table] : [])]);
  $$("[data-table]").forEach((button) => button.dataset.alert = String(alerts.has(Number(button.dataset.table))));
}
function renderInterruption() {
  const box = $("[data-interruption]");
  box.hidden = state.interruption == null;
  if (state.interruption == null) return;
  const event = INTERRUPTIONS[state.interruption];
  $("[data-interruption-line]").textContent = event[settings.locale];
  $("[data-interruption-actions]").innerHTML = `
    <button class="choice-button" type="button" data-interrupt-choice="finish">${copy().finishFirst}</button>
    <button class="choice-button" type="button" data-interrupt-choice="switch">${copy().switchTask}</button>`;
}

function renderStation() {
  const panel = $("[data-panel]");
  panel.hidden = false;
  const names = { order: copy().orderStation, cook: copy().cookStation, plate: copy().plateStation };
  $("[data-panel-title]").textContent = names[state.station] || copy().orderStation;
  ({ order: renderOrder, cook: renderCook, plate: renderPlate })[state.station]?.();
}
function renderOrder() {
  const order = activeOrder("waiting");
  $("[data-view]").innerHTML = `<div class="panel-content order-card">
    ${order ? `<h3>${settings.locale === "zh" ? `${order.table} ${copy().newOrder}` : `${copy().table} ${order.table}${copy().newOrder}`}</h3>
      <dl><dt>${copy().meal}</dt><dd>${dishName(order.dish)}</dd><dt>${copy().noodles}</dt><dd>${donenessName(order.doneness)}</dd><dt>${copy().topping}</dt><dd>${ingredientName(MENU[order.dish].topping)}</dd></dl>
      <button class="primary" type="button" data-action="accept" data-order="${order.id}">${copy().accept}</button>`
      : `<h3>${copy().noOrder}</h3><p class="empty-state">${copy().noOrderHelp}</p>`}
  </div>`;
}
function renderCook() {
  const order = activeOrder("accepted") || activeOrder("cooking");
  const pots = state.pots.map((pot, index) => `<div class="pot"><div class="timer" data-pot-time="${index}">${pot ? "0.0" : copy().emptyPot}</div><button class="action" type="button" data-action="${pot ? "lift" : "boil"}" data-pot="${index}" ${!pot && !activeOrder("accepted") ? "disabled" : ""}>${pot ? copy().lift : copy().boil}</button></div>`).join("");
  $("[data-view]").innerHTML = `<div class="panel-content"><div class="pot-grid">${pots}</div>${order ? `<article class="cook-ticket"><strong>${copy().table} ${order.table} · ${dishName(order.dish)}</strong><p>${copy().target}: ${donenessName(order.doneness)}</p><p>${DONENESS[order.doneness].seconds}${copy().timerHint}</p></article>` : `<article class="cook-ticket"><strong>${copy().noCook}</strong><p>${copy().noCookHelp}</p></article>`}</div>`;
  updateTimers();
}
function renderPlate() {
  const order = activeOrder("cooked");
  const sauces = ["番茄醬", "白醬", "青醬"];
  const toppings = ["起司", "蘑菇", "羅勒", "培根", "番茄", "堅果"];
  const options = (items, type) => items.map((item) => `<button type="button" data-plate-option="${type}" data-value="${item}" aria-pressed="${state.plate[type] === item}">${ingredientName(item)}</button>`).join("");
  $("[data-view]").innerHTML = `<div class="panel-content plate-panel">
    ${order ? `<h3>${copy().table} ${order.table} · ${dishName(order.dish)}</h3><div class="dish-preview" data-dish="${MENU[order.dish].dish}" role="img" aria-label="${dishName(order.dish)}"></div><div class="option-group"><strong>${copy().sauce}</strong><div class="options">${options(sauces, "sauce")}</div></div><div class="option-group"><strong>${copy().addTopping}</strong><div class="options">${options(toppings, "topping")}</div></div><button class="primary plate-submit" type="button" data-action="plate" data-order="${order.id}" ${!state.plate.sauce || !state.plate.topping ? "disabled" : ""}>${copy().finishPlate}</button>`
      : `<h3>${copy().noPlate}</h3><p class="empty-state">${copy().noPlateHelp}</p>`}
  </div>`;
}
function closePanel() {
  panelOpen = false;
  $("[data-panel]").hidden = true;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function setSpriteFrame(element, direction, frame, kind) {
  if (kind === "coworker") {
    element.style.backgroundPosition = `${frame > 0 && frame % 2 === 0 ? 100 : 50}% 0`;
    element.style.transform = `translate(-50%, -76%) scaleX(${direction === "left" ? -1 : 1})`;
    element.dataset.direction = direction;
    return;
  }
  const rows = { down: 0, right: 1, up: 2, left: 3 };
  const row = rows[direction] ?? rows.right ?? 0;
  const [xOffset, yOffset] = ROOKIE_FRAME_OFFSETS[row][frame];
  element.style.backgroundPosition = `${frame * 25 + xOffset}% ${row * 100 / 3 + yOffset}%`;
  element.dataset.direction = direction;
}

function placeActor(element, motion, scene) {
  element.style.left = `${motion.x / scene.clientWidth * 100}%`;
  element.style.top = `${motion.y / scene.clientHeight * 100}%`;
  element.style.zIndex = String(7 + Math.floor(motion.y / scene.clientHeight * 10));
}

function animateRoute(element, route, kind, speed = 110, stride = 22) {
  const scene = $("[data-scene]");
  const points = route.map(([x, y]) => [x / 100 * scene.clientWidth, y / 100 * scene.clientHeight]);
  let motion = createMotion(points);
  placeActor(element, motion, scene);
  if (reducedMotion()) {
    motion = { ...motion, x: points.at(-1)[0], y: points.at(-1)[1], done: true };
    placeActor(element, motion, scene);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let previousTime;
    const tick = (time) => {
      const dt = previousTime == null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      motion = advanceMotion(motion, dt, { maxSpeed: speed, acceleration: speed * 2.4, deceleration: speed * 2.8, stride });
      placeActor(element, motion, scene);
      setSpriteFrame(element, motion.direction, motion.frame, kind);
      if (motion.done) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

async function walkTo(destination) {
  if (moving) return false;
  moving = true;
  closePanel();
  say("walk");
  const actor = $("[data-rookie]");
  const route = routeBetween(actorDestination, destination);
  actor.classList.remove("wiping");
  actor.classList.toggle("carrying", Boolean(activeOrder("ready")));
  actor.classList.add("walking");
  await animateRoute(actor, route, "rookie");
  actor.classList.remove("walking");
  actorDestination = destination;
  moving = false;
  render();
  return true;
}

async function startCoworkerPatrol() {
  if (coworkerPatrolStarted) return;
  coworkerPatrolStarted = true;
  const coworker = $("[data-coworker]");
  if (reducedMotion()) return;
  const routes = [
    [[24, 36], [33, 36]],
    [[33, 36], [24, 36]],
  ];
  let index = 0;
  while (coworkerPatrolStarted) {
    coworker.classList.add("walking");
    await animateRoute(coworker, routes[index], "coworker", 62, 16);
    coworker.classList.remove("walking");
    await wait(850);
    index = 1 - index;
  }
}
async function openDestination(destination) {
  if (!await walkTo(destination)) return;
  state.station = destination;
  panelOpen = true;
  update();
}

function accept(orderId) {
  const order = state.orders.find((item) => item.id === orderId && item.status === "waiting");
  if (!order) return;
  order.status = "accepted";
  if (state.shift < SHIFTS.length && !state.seenInterruptions.includes(state.shift)) {
    state.interruption = state.shift;
    state.seenInterruptions.push(state.shift);
  }
  closePanel();
  update("accepted");
}
function boil(potIndex) {
  const order = activeOrder("accepted");
  if (!order || state.pots[potIndex]) return;
  order.status = "cooking";
  state.pots[potIndex] = { orderId: order.id, startedAt: Date.now() };
  update("pot", potIndex + 1);
}
function lift(potIndex) {
  const pot = state.pots[potIndex];
  if (!pot) return;
  const order = state.orders.find((item) => item.id === pot.orderId);
  order.cookScore = scoreDoneness((Date.now() - pot.startedAt) / 1000, order.doneness);
  order.status = "cooked";
  state.pots[potIndex] = null;
  closePanel();
  update("lifted", order.cookScore >= 70);
}
function plate(orderId) {
  const order = state.orders.find((item) => item.id === orderId && item.status === "cooked");
  if (!order) return;
  order.plateScore = scorePlate(order, state.plate.sauce, state.plate.topping);
  order.status = "ready";
  closePanel();
  update("plated", order.plateScore === 100, order.table);
}
async function visitTable(table) {
  if (!await walkTo(String(table))) return;
  const ready = state.orders.find((order) => order.status === "ready" && order.table === table);
  if (ready) {
    state = completeDelivery(state, ready.id);
    update("delivered", state.shift === SHIFTS.length && state.completed === SHIFTS.length);
    return;
  }
  const task = state.floorTasks.find((item) => item.table === table);
  if (task) {
    await completeTask(task.id);
    return;
  }
  update("noTask", table);
}
async function completeTask(id) {
  const task = state.floorTasks.find((item) => item.id === id);
  if (!task) return;
  const actor = $("[data-rookie]");
  actor.classList.add("wiping");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) await new Promise((resolve) => setTimeout(resolve, 900));
  actor.classList.remove("wiping");
  state.floorTasks = state.floorTasks.filter((item) => item.id !== id);
  state.reputation = Math.min(100, state.reputation + 1);
  update("taskDone", task.table, taskName(task.type));
}
function chooseInterruption(choice) {
  const event = INTERRUPTIONS[state.interruption];
  if (!event) return;
  if (choice === "switch") {
    state.floorTasks.push({ ...event.task, id: `interrupt-${state.shift}` });
    messageKey = "switched";
    messageArgs = [taskName(event.task.type)];
  } else {
    state.reputation = Math.max(0, state.reputation - 1);
    messageKey = "accepted";
    messageArgs = [];
  }
  state.interruption = null;
  update();
}
function updateTimers() {
  state.pots.forEach((pot, index) => {
    const node = $(`[data-pot-time="${index}"]`);
    if (node && pot) node.textContent = `${((Date.now() - pot.startedAt) / 1000).toFixed(1)}s`;
  });
}

function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
    musicGain = audioContext.createGain();
    ambienceGain = audioContext.createGain();
    musicGain.connect(audioContext.destination);
    ambienceGain.connect(audioContext.destination);
    scheduleChord();
    musicTimer = setInterval(scheduleChord, 2400);
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * .16;
    ambienceSource = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 680;
    ambienceSource.buffer = buffer;
    ambienceSource.loop = true;
    ambienceSource.connect(filter).connect(ambienceGain);
    ambienceSource.start();
  }
  audioContext.resume();
  syncAudio();
}
function scheduleChord() {
  if (!audioContext) return;
  const chords = [[220, 261.63, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [196, 246.94, 329.63]];
  const chord = chords[Math.floor(audioContext.currentTime / 2.4) % chords.length];
  chord.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.value = frequency * (index === 2 ? 2 : 1);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(.055, audioContext.currentTime + .05);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + 2.1);
    oscillator.connect(gain).connect(musicGain);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2.2);
  });
}
function syncAudio() {
  if (!audioContext) return;
  musicGain.gain.setTargetAtTime(settings.music ? .07 : 0, audioContext.currentTime, .08);
  ambienceGain.gain.setTargetAtTime(settings.ambience ? .04 : 0, audioContext.currentTime, .08);
}
function toggleSound(kind) {
  settings[kind] = !settings[kind];
  saveSettings();
  ensureAudio();
  render();
}

function start(nextState, key) {
  state = nextState;
  messageKey = key;
  messageArgs = [];
  $("[data-intro]").hidden = true;
  $("[data-play]").hidden = false;
  ensureAudio();
  update();
  startCoworkerPatrol();
}

$("[data-start]").addEventListener("click", () => {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  start(freshState(), "first");
});
$("[data-continue]").addEventListener("click", () => start(load() || freshState(), "loaded"));
$("[data-language]").addEventListener("click", () => {
  settings.locale = settings.locale === "zh" ? "en" : "zh";
  saveSettings();
  render();
});
$("[data-music]").addEventListener("click", () => toggleSound("music"));
$("[data-ambience]").addEventListener("click", () => toggleSound("ambience"));
$("[data-close-panel]").addEventListener("click", closePanel);
$("[data-game]").addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target || target.hasAttribute("disabled")) return;
  if (target.dataset.destination) openDestination(target.dataset.destination);
  if (target.dataset.table) visitTable(Number(target.dataset.table));
  if (target.dataset.action === "accept") accept(Number(target.dataset.order));
  if (target.dataset.action === "boil") boil(Number(target.dataset.pot));
  if (target.dataset.action === "lift") lift(Number(target.dataset.pot));
  if (target.dataset.action === "plate") plate(Number(target.dataset.order));
  if (target.dataset.plateOption) { state.plate[target.dataset.plateOption] = target.dataset.value; update(); }
  if (target.dataset.interruptChoice) chooseInterruption(target.dataset.interruptChoice);
});
addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
});
setInterval(updateTimers, 100);

$("[data-continue]").hidden = !load();
applyLanguage();
render();
