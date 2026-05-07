const translations = {
  zh: {
    navToday: "5 分鐘紀錄",
    navRoute: "日常分流",
    navReview: "每週回顧",
    navSync: "雲端同步",
    dailyPrincipleTitle: "今日原則",
    dailyPrincipleText: "讓思緒不混亂，讓生活可被看見。<br>每天留下一點可回收的痕跡，<br>讓日常累積成長的軌跡。",
    heroEyebrow: "每天只要留下一點可回收的東西",
    heroTitle: "讓日常成為可以回看的成長軌跡",
    todayStep1: "Step 1",
    todayChooseTitle: "今天只選一個成長痕跡",
    todayStep2: "Step 2",
    todayWriteTitle: "寫 100 字以內就好",
    dailyNoteLabel: "今天最值得留下來的是什麼？",
    dailyPlaceholder: "例如：今天讀 NRP-1 相關 paper 時，我第一次把作者的結果和自己的 SJF 假說分開看，這讓我比較清楚下一步該問什麼。",
    saveDaily: "儲存今日痕跡",
    clear: "清空",
    weekTemp: "這週的五個面向",
    routerTitle: "這則資訊現在是什麼狀態？",
    routePlaceLabel: "放這裡",
    routeAvoidLabel: "不要放",
    routeNextLabel: "下一步",
    flowTitle: "三條主要資料流",
    weeklyReviewTitle: "用五個面向，回看這一週的自己。",
    recentTraces: "最近留下的痕跡",
    exportMarkdown: "匯出 Markdown",
    exportJson: "備份 JSON",
    importJson: "匯入 JSON",
    resetData: "清除本機紀錄",
    localSyncHint: "登入 Supabase 後，Mac / iPhone / iPad 會自動合併同步；JSON 備份保留作為手動保險。",
    syncSetupTitle: "讓 iPhone / iPad / Mac 同步",
    projectUrl: "Project URL",
    anonKey: "Anon public key",
    saveConfig: "儲存設定",
    resetConfig: "回復預設",
    magicLinkTitle: "用 Email magic link 登入",
    sendMagicLink: "寄登入連結",
    signOut: "登出",
    syncStatusTitle: "同步狀態",
    syncNow: "立即同步",
    unsaved: "還沒儲存今天的痕跡。",
    saved: "已儲存。今天有留下可回收的東西。",
    emptyNote: "先寫一句也可以，空白不會儲存。",
    cleared: "已清空輸入框，尚未改動已儲存紀錄。",
    existingToday: "今天已經有一筆痕跡，可以修改後重新儲存。",
    noEntries: "還沒有紀錄。先從「5 分鐘紀錄」留下一句開始。",
    routeTitleDefault: "先選一種資訊狀態",
    routeSummaryDefault: "我會告訴你它該放哪裡、不要混進什麼、下一步做什麼。",
    notSelected: "尚未選擇"
  },
  en: {
    navToday: "5-min log",
    navRoute: "Daily routing",
    navReview: "Weekly review",
    navSync: "Cloud sync",
    dailyPrincipleTitle: "Daily Principle",
    dailyPrincipleText: "Keep thoughts untangled, and let life be seen.<br>Leave one reusable trace each day,<br>so daily life becomes a visible growth path.",
    heroEyebrow: "One reusable trace a day",
    heroTitle: "Turn daily life into a visible path of growth",
    todayStep1: "Step 1",
    todayChooseTitle: "Choose one trace for today",
    todayStep2: "Step 2",
    todayWriteTitle: "Keep it under 100 words",
    dailyNoteLabel: "What is worth keeping from today?",
    dailyPlaceholder: "Example: While reading an NRP-1 paper today, I separated the authors' findings from my own SJF hypothesis for the first time.",
    saveDaily: "Save today's trace",
    clear: "Clear",
    weekTemp: "This week's five dimensions",
    routerTitle: "What state is this information in right now?",
    routePlaceLabel: "Put it here",
    routeAvoidLabel: "Do not put",
    routeNextLabel: "Next step",
    flowTitle: "Three main flows",
    weeklyReviewTitle: "Weekly Review: look back at yourself through five dimensions.",
    recentTraces: "Recent traces",
    exportMarkdown: "Export Markdown",
    exportJson: "Backup JSON",
    importJson: "Import JSON",
    resetData: "Clear local records",
    localSyncHint: "After Supabase sign-in, Mac / iPhone / iPad merge automatically. JSON backup stays as a manual safety net.",
    syncSetupTitle: "Sync iPhone / iPad / Mac",
    projectUrl: "Project URL",
    anonKey: "Anon public key",
    saveConfig: "Save settings",
    resetConfig: "Restore default",
    magicLinkTitle: "Sign in with Email magic link",
    sendMagicLink: "Send sign-in link",
    signOut: "Sign out",
    syncStatusTitle: "Sync status",
    syncNow: "Sync now",
    unsaved: "Today's trace has not been saved yet.",
    saved: "Saved. You left something reusable today.",
    emptyNote: "One sentence is enough. Blank notes will not be saved.",
    cleared: "Input cleared. Saved records were not changed.",
    existingToday: "You already have a trace today. Edit and save again if needed.",
    noEntries: "No records yet. Start with one sentence in 5-min log.",
    routeTitleDefault: "Choose an information state",
    routeSummaryDefault: "I will show where it belongs, what not to mix in, and the next step.",
    notSelected: "Not selected"
  }
};

const pillars = [
  {
    id: "knowledge",
    color: "#5577b9",
    name: { zh: "知識體系", en: "Knowledge system" },
    copy: { zh: "今天有沒有一個概念、paper 或觀點變清楚？", en: "Did one concept, paper, or viewpoint become clearer today?" },
    prompt: { zh: "這週我新增了哪 3 張知識卡？", en: "Which three knowledge cards did I add this week?" }
  },
  {
    id: "expression",
    color: "#c96f5b",
    name: { zh: "有力量的表達", en: "Powerful expression" },
    copy: { zh: "今天有沒有一次把想法說得更清楚？", en: "Did I express one thought more clearly today?" },
    prompt: { zh: "這週哪一次表達比以前更清楚？", en: "When did I express myself more clearly this week?" }
  },
  {
    id: "aesthetic",
    color: "#c49a45",
    name: { zh: "審美辨識", en: "Aesthetic awareness" },
    copy: { zh: "今天看見了什麼好的圖、簡報、排版或畫面？", en: "What image, slide, layout, or scene looked good today?" },
    prompt: { zh: "這週看見了什麼美的東西？", en: "What beauty did I notice this week?" }
  },
  {
    id: "solitude",
    color: "#4f8a73",
    name: { zh: "深度愛好", en: "Deep solitude" },
    copy: { zh: "今天有沒有一段不被外界推著走的安靜時間？", en: "Did I have a quiet moment not pushed by the outside world?" },
    prompt: { zh: "這週有沒有一段真正安靜、專注、只屬於自己的時間？", en: "Did I have a truly quiet, focused time for myself this week?" }
  },
  {
    id: "emotion",
    color: "#7b6598",
    name: { zh: "情緒覺察", en: "Emotional awareness" },
    copy: { zh: "今天哪個情緒最強烈？它想提醒你什麼？", en: "Which emotion was strongest today, and what did it remind me of?" },
    prompt: { zh: "這週最常出現的情緒是什麼？它想提醒我什麼？", en: "Which emotion appeared most often this week, and what was it telling me?" }
  }
];

const routePillarMap = {
  "paper-source": "knowledge",
  "author-content": "knowledge",
  "pre-meeting": null,
  "experiment-raw": "knowledge",
  "my-thinking": "knowledge",
  "stable-knowledge": "knowledge",
  "research-decision": "knowledge",
  "task": null,
  "data-file": "knowledge"
};

const routes = [
  {
    id: "paper-source",
    label: "原始 paper / citation",
    place: "Zotero",
    summary: "它還是原始文獻來源，先不要混進自己的想法。",
    avoid: "不要寫 interpretation、實驗決策、跟 project 的關聯。",
    next: "確認 PDF、DOI / PMID、citation、metadata 是否完整。"
  },
  {
    id: "author-content",
    label: "作者真正說了什麼",
    place: "Obsidian Red",
    summary: "只記 paper 裡作者的內容，不加入你的推論。",
    avoid: "不要寫「我覺得」「這可能代表」「下一步要做」。",
    next: "整理 research question、methods、key results、authors' conclusion、limitations。"
  },
  {
    id: "pre-meeting",
    label: "會前 / 任務前快速抓住",
    place: "A6",
    summary: "它還沒正式進入任務，但需要先抓住，避免 meeting 前後消失。",
    avoid: "不要寫正式實驗紀錄、完整 interpretation 或最終決策。",
    next: "討論後分流到 A5 左右翻、Green 或 Notion。"
  },
  {
    id: "experiment-raw",
    label: "實驗當下發生什麼",
    place: "A5 上翻",
    summary: "這是 raw record，只記今天實驗真實發生的事。",
    avoid: "不要寫 hypothesis、為什麼會這樣、下一步決策。",
    next: "記 condition、concentration、time point、步驟、觀察、異常、Finder 位置。"
  },
  {
    id: "my-thinking",
    label: "我的理解 / 懷疑 / 推論",
    place: "A5 左右翻",
    summary: "所有「我覺得、可能、懷疑、也許」先放這裡。",
    avoid: "不要混進 paper 客觀摘要、raw lab note 或已決定的計畫。",
    next: "寫 interpretation、hypothesis、mechanism、pathway，再判斷是否成熟到 Blue 或 Green。"
  },
  {
    id: "stable-knowledge",
    label: "穩定、通用知識",
    place: "Obsidian Blue",
    summary: "它已經想清楚，且可跨 project 重複使用。",
    avoid: "不要收單篇靈感、未驗證推論、只服務目前 project 的決策。",
    next: "整理成 concept definition、stable mechanism、pathway explanation。"
  },
  {
    id: "research-decision",
    label: "下一步研究決策",
    place: "Obsidian Green",
    summary: "它必須基於你的 evidence，並會影響下一步實驗。",
    avoid: "不要放單純 paper summary、教科書知識、raw note。",
    next: "寫 current evidence、working model、critical readouts、decision criteria、next experiment。"
  },
  {
    id: "task",
    label: "任務 / deadline / status",
    place: "Notion",
    summary: "它是要做什麼、何時做、做到哪裡。",
    avoid: "不要存 paper 內容、機制知識、interpretation、raw data。",
    next: "轉成 task、deadline、status、next action、project progress。"
  },
  {
    id: "data-file",
    label: "raw data / image / analysis",
    place: "Finder",
    summary: "它是檔案與數據的位置，不是想法的位置。",
    avoid: "不要放 interpretation、hypothesis、research decision、paper notes。",
    next: "存 raw data、images、WB、flow、proteomics、analysis output、figures，並在 A5 上翻記錄路徑。"
  }
];

const legacyStorageKey = "growth-compass-v1";
const storageKey = "growth-compass-v2";
const supabaseConfigKey = "growth-compass-supabase-v1";
const languageKey = "growth-compass-language";
const themeKey = "growth-compass-theme";
const appDataVersion = 2;
const defaultSupabaseConfig = {
  url: "https://rmkqvximjjawadvkwviv.supabase.co",
  anonKey: "sb_publishable_7mTarvg832jBS6CeEBaXBA_b_O8smld"
};
let selectedPillar = pillars[0].id;
let appData = loadAppData();
let entries = appData.dailyEntries;
let supabaseClient = null;
let syncState = "offline";   // offline | connecting | syncing | ok | error
let lastSyncAt = localStorage.getItem("growth-compass-last-sync") || null;

function setSyncState(state) {
  syncState = state;
  renderSyncBadge();
}

function renderSyncBadge() {
  // Update nav tab cloud icon
  const navTab = document.querySelector('.nav-tab[data-view="sync"]');
  if (navTab) {
    const icon = navTab.querySelector(".nav-icon");
    if (icon) {
      const map = { offline: "雲", connecting: "雲", syncing: "↻", ok: "雲", error: "雲" };
      icon.textContent = map[syncState] || "雲";
      icon.className = `nav-icon sync-badge-${syncState}`;
    }
  }
  // Update sidebar status cloud dot
  const el = document.getElementById("sidebarStatus");
  if (!el) return;
  renderSidebarStatus();
}
let currentUser = null;
let currentLang = localStorage.getItem(languageKey) || "zh";
let currentTheme = localStorage.getItem(themeKey) || "light";

function createId(prefix) {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createEmptyAppData() {
  return {
    version: appDataVersion,
    dailyEntries: [],
    flowItems: [],
    weeklyReviews: [],
    traceCards: []
  };
}

function loadAppData() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return normalizeAppData(JSON.parse(stored));
    const legacy = localStorage.getItem(legacyStorageKey);
    if (legacy) {
      const migrated = normalizeAppData({ dailyEntries: JSON.parse(legacy) });
      saveAppData(migrated);
      return migrated;
    }
  } catch {
    return createEmptyAppData();
  }
  return createEmptyAppData();
}

function normalizeAppData(raw) {
  const data = createEmptyAppData();
  const dailyEntries = Array.isArray(raw) ? raw : raw?.dailyEntries;
  data.dailyEntries = (dailyEntries || [])
    .map(normalizeDailyEntry)
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date));
  data.flowItems = (raw?.flowItems || []).map(normalizeFlowItem).filter(Boolean);
  data.weeklyReviews = (raw?.weeklyReviews || []).map(normalizeWeeklyReview).filter(Boolean);
  data.traceCards = (raw?.traceCards || []).map(normalizeTraceCard).filter(Boolean);
  return data;
}

function normalizeTraceCard(card) {
  if (!card?.date || !card?.pillar) return null;
  return {
    id: card.id || `card-${card.date}-${card.pillar}`,
    date: card.date,
    pillar: card.pillar,
    color: card.color || "#5577b9",
    text: card.text || "",
    special: card.special || false,
    createdAt: card.createdAt || new Date().toISOString()
  };
}

function normalizeDailyEntry(entry) {
  if (!entry?.date) return null;
  const timestamp = entry.updatedAt || entry.createdAt || new Date().toISOString();
  const reusableTrace = entry.reusableTrace || entry.note || "";
  if (!reusableTrace.trim()) return null;
  return {
    id: entry.id || `daily-${entry.date}`,
    type: "DailyEntry",
    date: entry.date,
    pillar: entry.pillar || entry.state || "knowledge",
    state: entry.state || entry.pillar || "knowledge",
    mood: entry.mood || "",
    keyEvent: entry.keyEvent || "",
    reusableTrace,
    nextSmallStep: entry.nextSmallStep || "",
    note: reusableTrace,
    createdAt: entry.createdAt || timestamp,
    updatedAt: timestamp
  };
}

function normalizeFlowItem(item) {
  if (!item?.content) return null;
  const timestamp = item.updatedAt || item.createdAt || new Date().toISOString();
  return {
    id: item.id || createId("flow"),
    type: "FlowItem",
    createdAt: item.createdAt || timestamp,
    updatedAt: timestamp,
    content: item.content,
    category: item.category || "",
    status: item.status || "open",
    linkedDate: item.linkedDate || ""
  };
}

function normalizeWeeklyReview(review) {
  if (!review?.weekStartDate || !review?.pillar) return null;
  const timestamp = review.updatedAt || review.createdAt || new Date().toISOString();
  return {
    id: review.id || `weekly-${review.weekStartDate}-${review.pillar}`,
    type: "WeeklyReview",
    weekStartDate: review.weekStartDate,
    pillar: review.pillar,
    content: review.content || "",
    createdAt: review.createdAt || timestamp,
    updatedAt: timestamp
  };
}

function saveAppData(nextData = appData) {
  nextData.version = appDataVersion;
  localStorage.setItem(storageKey, JSON.stringify(nextData));
}

function saveEntries() {
  appData.dailyEntries = entries;
  saveAppData();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate() {
  const date = new Date();
  const locale = currentLang === "zh" ? "zh-Hant" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function init() {
  document.getElementById("todayLabel").textContent = formatDate();
  renderTheme();
  renderLanguage();
  renderTabs();
  renderPillars();
  renderRouter();
  backfillCards();
  renderGarden();
  renderSidebarStatus();
  renderReview();
  restoreToday();

  document.getElementById("saveDaily").addEventListener("click", saveDaily);
  document.getElementById("clearDaily").addEventListener("click", clearDaily);
  document.getElementById("exportMarkdown").addEventListener("click", exportMarkdown);
  document.getElementById("exportJson").addEventListener("click", exportJson);
  document.getElementById("importJson").addEventListener("change", importJson);
  document.getElementById("resetData").addEventListener("click", resetData);
  document.getElementById("toggleAdvanced").addEventListener("click", toggleAdvancedSync);
  document.getElementById("saveSupabaseConfig").addEventListener("click", saveSupabaseConfig);
  document.getElementById("clearSupabaseConfig").addEventListener("click", clearSupabaseConfig);
  document.getElementById("sendMagicLink").addEventListener("click", sendMagicLink);
  document.getElementById("signOut").addEventListener("click", signOut);
  document.getElementById("syncNow").addEventListener("click", syncNow);
  document.querySelector(".theme-toggle").addEventListener("click", changeTheme);
  window.addEventListener("online", () => {
    if (currentUser) syncNow();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && currentUser) syncNow();
  });
  initSupabaseFromStorage();
}

function renderTheme() {
  document.documentElement.dataset.theme = currentTheme;
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === currentTheme);
  });
}

function changeTheme(event) {
  const button = event.target.closest(".theme-btn");
  if (!button) return;
  currentTheme = button.dataset.themeChoice;
  localStorage.setItem(themeKey, currentTheme);
  renderTheme();
}

function t(key) {
  return translations[currentLang][key] || translations.zh[key] || key;
}

function localize(value) {
  if (typeof value === "string") return value;
  return value[currentLang] || value.zh || "";
}

function renderLanguage() {
  document.documentElement.lang = currentLang === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18n);
  });
  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
    button.addEventListener("click", () => {
      currentLang = button.dataset.lang;
      localStorage.setItem(languageKey, currentLang);
      renderLanguage();
      document.getElementById("todayLabel").textContent = formatDate();
      renderPillars();
      renderRouter();
      renderGarden();
      renderReview();
      restoreToday();
    }, { once: true });
  });
  document.getElementById("dailyNote").placeholder = t("dailyPlaceholder");
}

function renderTabs() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.view).classList.add("active");
    });
  });
}

function renderPillars() {
  const grid = document.getElementById("pillarGrid");
  grid.innerHTML = "";
  pillars.forEach((pillar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pillar-card ${pillar.id === selectedPillar ? "active" : ""}`;
    button.innerHTML = `
      <span class="color-dot" style="background:${pillar.color}"></span>
      <span>
        <span class="card-title">${localize(pillar.name)}</span>
        <span class="card-copy">${localize(pillar.copy)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      selectedPillar = pillar.id;
      renderPillars();
      restoreForPillar(pillar.id);
    });
    grid.appendChild(button);
  });
  renderTodayFocus();
}

function renderSidebarStatus() {
  const el = document.getElementById("sidebarStatus");
  if (!el) return;
  const today = todayKey();
  const streak = getStreakDays();
  const dots = pillars.map((p) => {
    const logged = entries.some((e) => e.pillar === p.id && e.date === today);
    return `<span class="ss-dot ${logged ? "filled" : ""}" style="${logged ? "--dot:" + p.color : ""}" title="${localize(p.name)}"></span>`;
  }).join("");
  const streakHtml = streak > 0 ? `<span class="ss-streak">🔥 ${streak}</span>` : "";
  const cloudTitle = {
    offline: currentLang === "zh" ? "未連線" : "Offline",
    connecting: currentLang === "zh" ? "連線中…" : "Connecting…",
    syncing: currentLang === "zh" ? "同步中…" : "Syncing…",
    ok: lastSyncAt
      ? (currentLang === "zh" ? `上次同步 ${lastSyncAt}` : `Last sync ${lastSyncAt}`)
      : (currentLang === "zh" ? "已同步" : "Synced"),
    error: currentLang === "zh" ? "同步失敗" : "Sync error"
  }[syncState] || "";
  el.innerHTML = `
    <div class="ss-row">
      ${dots}${streakHtml}
      <span class="ss-cloud sync-badge-${syncState}" title="${cloudTitle}">
        ${syncState === "syncing" ? "↻" : "☁"}
      </span>
    </div>`;
}

function renderTodayFocus() {
  const pillar = pillars.find((item) => item.id === selectedPillar) || pillars[0];
  const label = currentLang === "zh" ? "今日提示" : "Today's prompt";
  const past = entries
    .filter((e) => e.pillar === pillar.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const lastEntry = past[0];
  const lastHtml = lastEntry
    ? (() => {
        const preview = (lastEntry.reusableTrace || lastEntry.note || "").slice(0, 72);
        const ellipsis = (lastEntry.reusableTrace || lastEntry.note || "").length > 72 ? "…" : "";
        const ago = currentLang === "zh" ? "上次你寫" : "Last trace";
        return `<p class="focus-last">${ago} · ${lastEntry.date}<br><em>${preview}${ellipsis}</em></p>`;
      })()
    : "";
  document.getElementById("todayFocus").innerHTML = `
    <p>${label}</p>
    <strong>${localize(pillar.copy)}</strong>
    ${lastHtml}
  `;
}

function renderRoutePillars(routeId) {
  const container = document.getElementById("routeToToday");
  const grid = document.getElementById("routePillars");
  if (!container || !grid) return;
  container.style.display = "block";
  grid.innerHTML = "";
  pillars.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `route-pillar-btn${routePillarMap[routeId] === p.id ? " suggested" : ""}`;
    btn.style.setProperty("--pcolor", p.color);
    btn.innerHTML = `<span class="rp-dot" style="background:${p.color}"></span>${localize(p.name)}`;
    btn.addEventListener("click", () => {
      selectedPillar = p.id;
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      document.querySelector('.nav-tab[data-view="today"]').classList.add("active");
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById("today").classList.add("active");
      renderPillars();
      document.getElementById("dailyNote").focus();
    });
    grid.appendChild(btn);
  });
}

function renderRouter() {
  const options = document.getElementById("routerOptions");
  options.innerHTML = "";
  routes.forEach((route, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `router-card ${index === 0 ? "active" : ""}`;
    button.innerHTML = `
      <span class="color-dot" style="background:${pillars[index % pillars.length].color}"></span>
      <span>
        <span class="card-title">${route.label}</span>
        <span class="card-copy">${route.summary}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      document.querySelectorAll(".router-card").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      setRoute(route);
    });
    options.appendChild(button);
  });
  setRoute(routes[0]);
}

function setRoute(route) {
  renderRoutePillars(route.id);
  document.getElementById("routeTitle").textContent = route.place;
  document.getElementById("routeSummary").textContent = route.summary;
  document.getElementById("routePlace").textContent = route.place;
  document.getElementById("routeAvoid").textContent = route.avoid;
  document.getElementById("routeNext").textContent = route.next;
}

function restoreForPillar(pillarId) {
  const existing = entries.find((e) => e.date === todayKey() && e.pillar === pillarId);
  const note = document.getElementById("dailyNote");
  const status = document.getElementById("dailyStatus");
  if (!existing) { note.value = ""; status.textContent = t("unsaved"); return; }
  note.value = existing.reusableTrace || existing.note || "";
  status.textContent = t("existingToday");
}

function restoreToday() {
  restoreForPillar(selectedPillar);
}

function saveDaily() {
  const note = document.getElementById("dailyNote").value.trim();
  if (!note) {
    document.getElementById("dailyStatus").textContent = t("emptyNote");
    return;
  }

  const entry = {
    id: existingDailyId(todayKey(), selectedPillar),
    type: "DailyEntry",
    date: todayKey(),
    pillar: selectedPillar,
    state: selectedPillar,
    mood: "",
    keyEvent: "",
    reusableTrace: note,
    nextSmallStep: "",
    note,
    createdAt: existingDailyCreatedAt(todayKey(), selectedPillar),
    updatedAt: new Date().toISOString()
  };

  entries = entries.filter((item) => !(item.date === entry.date && item.pillar === entry.pillar));
  entries.unshift(entry);
  saveEntries();
  const statusEl = document.getElementById("dailyStatus");
  statusEl.textContent = t("saved");
  statusEl.classList.add("status-saved");
  setTimeout(() => statusEl.classList.remove("status-saved"), 1800);
  generateCard(entry);
  renderGarden(entry.pillar);
  renderSidebarStatus();
  renderReview();
  showSavedPulse();
  syncEntry(entry);
}

function existingDailyId(date, pillar) {
  const existing = entries.find((e) => e.date === date && e.pillar === pillar);
  return existing?.id || `daily-${date}-${pillar}`;
}

function existingDailyCreatedAt(date, pillar) {
  const existing = entries.find((e) => e.date === date && e.pillar === pillar);
  return existing?.createdAt || new Date().toISOString();
}

function clearDaily() {
  document.getElementById("dailyNote").value = "";
  document.getElementById("dailyStatus").textContent = t("cleared");
}

function getPillarStage(pillarId) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const count = entries.filter((e) => e.pillar === pillarId && e.date >= cutoffKey).length;
  return Math.min(count, 4);
}

function plantSVG(stage, color) {
  const c = color;
  const s = [
    // 0: seed
    `<ellipse cx="40" cy="87" rx="24" ry="7" fill="${c}" opacity="0.14"/>
     <ellipse cx="40" cy="82" rx="6" ry="4.5" fill="${c}" opacity="0.42"/>
     <ellipse cx="40" cy="79" rx="3" ry="2" fill="${c}" opacity="0.6"/>`,
    // 1: sprout
    `<ellipse cx="40" cy="90" rx="24" ry="6" fill="${c}" opacity="0.12"/>
     <path d="M40 90 C40 80 40 72 40 66" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     <path d="M40 77 C36 73 30 73 27 71" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="24" cy="70" rx="7" ry="4" fill="${c}" opacity="0.6" transform="rotate(-20 24 70)"/>
     <path d="M40 75 C44 71 50 71 53 69" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="56" cy="68" rx="7" ry="4" fill="${c}" opacity="0.6" transform="rotate(20 56 68)"/>`,
    // 2: small plant
    `<ellipse cx="40" cy="91" rx="24" ry="6" fill="${c}" opacity="0.12"/>
     <path d="M40 91 C39 78 40 65 40 52" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     <path d="M40 84 C35 79 26 79 23 77" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="20" cy="76" rx="9" ry="5" fill="${c}" opacity="0.52" transform="rotate(-25 20 76)"/>
     <path d="M40 82 C45 77 54 77 57 75" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="60" cy="74" rx="9" ry="5" fill="${c}" opacity="0.52" transform="rotate(25 60 74)"/>
     <path d="M40 69 C35 64 27 64 24 62" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="21" cy="61" rx="9" ry="4.5" fill="${c}" opacity="0.64" transform="rotate(-20 21 61)"/>
     <path d="M40 67 C45 62 53 62 56 60" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="59" cy="59" rx="9" ry="4.5" fill="${c}" opacity="0.64" transform="rotate(20 59 59)"/>`,
    // 3: growing
    `<ellipse cx="40" cy="92" rx="24" ry="5.5" fill="${c}" opacity="0.11"/>
     <path d="M40 92 C38 74 40 54 40 36" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     <path d="M40 86 C33 80 23 80 19 78" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="16" cy="77" rx="11" ry="5.5" fill="${c}" opacity="0.46" transform="rotate(-30 16 77)"/>
     <path d="M40 84 C47 78 57 78 61 76" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="64" cy="75" rx="11" ry="5.5" fill="${c}" opacity="0.46" transform="rotate(30 64 75)"/>
     <path d="M40 73 C33 67 23 67 19 65" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="16" cy="64" rx="10" ry="5" fill="${c}" opacity="0.57" transform="rotate(-25 16 64)"/>
     <path d="M40 71 C47 65 57 65 61 63" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="64" cy="62" rx="10" ry="5" fill="${c}" opacity="0.57" transform="rotate(25 64 62)"/>
     <path d="M40 58 C34 52 26 52 22 50" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="19" cy="49" rx="9" ry="4.5" fill="${c}" opacity="0.68" transform="rotate(-20 19 49)"/>
     <path d="M40 56 C46 50 54 50 58 48" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="61" cy="47" rx="9" ry="4.5" fill="${c}" opacity="0.68" transform="rotate(20 61 47)"/>`,
    // 4: full bloom
    `<ellipse cx="40" cy="93" rx="24" ry="5" fill="${c}" opacity="0.11"/>
     <path d="M40 93 C38 72 40 50 40 28" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
     <path d="M40 86 C32 79 21 79 17 77" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="13" cy="76" rx="12" ry="5.5" fill="${c}" opacity="0.42" transform="rotate(-32 13 76)"/>
     <path d="M40 84 C48 77 59 77 63 75" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="67" cy="74" rx="12" ry="5.5" fill="${c}" opacity="0.42" transform="rotate(32 67 74)"/>
     <path d="M40 73 C32 66 21 66 17 64" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="13" cy="63" rx="11" ry="5" fill="${c}" opacity="0.53" transform="rotate(-27 13 63)"/>
     <path d="M40 71 C48 64 59 64 63 62" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="67" cy="61" rx="11" ry="5" fill="${c}" opacity="0.53" transform="rotate(27 67 61)"/>
     <path d="M40 60 C33 53 23 53 19 51" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="16" cy="50" rx="10" ry="4.5" fill="${c}" opacity="0.63" transform="rotate(-22 16 50)"/>
     <path d="M40 58 C47 51 57 51 61 49" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <ellipse cx="64" cy="48" rx="10" ry="4.5" fill="${c}" opacity="0.63" transform="rotate(22 64 48)"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5" transform="rotate(60 40 27)"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5" transform="rotate(120 40 27)"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5" transform="rotate(180 40 27)"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5" transform="rotate(240 40 27)"/>
     <ellipse cx="40" cy="17" rx="5" ry="9" fill="${c}" opacity="0.5" transform="rotate(300 40 27)"/>
     <circle cx="40" cy="27" r="8" fill="${c}"/>
     <circle cx="40" cy="27" r="4.5" fill="white" opacity="0.52"/>`
  ];
  return `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s[Math.min(stage, 4)]}</svg>`;
}

function getWeekStart(date) {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

function saveWeeklyReview(pillarId, content) {
  const weekStart = getWeekStart();
  const id = `weekly-${weekStart}-${pillarId}`;
  const idx = appData.weeklyReviews.findIndex((r) => r.id === id);
  const review = {
    id,
    weekStartDate: weekStart,
    pillar: pillarId,
    content,
    createdAt: idx >= 0 ? appData.weeklyReviews[idx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) appData.weeklyReviews[idx] = review;
  else appData.weeklyReviews.push(review);
  saveEntries();
}

function getStreakDays() {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((e) => e.date));
  const today = todayKey();
  const cursor = new Date();
  if (!dates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  let streak = 0;
  const check = new Date();
  if (!dates.has(today)) check.setDate(check.getDate() - 1);
  while (true) {
    const key = check.toISOString().slice(0, 10);
    if (dates.has(key)) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }
  return streak;
}

function renderGarden(justGrownPillar = null) {
  const garden = document.getElementById("garden");
  if (!garden) return;
  garden.innerHTML = "";
  if (!justGrownPillar) {
    garden.classList.add("fresh-load");
    setTimeout(() => garden.classList.remove("fresh-load"), 2400);
  }
  const today = todayKey();
  const recent = getRecentEntries(7);
  const stageLabels = { zh: ["種子", "嫩芽", "成長", "茂盛", "盛開"], en: ["Seed", "Sprout", "Growing", "Thriving", "Blooming"] };

  renderWeekSummary(recent);

  pillars.forEach((pillar) => {
    const stage = getPillarStage(pillar.id);
    const hasToday = entries.some((e) => e.pillar === pillar.id && e.date === today);
    const isJustGrew = pillar.id === justGrownPillar;

    const item = document.createElement("div");
    item.className = `garden-plant${hasToday ? " today" : ""}${isJustGrew ? " just-grew" : ""}`;
    if (hasToday) item.style.setProperty("--plant-color", pillar.color);
    item.innerHTML = `
      <div class="plant-svg-wrap">${plantSVG(stage, pillar.color)}</div>
      <div class="plant-info">
        <span class="plant-name">${localize(pillar.name)}</span>
        <span class="plant-stage" style="color:${pillar.color}">${(stageLabels[currentLang] || stageLabels.zh)[stage]}</span>
      </div>
    `;
    garden.appendChild(item);
  });

  if (justGrownPillar) {
    setTimeout(() => {
      const grewEl = garden.querySelector(".just-grew");
      if (grewEl) grewEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);
  }

  renderCards();
}

function renderWeekSummary(recent) {
  const completed = pillars.filter((p) => recent.some((e) => e.pillar === p.id)).length;
  const total = pillars.length;
  const streak = getStreakDays();
  const message = completed === total
    ? (currentLang === "zh" ? "本週五個面向都被看見了。" : "All five dimensions traced this week.")
    : (currentLang === "zh" ? "本週已留下可回收的成長痕跡。" : "Reusable traces saved this week.");
  const streakHtml = streak > 0
    ? `<div class="streak-badge"><span class="streak-fire">🔥</span><strong>${streak}</strong><small>${currentLang === "zh" ? "天連勝" : "day streak"}</small></div>`
    : "";
  document.getElementById("weekSummary").innerHTML = `
    <div class="ws-left">
      <strong>${completed}/${total}</strong>
      <span>${message}</span>
    </div>
    <div class="ws-right">
      ${streakHtml}
      <div class="summary-dots" aria-label="weekly pillar completion">
        ${pillars.map((p) => `<span class="${recent.some((e) => e.pillar === p.id) ? "filled" : ""}" style="--dot:${p.color}"></span>`).join("")}
      </div>
    </div>
  `;
}

function generateCard(entry) {
  const pillar = pillars.find((p) => p.id === entry.pillar) || pillars[0];
  const recent = getRecentEntries(7);
  const uniquePillars = new Set(recent.map((e) => e.pillar));
  const isSpecial = pillars.every((p) => uniquePillars.has(p.id));
  const cardId = `card-${entry.date}-${entry.pillar}`;
  const card = {
    id: cardId,
    date: entry.date,
    pillar: entry.pillar,
    color: pillar.color,
    text: (entry.reusableTrace || entry.note || "").slice(0, 80),
    special: isSpecial,
    createdAt: new Date().toISOString()
  };
  if (!appData.traceCards) appData.traceCards = [];
  appData.traceCards = appData.traceCards.filter((c) => c.id !== cardId);
  appData.traceCards.unshift(card);
  saveAppData();
}

function renderCards() {
  const scroll = document.getElementById("traceCardsScroll");
  const section = document.getElementById("traceCardsSection");
  if (!scroll || !section) return;
  const cards = appData.traceCards || [];
  if (cards.length === 0) { section.style.display = "none"; return; }
  section.style.display = "";
  scroll.innerHTML = "";
  cards.slice(0, 30).forEach((card, index) => {
    const pillar = pillars.find((p) => p.id === card.pillar) || pillars[0];
    const el = document.createElement("div");
    el.className = `trace-card${index === 0 ? " new" : ""}${card.special ? " special" : ""}`;
    el.innerHTML = `
      <div class="tc-bar" style="background:${card.color}"></div>
      <div class="tc-body">
        <span class="tc-pillar" style="color:${card.color}">${localize(pillar.name)}</span>
        <p class="tc-text">${card.text}</p>
        <span class="tc-date">${card.date}</span>
      </div>
      ${card.special ? '<div class="tc-special">✦ All five bloomed</div>' : ""}
    `;
    scroll.appendChild(el);
  });
}

function backfillCards() {
  if (!appData.traceCards) appData.traceCards = [];
  if (appData.traceCards.length > 0 || entries.length === 0) return;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach((entry) => {
    const cardId = `card-${entry.date}-${entry.pillar}`;
    if (appData.traceCards.some((c) => c.id === cardId)) return;
    const pillar = pillars.find((p) => p.id === entry.pillar) || pillars[0];
    appData.traceCards.push({
      id: cardId,
      date: entry.date,
      pillar: entry.pillar,
      color: pillar.color,
      text: (entry.reusableTrace || entry.note || "").slice(0, 80),
      special: false,
      createdAt: entry.updatedAt || new Date().toISOString()
    });
  });
  appData.traceCards.sort((a, b) => b.date.localeCompare(a.date));
  saveAppData();
}

function renderBars() { renderGarden(); }

function getRecentEntries(days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days + 1);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  return entries.filter((entry) => entry.date >= cutoffKey);
}

function renderReview() {
  const prompts = document.getElementById("reviewPrompts");
  prompts.innerHTML = "";
  const weekStart = getWeekStart();
  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 7);
  const lastWeekStart = getWeekStart(prevDate);

  pillars.forEach((pillar) => {
    const saved = appData.weeklyReviews.find((r) => r.weekStartDate === weekStart && r.pillar === pillar.id);
    const lastWeek = appData.weeklyReviews.find((r) => r.weekStartDate === lastWeekStart && r.pillar === pillar.id);
    const lastHint = lastWeek?.content
      ? `<p class="review-last">${currentLang === "zh" ? "上週" : "Last week"}: <em>${lastWeek.content.slice(0, 80)}${lastWeek.content.length > 80 ? "…" : ""}</em></p>`
      : "";
    const placeholder = currentLang === "zh" ? "這週的回顧…" : "This week's reflection…";
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <p class="entry-meta" style="color:${pillar.color}">${localize(pillar.name)}</p>
      <p class="prompt-text">${localize(pillar.prompt)}</p>
      ${lastHint}
      <textarea class="review-textarea" data-pillar="${pillar.id}" rows="3" placeholder="${placeholder}">${saved?.content || ""}</textarea>
    `;
    prompts.appendChild(card);
  });

  prompts.querySelectorAll(".review-textarea").forEach((ta) => {
    ta.addEventListener("input", () => saveWeeklyReview(ta.dataset.pillar, ta.value));
  });

  const entriesNode = document.getElementById("entries");
  entriesNode.innerHTML = "";
  if (entries.length === 0) {
    entriesNode.innerHTML = `<p class="helper">${t("noEntries")}</p>`;
    return;
  }

  entries.slice(0, 10).forEach((entry) => {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <p>${entry.reusableTrace || entry.note}</p>
      <span class="entry-meta">${entry.date} · ${localize(pillar.name)}</span>
    `;
    entriesNode.appendChild(card);
  });
}

function exportMarkdown() {
  if (entries.length === 0) {
    alert("目前沒有可匯出的紀錄。");
    return;
  }

  const lines = [
    `# 每日痕跡 Export`,
    ``,
    `匯出時間：${new Date().toLocaleString("zh-Hant")}`,
    ``
  ];

  entries.forEach((entry) => {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    lines.push(`## ${entry.date} · ${localize(pillar.name)}`, "", entry.reusableTrace || entry.note, "");
  });

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    alert("已複製 Markdown 到剪貼簿。");
  });
}

function exportJson() {
  const payload = {
    app: "每日痕跡",
    version: appDataVersion,
    exportedAt: new Date().toISOString(),
    entries,
    dailyEntries: entries,
    flowItems: appData.flowItems,
    weeklyReviews: appData.weeklyReviews
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `growth-compass-${todayKey()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      const incoming = Array.isArray(payload.dailyEntries) ? payload.dailyEntries : (payload.entries || []);
      const merged = new Map();

      [...entries, ...incoming].forEach((entry) => {
        const normalized = normalizeDailyEntry(entry);
        if (!normalized) return;
        const key = `${normalized.date}-${normalized.pillar}`;
        const current = merged.get(key);
        if (!current || (normalized.updatedAt || "") > (current.updatedAt || "")) {
          merged.set(key, normalized);
        }
      });

      entries = Array.from(merged.values()).sort((a, b) => b.date.localeCompare(a.date));
      appData.flowItems = mergeById(appData.flowItems, (payload.flowItems || []).map(normalizeFlowItem).filter(Boolean));
      appData.weeklyReviews = mergeById(appData.weeklyReviews, (payload.weeklyReviews || []).map(normalizeWeeklyReview).filter(Boolean));
      saveEntries();
      renderGarden();
      renderReview();
      restoreToday();
      syncNow();
      alert(`已匯入 ${incoming.length} 筆紀錄。`);
    } catch {
      alert("這個 JSON 檔案格式不對，沒有匯入。");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function mergeById(currentItems, incomingItems) {
  const merged = new Map();
  [...currentItems, ...incomingItems].forEach((item) => {
    if (!item?.id) return;
    const current = merged.get(item.id);
    if (!current || (item.updatedAt || "") > (current.updatedAt || "")) merged.set(item.id, item);
  });
  return Array.from(merged.values());
}

function loadSupabaseConfig() {
  try {
    return JSON.parse(localStorage.getItem(supabaseConfigKey)) || defaultSupabaseConfig;
  } catch {
    return defaultSupabaseConfig;
  }
}

function saveSupabaseConfig() {
  const url = document.getElementById("supabaseUrl").value.trim();
  const anonKey = document.getElementById("supabaseAnon").value.trim();
  if (!url || !anonKey) {
    setSyncConfigStatus("請填入 Project URL 和 anon public key。");
    return;
  }
  localStorage.setItem(supabaseConfigKey, JSON.stringify({ url, anonKey }));
  setSyncConfigStatus("Supabase 設定已儲存。");
  initSupabase(url, anonKey);
}

function clearSupabaseConfig() {
  localStorage.removeItem(supabaseConfigKey);
  supabaseClient = null;
  currentUser = null;
  document.getElementById("supabaseUrl").value = defaultSupabaseConfig.url;
  document.getElementById("supabaseAnon").value = defaultSupabaseConfig.anonKey;
  setSyncConfigStatus("已回復預設 Supabase 設定。");
  setAuthStatus("尚未登入。");
  setCloudStatus("設定並登入後，會把本機紀錄合併到雲端，也會拉回其他裝置的紀錄。");
  initSupabase(defaultSupabaseConfig.url, defaultSupabaseConfig.anonKey);
}

function initSupabaseFromStorage() {
  const config = loadSupabaseConfig();
  if (!config.url || !config.anonKey) {
    setSyncConfigStatus("尚未設定 Supabase。");
    return;
  }
  document.getElementById("supabaseUrl").value = config.url;
  document.getElementById("supabaseAnon").value = config.anonKey;
  initSupabase(config.url, config.anonKey);
}

function initSupabase(url, anonKey) {
  if (!window.supabase || !window.supabase.createClient) {
    setSyncConfigStatus("Supabase library 尚未載入，請確認網路連線後重新整理。");
    return;
  }

  supabaseClient = window.supabase.createClient(url, anonKey);
  setSyncConfigStatus("Supabase client 已就緒。");
  setSyncState("connecting");

  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUi();
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
      setTimeout(() => syncNow(), 0);
    }
  });

  supabaseClient.auth.getSession().then(({ data }) => {
    currentUser = data.session?.user || null;
    updateAuthUi();
    if (currentUser) syncNow();
  });
}

async function sendMagicLink() {
  if (!supabaseClient) {
    setAuthStatus("請先儲存 Supabase 設定。");
    return;
  }
  const email = document.getElementById("authEmail").value.trim();
  if (!email) {
    setAuthStatus("請先輸入 Email。");
    return;
  }
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: location.href.split("#")[0]
    }
  });
  if (error) {
    setAuthStatus(`寄送失敗：${error.message}`);
    return;
  }
  setAuthStatus("登入連結已寄出。請到信箱點連結，再回到這個 app。");
}

async function signOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  updateAuthUi();
  setCloudStatus("已登出。");
}

function updateAuthUi() {
  if (currentUser) {
    document.getElementById("authEmail").value = currentUser.email || "";
    const email = currentUser.email || currentUser.id;
    setAuthStatus(`✓ ${email}`);
    setSyncState("connecting");
  } else {
    setAuthStatus(currentLang === "zh" ? "尚未登入。" : "Not signed in.");
    setSyncState("offline");
  }
}

async function syncNow() {
  if (!supabaseClient || !currentUser) {
    setCloudStatus("尚未連上 Supabase 或尚未登入；目前只使用本機紀錄。");
    return;
  }

  setSyncState("syncing");
  setCloudStatus("同步中…");
  const remoteEntries = await fetchRemoteEntries();
  if (remoteEntries === null) return;

  mergeEntries(remoteEntries);
  await pushLocalEntries();
  const refreshedEntries = await fetchRemoteEntries();
  if (refreshedEntries !== null) mergeEntries(refreshedEntries);

  renderGarden();
  renderSidebarStatus();
  renderReview();
  restoreToday();
  const now = new Date();
  lastSyncAt = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  localStorage.setItem("growth-compass-last-sync", lastSyncAt);
  setSyncState("ok");
  const entryWord = currentLang === "zh" ? "筆紀錄" : "entries";
  setCloudStatus(`${currentLang === "zh" ? "同步完成" : "Sync complete"} · ${entries.length} ${entryWord} · ${lastSyncAt}`);
}

async function fetchRemoteEntries() {
  const { data, error } = await supabaseClient
    .from("growth_entries")
    .select("entry_date,pillar,note,updated_at")
    .order("entry_date", { ascending: false });

  if (error) {
    setSyncState("error");
    setCloudStatus(`讀取雲端失敗：${error.message}`);
    return null;
  }

  return (data || []).map((row) => ({
    id: `daily-${row.entry_date}-${row.pillar}`,
    type: "DailyEntry",
    date: row.entry_date,
    pillar: row.pillar,
    state: row.pillar,
    reusableTrace: row.note,
    note: row.note,
    createdAt: row.updated_at,
    updatedAt: row.updated_at
  }));
}

function mergeEntries(incoming) {
  const merged = new Map();
  [...entries, ...incoming].forEach((entry) => {
    if (!entry.date || !entry.pillar || !entry.note) return;
    const key = `${entry.date}-${entry.pillar}`;
    const current = merged.get(key);
    if (!current || (entry.updatedAt || "") > (current.updatedAt || "")) {
      merged.set(key, entry);
    }
  });
  entries = Array.from(merged.values()).sort((a, b) => b.date.localeCompare(a.date));
  saveEntries();
}

function showSavedPulse() {
  const panel = document.querySelector(".progress-panel");
  if (!panel) return;
  panel.classList.remove("pulse");
  void panel.offsetWidth;
  panel.classList.add("pulse");
}

async function pushLocalEntries() {
  const rows = entries.map((entry) => ({
    id: `${currentUser.id}:${entry.date}:${entry.pillar}`,
    user_id: currentUser.id,
    entry_date: entry.date,
    pillar: entry.pillar,
    note: entry.reusableTrace || entry.note,
    updated_at: entry.updatedAt || new Date().toISOString()
  }));

  if (rows.length === 0) return;

  const { error } = await supabaseClient
    .from("growth_entries")
    .upsert(rows, { onConflict: "id" });

  if (error) { setSyncState("error"); setCloudStatus(`寫入雲端失敗：${error.message}`); }
}

async function syncEntry(entry) {
  if (!supabaseClient || !currentUser) return;
  const row = {
    id: `${currentUser.id}:${entry.date}:${entry.pillar}`,
    user_id: currentUser.id,
    entry_date: entry.date,
    pillar: entry.pillar,
    note: entry.reusableTrace || entry.note,
    updated_at: entry.updatedAt || new Date().toISOString()
  };
  const { error } = await supabaseClient
    .from("growth_entries")
    .upsert(row, { onConflict: "id" });
  if (error) {
    setCloudStatus(`今日痕跡已存在本機，但雲端同步失敗：${error.message}`);
  } else {
    setCloudStatus("今日痕跡已同步到雲端。");
  }
}

function toggleAdvancedSync() {
  const box = document.getElementById("advancedSyncBox");
  const btn = document.getElementById("toggleAdvanced");
  if (!box) return;
  const open = box.style.display === "none" || box.style.display === "";
  box.style.display = open ? "block" : "none";
  if (btn) btn.textContent = open
    ? (currentLang === "zh" ? "▴ 收起進階設定" : "▴ Hide advanced")
    : (currentLang === "zh" ? "▾ 進階設定" : "▾ Advanced settings");
}

function setSyncConfigStatus(message) {
  document.getElementById("syncConfigStatus").textContent = message;
}

function setAuthStatus(message) {
  document.getElementById("authStatus").textContent = message;
}

function setCloudStatus(message) {
  document.getElementById("cloudStatus").textContent = message;
}

function resetData() {
  const ok = confirm("確定要清除這個 app 存在本機瀏覽器的紀錄嗎？");
  if (!ok) return;
  entries = [];
  saveEntries();
  appData.traceCards = [];
  saveAppData();
  document.getElementById("dailyNote").value = "";
  document.getElementById("dailyStatus").textContent = "本機紀錄已清除。";
  renderGarden();
  renderReview();
}

init();
