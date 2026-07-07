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
    dailyPlaceholder: "今天留下一個片刻。",
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
    weeklyHistoryTitle: "過去幾週的回顧",
    monthlyMemoryTitle: "這個月留下了什麼",
    yearGardenTitle: "今年的花園",
    monthlyWriteLabel: "把這個月收斂成一句能帶走的：",
    monthNotePlaceholder: "這個月我發現…，所以下個月我要…",
    exportMarkdown: "匯出 Markdown",
    exportJson: "備份 JSON",
    importJson: "匯入 JSON",
    resetData: "清除本機紀錄",
    localSyncHint: "登入 Google 後，Mac / iPhone / iPad 會透過 Google Drive 自動合併同步；JSON 備份保留作為手動保險。",
    syncSetupTitle: "讓 iPhone / iPad / Mac 同步",
    projectUrl: "Project URL",
    anonKey: "Anon public key",
    saveConfig: "儲存設定",
    resetConfig: "回復預設",
    googleSignInTitle: "用 Google 登入",
    signInGoogle: "連結 Google Drive",
    signOut: "登出",
    syncStatusTitle: "同步狀態",
    syncNow: "立即同步",
    unsaved: "尚未留下。",
    saved: "留下了。",
    emptyNote: "先寫一句也可以。",
    cleared: "已清空輸入框，尚未改動已儲存紀錄。",
    existingToday: "今天已經有一筆痕跡，可以修改後重新儲存。",
    noEntries: "還沒有痕跡。今天留下第一句，從這裡開始。",
    monthEmpty: "這個月還沒有紀錄。先不用補很多，今天一句就會進來。",
    monthDays: "本月已記 {count} 天",
    monthLead: "最常出現的是「{name}」",
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
    dailyPlaceholder: "Leave one moment from today.",
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
    weeklyHistoryTitle: "Past weeks' reviews",
    monthlyMemoryTitle: "What this month is keeping",
    yearGardenTitle: "This year in bloom",
    monthlyWriteLabel: "Distill this month into one line to carry forward:",
    monthNotePlaceholder: "This month I noticed…, so next month I will…",
    exportMarkdown: "Export Markdown",
    exportJson: "Backup JSON",
    importJson: "Import JSON",
    resetData: "Clear local records",
    localSyncHint: "After Google sign-in, Mac / iPhone / iPad merge through Google Drive. JSON backup stays as a manual safety net.",
    syncSetupTitle: "Sync iPhone / iPad / Mac",
    projectUrl: "Project URL",
    anonKey: "Anon public key",
    saveConfig: "Save settings",
    resetConfig: "Restore default",
    googleSignInTitle: "Sign in with Google",
    signInGoogle: "Connect Google Drive",
    signOut: "Sign out",
    syncStatusTitle: "Sync status",
    syncNow: "Sync now",
    unsaved: "Not saved yet.",
    saved: "Saved.",
    emptyNote: "One sentence is enough.",
    cleared: "Input cleared. Saved records were not changed.",
    existingToday: "You already have a trace today. Edit and save again if needed.",
    noEntries: "No traces yet. Leave your first sentence today.",
    monthEmpty: "No records this month yet. No need to backfill; one sentence today will enter here.",
    monthDays: "{count} logged days this month",
    monthLead: "Most frequent: {name}",
    routeTitleDefault: "Choose an information state",
    routeSummaryDefault: "I will show where it belongs, what not to mix in, and the next step.",
    notSelected: "Not selected"
  }
};

const pillars = [
  {
    id: "knowledge",
    color: "#5577b9",
    name: { zh: "知識體系", en: "Knowledge" },
    copy: { zh: "今天哪個東西改寫了你原本相信的？", en: "What did today rewrite in something you believed?" },
    prompt: { zh: "這週，哪個新東西改寫了你原本相信的？改寫前後差在哪？", en: "What rewrote a belief this week — before vs after?" }
  },
  {
    id: "expression",
    color: "#c96f5b",
    name: { zh: "有力量的表達", en: "Expression" },
    copy: { zh: "今天哪一次表達沒達到你要的效果？差在哪？", en: "Which attempt to express something fell short today — where?" },
    prompt: { zh: "這週哪一次表達沒達到效果？差在內容、結構、還是語氣？", en: "Where did expression fall short this week — content, structure, or tone?" }
  },
  {
    id: "aesthetic",
    color: "#c49a45",
    name: { zh: "審美辨識", en: "Aesthetic" },
    copy: { zh: "今天讓你停下來的那個畫面，你說得出它為什麼好嗎？", en: "What made you pause today — can you say why it's good?" },
    prompt: { zh: "這週你對什麼的評價變了？以前和現在差在哪？", en: "What did your taste shift on this week — before vs now?" }
  },
  {
    id: "solitude",
    color: "#4f8a73",
    name: { zh: "深度愛好", en: "Deep interest" },
    copy: { zh: "今天那段只屬於自己的時間，是真投入還是消磨？", en: "Your time alone today — truly absorbed, or just passing time?" },
    prompt: { zh: "這週的獨處，哪段是真投入、哪段只是消磨？差別是什麼？", en: "This week's solitude — absorbed vs passing time, and the difference?" }
  },
  {
    id: "emotion",
    color: "#7b6598",
    name: { zh: "情緒覺察", en: "Emotion" },
    copy: { zh: "今天最大聲的情緒，觸發它的是事件、還是你的解讀？", en: "Today's loudest emotion — the event, or your reading of it?" },
    prompt: { zh: "這週有沒有重複出現的情緒？上次出現是什麼時候、情境像不像？", en: "Any emotion that kept returning this week — when before, and how similar?" }
  }
];

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
const languageKey = "growth-compass-language";
const themeKey = "growth-compass-theme";
const googleConnectedKey = "growth-compass-google-connected";
const appDataVersion = 2;
const googleClientId = "278079408254-7qv6codp91vp7sfjc5hin55el1c4ob9h.apps.googleusercontent.com";
const googleDriveScope = "openid email profile https://www.googleapis.com/auth/drive.appdata";
const driveFileName = "growth-compass-data.json";
let selectedPillar = pillars[0].id;
let appData = loadAppData();
let entries = appData.dailyEntries;
let googleTokenClient = null;
let googleAccessToken = "";
let driveFileId = localStorage.getItem("growth-compass-drive-file-id") || "";
let syncState = "offline";   // offline | connecting | syncing | ok | reconnect | error
let lastSyncAt = localStorage.getItem("growth-compass-last-sync") || null;
let googleInitAttempts = 0;
let lastGoogleEmail = localStorage.getItem("growth-compass-google-email") || "";
let googleAuthWatchTimer = null;
let googleAuthMode = "interactive";

function setSyncState(state) {
  syncState = state;
  renderSyncBadge();
  renderSyncPanelState();
  renderSyncCta();
}

function renderSyncBadge() {
  const button = document.getElementById("syncStatusButton");
  const label = document.getElementById("syncMiniText");
  if (button) button.dataset.syncState = currentUser ? syncState : "offline";
  if (label) label.textContent = getSyncMiniLabel();
  renderSidebarStatus();
}

function getSyncMiniLabel() {
  const isZh = currentLang === "zh";
  if (!currentUser) return isZh ? "需登入" : "Sign in";
  if (syncState === "ok") return isZh ? "已同步" : "Synced";
  if (syncState === "syncing" || syncState === "connecting") return isZh ? "同步中" : "Syncing";
  if (syncState === "reconnect") return isZh ? "需重連" : "Reconnect";
  if (syncState === "error") return isZh ? "同步錯誤" : "Sync issue";
  return isZh ? "離線" : "Offline";
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
    monthlyReviews: [],
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
  data.monthlyReviews = (raw?.monthlyReviews || []).map(normalizeMonthlyReview).filter(Boolean);
  data.traceCards = (raw?.traceCards || []).map(normalizeTraceCard).filter(Boolean);
  return data;
}

function normalizeMonthlyReview(review) {
  if (!review?.monthKey) return null;
  const timestamp = review.updatedAt || review.createdAt || new Date().toISOString();
  return {
    id: review.id || `monthly-${review.monthKey}`,
    type: "MonthlyReview",
    monthKey: review.monthKey,
    content: review.content || "",
    createdAt: review.createdAt || timestamp,
    updatedAt: timestamp
  };
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

function localDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey() {
  return localDateKey();
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
  initWorld();
  renderTheme();
  renderLanguage();
  renderTabs();
  renderPillarBar();
  renderRouter();
  renderGarden();
  renderSidebarStatus();
  renderReview();
  restoreToday();

  document.getElementById("saveDaily").addEventListener("click", saveDaily);
  document.getElementById("exportMarkdown").addEventListener("click", exportMarkdown);
  document.getElementById("exportJson").addEventListener("click", exportJson);
  document.getElementById("importJson").addEventListener("change", importJson);
  document.getElementById("resetData").addEventListener("click", resetData);
  document.getElementById("monthNote").addEventListener("input", (e) => saveMonthNote(e.target.value));
  document.getElementById("signInGoogle").addEventListener("click", signInWithGoogle);
  document.getElementById("signOut").addEventListener("click", signOut);
  document.getElementById("syncNow").addEventListener("click", syncNow);
  document.getElementById("syncStatusButton").addEventListener("click", () => showView("settings"));

  document.querySelector(".theme-toggle").addEventListener("click", changeTheme);
  window.addEventListener("online", () => {
    restoreGoogleDriveSession("online");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") restoreGoogleDriveSession("visible");
  });
  initGoogleDriveAuth();
  initKeyboardShortcuts();
  document.getElementById("dailyNote").focus();
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderLanguage() {
  document.documentElement.lang = currentLang === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18n);
  });
  const dailyNote = document.getElementById("dailyNote");
  if (dailyNote) dailyNote.placeholder = t("dailyPlaceholder");
  const monthNote = document.getElementById("monthNote");
  if (monthNote) monthNote.placeholder = t("monthNotePlaceholder");
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem(languageKey, currentLang);
      renderLanguage();
      renderPillarBar();
      renderRouter();
      renderGarden();
      renderSidebarStatus();
      renderReview();
      renderGreeting();
    }, { once: true });
  });
  renderSyncCta();
  renderSyncBadge();
}

function renderTabs() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view, tab));
  });
}

function showView(viewId, activeTab = null) {
  document.querySelectorAll(".nav-tab").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  if (activeTab) activeTab.classList.add("active");
  document.getElementById(viewId)?.classList.add("active");
}

function renderPillarBar() {
  const bar = document.getElementById("pillarBar");
  if (!bar) return;
  bar.innerHTML = "";
  const today = todayKey();
  // Set active pillar color on input area for live accent
  const activePillar = pillars.find((p) => p.id === selectedPillar);
  const inputArea = document.querySelector(".main-input-area");
  if (inputArea && activePillar) inputArea.style.setProperty("--active-pillar", activePillar.color);
  const promptEl = document.getElementById("dailyPrompt");
  if (promptEl && activePillar) {
    promptEl.textContent = localize(activePillar.copy);
    promptEl.style.color = activePillar.color;
  }
  pillars.forEach((pillar) => {
    const logged = entries.some((e) => e.pillar === pillar.id && e.date === today);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `pillar-chip${pillar.id === selectedPillar ? " active" : ""}`;
    btn.style.setProperty("--pcolor", pillar.color);
    btn.setAttribute("title", localize(pillar.copy));
    btn.innerHTML = `
      <span class="pc-dot${logged ? " logged" : ""}"></span>
      <span class="pc-name">${localize(pillar.name)}</span>
    `;
    btn.addEventListener("click", () => {
      selectedPillar = pillar.id;
      renderPillarBar();
      restoreForPillar(pillar.id);
      document.getElementById("dailyNote").focus();
    });
    bar.appendChild(btn);
  });
}

/* ─── Living World: time of day, seasons, ambient life ─────────
   The environment reflects the real hour and month so the app feels
   inhabited before the user does anything. All of this is decorative
   (aria-hidden) and never blocks the core capture → route → review loop. */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const greetings = {
  dawn: { zh: "天亮了", en: "First light" },
  day: { zh: "白日正好", en: "The day is open" },
  dusk: { zh: "暮色四合", en: "Dusk is settling" },
  night: { zh: "夜深了", en: "The night is quiet" }
};

function getDaytime(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 17) return "day";
  if (h >= 17 && h < 20) return "dusk";
  return "night";
}

function getSeason(date = new Date()) {
  const m = date.getMonth();
  if (m <= 1 || m === 11) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
}

// The 24 solar terms (節氣) with approximate Gregorian start dates and a coarse
// flora "mood" that drives the ground and the horizon tint. Dates drift ±1 day
// year to year — fine for a decorative ground. Ordered by calendar date.
const solarTerms = [
  [1, 6, "小寒", "frost"], [1, 20, "大寒", "frost"],
  [2, 4, "立春", "budding"], [2, 19, "雨水", "budding"], [3, 6, "驚蟄", "budding"],
  [3, 21, "春分", "blossom"], [4, 5, "清明", "blossom"], [4, 20, "穀雨", "blossom"],
  [5, 6, "立夏", "lush"], [5, 21, "小滿", "lush"], [6, 6, "芒種", "lush"],
  [6, 21, "夏至", "ripe"], [7, 7, "小暑", "ripe"], [7, 23, "大暑", "ripe"],
  [8, 8, "立秋", "amber"], [8, 23, "處暑", "amber"], [9, 8, "白露", "amber"],
  [9, 23, "秋分", "amber"], [10, 8, "寒露", "amber"], [10, 24, "霜降", "amber"],
  [11, 8, "立冬", "frost"], [11, 22, "小雪", "frost"], [12, 7, "大雪", "frost"], [12, 22, "冬至", "frost"]
];

function getSolarTerm(date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Default to 冬至 — it also covers Jan 1–5 (carried over from the prior year).
  let current = solarTerms[solarTerms.length - 1];
  for (const term of solarTerms) {
    if (m > term[0] || (m === term[0] && d >= term[1])) current = term;
  }
  return { zh: current[2], group: current[3] };
}

const groundMoodColors = {
  budding: "#cfe3b6",
  blossom: "#d9e4c0",
  lush: "#c9e0a8",
  ripe: "#d8e1a4",
  amber: "#e7c79a",
  frost: "#d6e0e3"
};

function applyWorld() {
  const root = document.documentElement;
  const now = new Date();
  root.dataset.daytime = getDaytime(now);
  root.dataset.season = getSeason(now);
  root.dataset.groundMood = getSolarTerm(now).group;
  positionCelestial(now);
  renderGreeting();
}

// Place the sun/moon along a gentle arc based on how far we are through
// the daylight (05:00–20:00) or night window.
function positionCelestial(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const dayStart = 5 * 60;
  const dayEnd = 20 * 60;
  const isDay = mins >= dayStart && mins < dayEnd;
  let frac;
  if (isDay) {
    frac = (mins - dayStart) / (dayEnd - dayStart);
  } else {
    const nightSpan = 24 * 60 - (dayEnd - dayStart);
    const nm = mins < dayStart ? mins + (24 * 60 - dayEnd) : mins - dayEnd;
    frac = nm / nightSpan;
  }
  const x = 8 + frac * 84;
  const y = 82 - Math.sin(frac * Math.PI) * 64;
  const root = document.documentElement;
  root.style.setProperty("--cel-x", `${x.toFixed(2)}%`);
  root.style.setProperty("--cel-y", `${y.toFixed(2)}%`);
}

function renderGreeting() {
  const el = document.getElementById("worldGreeting");
  if (!el) return;
  const phase = getDaytime();
  const base = greetings[phase][currentLang] || greetings[phase].zh;
  // Ground the world in the real solar term (節氣) — kept in Chinese as a proper term.
  el.textContent = `${base} · ${getSolarTerm().zh}`;
}

// A small, fixed set of drifting motes: pollen by day, stars/fireflies by night.
function spawnMotes() {
  const sky = document.getElementById("sky");
  if (!sky || sky.querySelector(".motes")) return;
  const layer = document.createElement("div");
  layer.className = "motes";
  const count = 20;
  for (let i = 0; i < count; i++) {
    const mote = document.createElement("span");
    mote.className = "mote";
    mote.style.setProperty("--mx", `${(Math.random() * 100).toFixed(2)}%`);
    mote.style.setProperty("--my", `${(Math.random() * 100).toFixed(2)}%`);
    mote.style.setProperty("--ms", (0.4 + Math.random() * 1.5).toFixed(2));
    mote.style.setProperty("--md", `${(8 + Math.random() * 12).toFixed(2)}s`);
    mote.style.setProperty("--mdelay", `${(-Math.random() * 14).toFixed(2)}s`);
    layer.appendChild(mote);
  }
  sky.appendChild(layer);
}

function initWorld() {
  applyWorld();
  spawnMotes();
  setInterval(applyWorld, 5 * 60 * 1000);
  scheduleSkyMagic();
}

// Hidden surprise: on a night when all five pillars have been tended this
// week, the sky occasionally sends a shooting star. No badge, no popup — the
// world just quietly rewards a balanced, complete week.
function isNightish() {
  const phase = getDaytime();
  return phase === "night" || phase === "dusk";
}

function allFiveTended() {
  const recent = getRecentEntries(7);
  return pillars.every((p) => recent.some((e) => e.pillar === p.id));
}

function skyMagicReady() {
  return !prefersReducedMotion && isNightish() && allFiveTended();
}

function spawnShootingStar() {
  const sky = document.getElementById("sky");
  if (!sky || prefersReducedMotion) return;
  const star = document.createElement("span");
  star.className = "shooting-star";
  star.style.setProperty("--sx", `${(6 + Math.random() * 42).toFixed(1)}%`);
  star.style.setProperty("--sy", `${(5 + Math.random() * 26).toFixed(1)}%`);
  sky.appendChild(star);
  setTimeout(() => star.remove(), 1700);
}

let skyMagicTimer = null;
function scheduleSkyMagic() {
  if (skyMagicTimer || prefersReducedMotion) return;
  const tick = () => {
    if (skyMagicReady() && !document.hidden && Math.random() < 0.55) spawnShootingStar();
    skyMagicTimer = window.setTimeout(tick, 24000 + Math.random() * 34000);
  };
  skyMagicTimer = window.setTimeout(tick, 9000 + Math.random() * 12000);
}

// Emotional feedback when a trace is saved: the tended plant blooms with
// light, the companion brightens, and the sky takes one soft breath.
function celebrateTrace(pillarId) {
  const pillar = pillars.find((p) => p.id === pillarId) || pillars[0];
  const companion = document.getElementById("companion");
  if (companion) {
    companion.style.setProperty("--glow", pillar.color);
    if (!prefersReducedMotion) {
      companion.classList.remove("delight");
      void companion.offsetWidth;
      companion.classList.add("delight");
    }
  }
  if (prefersReducedMotion) return;
  const sky = document.getElementById("sky");
  if (sky) {
    sky.classList.remove("breath");
    void sky.offsetWidth;
    sky.classList.add("breath");
  }
  // If this trace just completed a full, balanced week at night, the sky
  // marks the moment with a shooting star right away.
  if (skyMagicReady()) spawnShootingStar();
  // renderGarden() has already run synchronously, so the grown plant is
  // in the DOM now — spawn the bloom directly, no rAF needed.
  const plant = document.querySelector(".garden-plant.just-grew");
  if (!plant) return;
  const wrap = plant.querySelector(".plant-svg-wrap") || plant;
  const burst = document.createElement("span");
  burst.className = "bloom-burst";
  burst.style.setProperty("--bloom", pillar.color);
  wrap.appendChild(burst);
  setTimeout(() => burst.remove(), 1100);
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Cmd+Enter or Ctrl+Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      saveDaily();
      return;
    }
    // 1-5 to select pillar (only when textarea is NOT focused)
    if (!e.metaKey && !e.ctrlKey && !e.altKey && e.target !== document.getElementById("dailyNote")) {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5 && pillars[num - 1]) {
        selectedPillar = pillars[num - 1].id;
        renderPillarBar();
        restoreForPillar(pillars[num - 1].id);
      }
    }
  });
}

function renderSidebarStatus() {
  const streakEl = document.getElementById("sidebarStreak");
  if (streakEl) {
    const days = getMonthLoggedDays();
    const unit = currentLang === "zh" ? "本月" : "this mo.";
    streakEl.innerHTML = days > 0
      ? `<span class="ss-month-badge"><strong>${days}</strong><small>${unit}</small></span>`
      : "";
  }
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
  if (!existing) {
    note.value = "";
    if (status) status.textContent = t("unsaved");
    return;
  }
  note.value = existing.reusableTrace || existing.note || "";
  if (status) status.textContent = t("existingToday");
}

function restoreToday() {
  restoreForPillar(selectedPillar);
}

function saveDaily() {
  const note = document.getElementById("dailyNote").value.trim();
  if (!note) {
    const status = document.getElementById("dailyStatus");
    if (status) status.textContent = t("emptyNote");
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
  if (statusEl) {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    const stage = getPillarStage(entry.pillar);
    const stageText = currentLang === "zh"
      ? ["被照到了", "發芽了", "正在成長", "更茂盛了", "盛開中"][stage]
      : ["has been noticed", "sprouted", "is growing", "is thriving", "is blooming"][stage];
    statusEl.textContent = currentLang === "zh"
      ? `已留下。今天的${localize(pillar.name)}${stageText}。`
      : `Saved. ${localize(pillar.name)} ${stageText} today.`;
    statusEl.classList.add("status-saved");
    setTimeout(() => statusEl.classList.remove("status-saved"), 1800);
  }
  renderPillarBar();
  renderGarden(entry.pillar);
  celebrateTrace(entry.pillar);
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

function getPillarStage(pillarId) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const cutoffKey = localDateKey(cutoff);
  const count = entries.filter((e) => e.pillar === pillarId && e.date >= cutoffKey).length;
  return Math.min(count, 4);
}

function mixHex(a, b, t) {
  const pa = a.replace("#", "");
  const pb = b.replace("#", "");
  const ch = (s, i) => parseInt(s.substr(i, 2), 16);
  const out = [0, 2, 4].map((i) => {
    const v = Math.round(ch(pa, i) + (ch(pb, i) - ch(pa, i)) * t);
    return Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");
  });
  return `#${out.join("")}`;
}

// Illustrated plants in a flat, storybook style: full rounded petals, broad
// veined leaves, a small soil mound, and sparkles at full bloom. Five stages
// grow from a tender drooping seedling to an open flower. Each pillar's colour
// carries the whole plant, with leaves nudged toward foliage green.
function plantSVG(stage, color) {
  const petal = color;
  const leaf = mixHex(color, "#3f6b39", 0.26);
  const stem = mixHex(color, "#3f6b39", 0.36);
  const vein = mixHex(leaf, "#1f3418", 0.4);
  const soil = mixHex(color, "#8a6a52", 0.6);
  const centerFill = "#fff6e2";
  const centerDot = mixHex(color, "#6f521c", 0.45);

  const soilBase = (y) =>
    `<ellipse cx="40" cy="${y + 3}" rx="20" ry="3.4" fill="#000" opacity="0.06"/>` +
    `<path d="M22 ${y} Q40 ${y - 5} 58 ${y} Q40 ${y + 3.4} 22 ${y} Z" fill="${soil}" opacity="0.9"/>`;

  const leafAt = (x, y, rot, sc, left) =>
    `<g transform="translate(${x} ${y}) scale(${left ? -1 : 1} 1) rotate(${rot}) scale(${sc})">` +
    `<path d="M0 0 C6 -7 17 -8.5 24 -3 C17 3.5 6 4 0 0 Z" fill="${leaf}"/>` +
    `<path d="M3 -1 C10 -3.4 17 -4.4 21 -3.2" stroke="${vein}" stroke-width="0.9" fill="none" stroke-linecap="round" opacity="0.55"/></g>`;

  const stemPath = (d) =>
    `<path d="${d}" stroke="${stem}" stroke-width="3.1" fill="none" stroke-linecap="round"/>`;

  const bud = (cx, cy, sz) =>
    `<path d="M${cx} ${cy - sz} C${cx - 0.62 * sz} ${cy - 0.35 * sz} ${cx - 0.5 * sz} ${cy + 0.28 * sz} ${cx} ${cy + 0.34 * sz} C${cx + 0.5 * sz} ${cy + 0.28 * sz} ${cx + 0.62 * sz} ${cy - 0.35 * sz} ${cx} ${cy - sz} Z" fill="${petal}"/>` +
    `<path d="M${cx} ${cy + 0.34 * sz} C${cx - 0.4 * sz} ${cy + 0.1 * sz} ${cx - 0.4 * sz} ${cy - 0.2 * sz} ${cx} ${cy - 0.2 * sz}" fill="none" stroke="${leaf}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`;

  const flower = (cx, cy, r) => {
    const petals = [0, 72, 144, 216, 288].map((a) =>
      `<path d="M0 0 C${-0.3 * r} ${-0.3 * r} ${-0.3 * r} ${-0.82 * r} 0 ${-r} C${0.3 * r} ${-0.82 * r} ${0.3 * r} ${-0.3 * r} 0 0 Z" fill="${petal}" transform="translate(${cx} ${cy}) rotate(${a})"/>`
    ).join("");
    let stamens = "";
    for (let i = 0; i < 8; i++) {
      const a = (i * 45) * Math.PI / 180;
      const x2 = (cx + Math.cos(a) * 0.3 * r).toFixed(1);
      const y2 = (cy + Math.sin(a) * 0.3 * r).toFixed(1);
      stamens += `<line x1="${(cx + Math.cos(a) * 0.14 * r).toFixed(1)}" y1="${(cy + Math.sin(a) * 0.14 * r).toFixed(1)}" x2="${x2}" y2="${y2}" stroke="${centerDot}" stroke-width="${(0.05 * r).toFixed(2)}" stroke-linecap="round" opacity="0.75"/>`;
      stamens += `<circle cx="${x2}" cy="${y2}" r="${(0.05 * r).toFixed(2)}" fill="${centerDot}"/>`;
    }
    return `${petals}<circle cx="${cx}" cy="${cy}" r="${0.32 * r}" fill="${centerFill}"/>${stamens}<circle cx="${cx}" cy="${cy}" r="${0.1 * r}" fill="${centerDot}" opacity="0.6"/>`;
  };

  const sparkle = (x, y, sp) =>
    `<path class="sparkle" d="M${x} ${y - sp} C${x} ${y - 0.3 * sp} ${x + 0.3 * sp} ${y} ${x + sp} ${y} C${x + 0.3 * sp} ${y} ${x} ${y + 0.3 * sp} ${x} ${y + sp} C${x} ${y + 0.3 * sp} ${x - 0.3 * sp} ${y} ${x - sp} ${y} C${x - 0.3 * sp} ${y} ${x} ${y - 0.3 * sp} ${x} ${y - sp} Z" fill="${petal}" opacity="0.7"/>`;
  const dot = (x, y, r) => `<circle class="sparkle" cx="${x}" cy="${y}" r="${r}" fill="${petal}" opacity="0.55"/>`;

  const s = [
    // 0: tender seedling with a drooping tip
    soilBase(90) +
      stemPath("M40 90 C39 83 40 79 41 76 C42 73.5 44 73 46 74") +
      `<path d="M46 72.5 C43.6 73 43 75.4 44 77.2 C45.4 78.2 47.4 77.4 48 75.6 C48.3 74.2 47.5 72.6 46 72.5 Z" fill="${petal}"/>` +
      leafAt(40, 85, -8, 0.5, true) + leafAt(40, 85, -8, 0.5, false),
    // 1: sprout
    soilBase(90) +
      stemPath("M40 90 C40 81 40 74 40 67") +
      leafAt(40, 82, -6, 0.66, true) + leafAt(40, 82, -6, 0.66, false) +
      leafAt(40, 71, -2, 0.5, true) + leafAt(40, 71, -2, 0.5, false),
    // 2: growing, closed bud
    soilBase(90) +
      stemPath("M40 90 C39 76 40 64 40 55") +
      leafAt(40, 84, -8, 0.74, true) + leafAt(40, 84, -8, 0.74, false) +
      leafAt(40, 70, -5, 0.62, true) + leafAt(40, 70, -5, 0.62, false) +
      bud(40, 50, 8),
    // 3: thriving, small open flower
    soilBase(90) +
      stemPath("M40 90 C38 74 40 58 40 46") +
      leafAt(40, 84, -9, 0.82, true) + leafAt(40, 84, -9, 0.82, false) +
      leafAt(40, 70, -6, 0.72, true) + leafAt(40, 70, -6, 0.72, false) +
      leafAt(40, 57, -3, 0.58, true) + leafAt(40, 57, -3, 0.58, false) +
      flower(40, 40, 15),
    // 4: full bloom
    soilBase(90) +
      stemPath("M40 91 C38 72 40 54 40 42") +
      leafAt(40, 85, -10, 0.9, true) + leafAt(40, 85, -10, 0.9, false) +
      leafAt(40, 71, -7, 0.8, true) + leafAt(40, 71, -7, 0.8, false) +
      leafAt(40, 57, -4, 0.66, true) + leafAt(40, 57, -4, 0.66, false) +
      flower(40, 28, 22) +
      sparkle(15, 26, 3) + sparkle(64, 22, 2.4) + dot(20, 40, 1.4) + dot(61, 42, 1.6) + dot(58, 14, 1.2)
  ];
  return `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s[Math.min(stage, 4)]}</svg>`;
}

function getWeekStart(date) {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return localDateKey(d);
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

function getMonthLoggedDays() {
  const monthKey = todayKey().slice(0, 7);
  const days = new Set(entries.filter((e) => e.date.startsWith(monthKey)).map((e) => e.date));
  return days.size;
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
  renderGardenGround();

  pillars.forEach((pillar) => {
    const stage = getPillarStage(pillar.id);
    const hasToday = entries.some((e) => e.pillar === pillar.id && e.date === today);
    const isJustGrew = pillar.id === justGrownPillar;
    const stepsToNext = stage < 4 ? (stage + 1) - (
      entries.filter((e) => e.pillar === pillar.id && e.date >= (() => {
        const c = new Date(); c.setDate(c.getDate() - 6); return localDateKey(c);
      })()).length
    ) : 0;

    const item = document.createElement("button");
    item.type = "button";
    item.className = `garden-plant${hasToday ? " today" : ""}${isJustGrew ? " just-grew" : ""}`;
    if (hasToday) item.style.setProperty("--plant-color", pillar.color);
    const progressHint = stage < 4 && stepsToNext > 0
      ? `<span class="plant-progress">${currentLang === "zh" ? `再記 ${stepsToNext} 次` : `${stepsToNext} more`}</span>`
      : stage === 4
      ? `<span class="plant-progress bloom">${currentLang === "zh" ? "盛開中" : "Blooming"}</span>`
      : "";
    const lastForPillar = entries.find((e) => e.pillar === pillar.id);
    const lastTrace = lastForPillar ? (lastForPillar.reusableTrace || lastForPillar.note || "") : "";
    const tooltipText = lastTrace
      ? lastTrace.slice(0, 80)
      : (currentLang === "zh" ? "還沒有痕跡" : "No trace yet");
    item.title = tooltipText;
    item.setAttribute("aria-label", `${localize(pillar.name)} · ${tooltipText}`);
    item.innerHTML = `
      <div class="plant-svg-wrap">${plantSVG(stage, pillar.color)}</div>
      <div class="plant-info">
        <span class="plant-name">${localize(pillar.name)}</span>
        <span class="plant-stage" style="color:${pillar.color}">${(stageLabels[currentLang] || stageLabels.zh)[stage]}</span>
        ${progressHint}
      </div>
      <span class="plant-last">
        <span class="plant-last-label">${lastForPillar ? (currentLang === "zh" ? "上次留下" : "Last trace") : (currentLang === "zh" ? "還沒有痕跡" : "No trace yet")}</span>
        <span class="plant-last-text">${escapeHtml(lastTrace || (currentLang === "zh" ? "等哪天它被你照到，就會在這裡出現。" : "When it gets a trace, it will show here."))}</span>
      </span>
    `;
    item.addEventListener("click", () => {
      garden.querySelectorAll(".garden-plant.show-last").forEach((node) => {
        if (node !== item) node.classList.remove("show-last");
      });
      item.classList.toggle("show-last");
    });
    garden.appendChild(item);
  });

  // Empty state: no entries ever
  if (entries.length === 0) {
    const hint = document.createElement("p");
    hint.className = "garden-empty-hint";
    hint.textContent = currentLang === "zh"
      ? "每記一次，它就往前走一步。"
      : "Every trace moves it forward.";
    garden.appendChild(hint);
  }

  if (justGrownPillar) {
    setTimeout(() => {
      const grewEl = garden.querySelector(".just-grew");
      if (grewEl) grewEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);
  }
}

function renderWeekSummary(recent) {
  const completed = pillars.filter((p) => recent.some((e) => e.pillar === p.id)).length;
  const total = pillars.length;
  const monthDays = getMonthLoggedDays();
  const message = entries.length === 0
    ? (currentLang === "zh" ? "選一個面向，留下今天的第一個痕跡。" : "Choose a dimension and leave your first trace.")
    : completed === total
    ? (currentLang === "zh" ? "這週，五個面向都有了痕跡。" : "All five dimensions have a trace this week.")
    : (currentLang === "zh" ? "這週有些面向被照到了光。" : "Some dimensions were tended to this week.");
  const monthHtml = monthDays > 0
    ? `<div class="month-count-badge"><strong>${monthDays}</strong><small>${currentLang === "zh" ? "本月天數" : "days this mo."}</small></div>`
    : "";
  document.getElementById("weekSummary").innerHTML = `
    <div class="ws-left">
      <strong>${completed}/${total}</strong>
      <span>${message}</span>
    </div>
    <div class="ws-right">
      ${monthHtml}
      <div class="summary-dots" aria-label="weekly pillar completion">
        ${pillars.map((p) => `<span class="${recent.some((e) => e.pillar === p.id) ? "filled" : ""}" style="--dot:${p.color}"></span>`).join("")}
      </div>
    </div>
  `;
}

function renderBars() { renderGarden(); }

function getRecentEntries(days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days + 1);
  const cutoffKey = localDateKey(cutoff);
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
      ? `<p class="review-last">${currentLang === "zh" ? "上週" : "Last week"}: <em>${escapeHtml(lastWeek.content.slice(0, 80))}${lastWeek.content.length > 80 ? "…" : ""}</em></p>`
      : "";
    const placeholder = currentLang === "zh" ? "這週的回顧…" : "This week's reflection…";
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.style.setProperty("--pcard-color", pillar.color);
    card.innerHTML = `
      <p class="entry-meta pc-label" style="color:${pillar.color}">${localize(pillar.name)}</p>
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
  }

  entries.slice(0, 30).forEach((entry) => {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    const card = document.createElement("div");
    card.className = "entry-card";
    card.style.setProperty("--ecolor", pillar.color);
    card.innerHTML = `
      <p>${escapeHtml(entry.reusableTrace || entry.note)}</p>
      <span class="entry-meta">
        <span class="em-dot" style="background:${pillar.color}"></span>
        ${localize(pillar.name)} · ${entry.date}
      </span>
    `;
    entriesNode.appendChild(card);
  });

  renderReviewHistory();
  renderMonthSummary();
  renderMemoryMeadow();
  renderMonthNote();
  renderYearGarden();
}

function renderReviewHistory() {
  const node = document.getElementById("reviewHistory");
  if (!node) return;
  const thisWeek = getWeekStart();
  // Group past weekly reviews (excluding current week) by week, newest first.
  const past = appData.weeklyReviews
    .filter((r) => r.weekStartDate !== thisWeek && (r.content || "").trim());
  if (past.length === 0) {
    node.innerHTML = `<p class="garden-empty-hint">${currentLang === "zh" ? "過去幾週的回顧會在這裡累積。" : "Past weeks' reviews will gather here."}</p>`;
    return;
  }
  const byWeek = new Map();
  past.forEach((r) => {
    if (!byWeek.has(r.weekStartDate)) byWeek.set(r.weekStartDate, []);
    byWeek.get(r.weekStartDate).push(r);
  });
  const weeks = [...byWeek.keys()].sort((a, b) => b.localeCompare(a));
  node.innerHTML = weeks.map((week) => {
    const items = byWeek.get(week)
      .sort((a, b) => pillars.findIndex((p) => p.id === a.pillar) - pillars.findIndex((p) => p.id === b.pillar));
    const rows = items.map((r) => {
      const pillar = pillars.find((p) => p.id === r.pillar) || pillars[0];
      return `<div class="history-row">
        <span class="history-dot" style="background:${pillar.color}"></span>
        <span class="history-pillar">${localize(pillar.name)}</span>
        <span class="history-text">${escapeHtml(r.content)}</span>
      </div>`;
    }).join("");
    const label = currentLang === "zh" ? `${week} 那週` : `Week of ${week}`;
    return `<details class="history-week"><summary>${label}</summary>${rows}</details>`;
  }).join("");
}

function monthNoteContent() {
  const monthKey = todayKey().slice(0, 7);
  return appData.monthlyReviews.find((r) => r.monthKey === monthKey)?.content || "";
}

function renderMonthNote() {
  const ta = document.getElementById("monthNote");
  if (!ta) return;
  if (document.activeElement !== ta) ta.value = monthNoteContent();
}

function saveMonthNote(content) {
  const monthKey = todayKey().slice(0, 7);
  const id = `monthly-${monthKey}`;
  const idx = appData.monthlyReviews.findIndex((r) => r.id === id);
  const review = {
    id,
    type: "MonthlyReview",
    monthKey,
    content,
    createdAt: idx >= 0 ? appData.monthlyReviews[idx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) appData.monthlyReviews[idx] = review;
  else appData.monthlyReviews.push(review);
  saveAppData();
}

function renderMonthSummary() {
  const node = document.getElementById("monthSummary");
  if (!node) return;
  const monthKey = todayKey().slice(0, 7);
  const monthEntries = entries.filter((entry) => entry.date.startsWith(monthKey));
  if (monthEntries.length === 0) {
    node.innerHTML = `<p class="garden-empty-hint">${t("monthEmpty")}</p>`;
    return;
  }

  const uniqueDays = new Set(monthEntries.map((entry) => entry.date)).size;
  const counts = pillars.map((pillar) => ({
    pillar,
    count: monthEntries.filter((entry) => entry.pillar === pillar.id).length
  }));
  const ranked = [...counts].sort((a, b) => b.count - a.count);
  const lead = ranked[0];
  const second = ranked.find((item) => item.count > 0 && item.pillar.id !== lead.pillar.id);
  const totalTraces = monthEntries.length;
  const monthSentence = currentLang === "zh"
    ? `這個月，你最常回到「${localize(lead.pillar.name)}」；已留下 ${uniqueDays} 天、${totalTraces} 個片刻${second ? `，「${localize(second.pillar.name)}」也開始有痕跡` : ""}。`
    : `This month, you return most to ${localize(lead.pillar.name)}; ${uniqueDays} days and ${totalTraces} traces are kept${second ? `, with ${localize(second.pillar.name)} also showing up` : ""}.`;
  node.innerHTML = `
    <div class="month-memory-lead">
      <strong>${currentLang === "zh" ? "這個月的你" : "This month"}</strong>
      <span>${monthSentence}</span>
    </div>
    <div class="month-memory-grid">
      ${counts.map(({ pillar, count }) => `
        <div class="month-memory-item">
          <span class="color-dot" style="background:${pillar.color}"></span>
          <strong>${localize(pillar.name)}</strong>
          <span>${count}</span>
        </div>
      `).join("")}
    </div>
  `;
}

// Seasonal ground: as the month fills with traces, small flora accumulates on
// the soil beneath the garden — a place that visibly shows it has been lived
// in. Layout is deterministic (seeded by index) so it only grows, never
// reshuffles, and it re-dresses itself with each season's palette.
const solarGround = {
  budding: { types: ["tuft", "petal", "tuft"], colors: ["#8fbf6a", "#cfe3b6", "#6ea862"] },
  blossom: { types: ["petal", "petal", "tuft"], colors: ["#e6b3c6", "#f2ede4", "#7bab4e"] },
  lush: { types: ["tuft", "tuft", "tuft"], colors: ["#5f9f45", "#7bab4e", "#6ea862"] },
  ripe: { types: ["tuft", "tuft", "petal"], colors: ["#5f9f45", "#c4a445", "#8bc34a"] },
  amber: { types: ["petal", "petal", "tuft"], colors: ["#d99a2a", "#cc6b25", "#a8894e"] },
  frost: { types: ["pebble", "pebble", "tuft"], colors: ["#9aa7ab", "#e8eef0", "#6f8a7e"] }
};

function groundMarkSVG(type, color) {
  if (type === "tuft") {
    return `<svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 16 C8.4 10 8.2 7 9 3" stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M9 15 C6 11 4 10 3 8.5" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M9 15 C12 11 14 10 15 8.5" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`;
  }
  if (type === "petal") {
    return `<svg viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="8" cy="6" rx="6.5" ry="3.1" fill="${color}" opacity="0.72" transform="rotate(-12 8 6)"/></svg>`;
  }
  return `<svg viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="8" cy="6.5" rx="6" ry="3.3" fill="${color}" opacity="0.6"/>
    <ellipse cx="6" cy="5.4" rx="2.4" ry="1.2" fill="#fff" opacity="0.28"/></svg>`;
}

function renderGardenGround() {
  const node = document.getElementById("gardenGround");
  if (!node) return;
  const monthKey = todayKey().slice(0, 7);
  const count = Math.min(18, entries.filter((e) => e.date.startsWith(monthKey)).length);
  if (count === 0) {
    node.innerHTML = "";
    return;
  }
  const recipe = solarGround[getSolarTerm().group] || solarGround.lush;
  let html = "";
  for (let i = 0; i < count; i++) {
    const type = recipe.types[i % recipe.types.length];
    const color = recipe.colors[i % recipe.colors.length];
    const x = ((i + 0.5) / count) * 100 + Math.sin(i * 2.3) * 3;
    const y = Math.round(Math.abs(Math.sin(i * 1.7)) * 9);
    const scale = (0.7 + Math.abs(Math.sin(i * 3.1)) * 0.5).toFixed(2);
    html += `<span class="ground-mark" style="left:${x.toFixed(2)}%;bottom:${y}px;--gsc:${scale}">${groundMarkSVG(type, color)}</span>`;
  }
  node.innerHTML = html;
}

// A small standalone flower — one bloom per trace kept this month.
function memoryBloomSVG(color) {
  const petals = [0, 60, 120, 180, 240, 300]
    .map((a) => `<ellipse cx="12" cy="7.4" rx="3" ry="5" fill="${color}" opacity="0.5" transform="rotate(${a} 12 12)"/>`)
    .join("");
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${petals}<circle cx="12" cy="12" r="3.1" fill="${color}"/><circle cx="12" cy="12" r="1.5" fill="#fff" opacity="0.6"/></svg>`;
}

// Memory Meadow: this month's traces, rendered as a field of blooms you can
// tap to revisit. Turns "23 traces this month" into a place you can wander.
function renderMemoryMeadow() {
  const node = document.getElementById("memoryMeadow");
  const reveal = document.getElementById("memoryReveal");
  if (!node) return;
  const monthKey = todayKey().slice(0, 7);
  const monthEntries = entries
    .filter((e) => e.date.startsWith(monthKey))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.pillar.localeCompare(b.pillar));

  if (monthEntries.length === 0) {
    node.hidden = true;
    node.innerHTML = "";
    if (reveal) { reveal.hidden = true; reveal.innerHTML = ""; }
    return;
  }

  node.hidden = false;
  const hint = currentLang === "zh"
    ? "這個月留下的每一個片刻，都在這裡開了一朵。點一朵，回到那天的自己。"
    : "Every moment you kept this month has bloomed here. Tap one to revisit that day.";
  const blooms = monthEntries.map((e, i) => {
    const pillar = pillars.find((p) => p.id === e.pillar) || pillars[0];
    const jitter = Math.round(Math.sin(i * 1.7) * 7);
    const rot = ((i * 37) % 15) - 7;
    return `<button type="button" class="memory-bloom" data-id="${escapeHtml(e.id)}"
      style="--bloom:${pillar.color};--j:${jitter}px;--rot:${rot}deg"
      aria-label="${escapeHtml(localize(pillar.name))} · ${e.date}">${memoryBloomSVG(pillar.color)}</button>`;
  }).join("");
  node.innerHTML = `<p class="meadow-hint">${hint}</p><div class="meadow-field">${blooms}</div>`;

  node.querySelectorAll(".memory-bloom").forEach((btn) => {
    btn.addEventListener("click", () => {
      const entry = monthEntries.find((e) => e.id === btn.dataset.id);
      node.querySelectorAll(".memory-bloom.active").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderMemoryReveal(entry);
    });
  });
}

function renderMemoryReveal(entry) {
  const reveal = document.getElementById("memoryReveal");
  if (!reveal || !entry) return;
  const pillar = pillars.find((p) => p.id === entry.pillar) || pillars[0];
  const text = entry.reusableTrace || entry.note || "";
  reveal.hidden = false;
  reveal.style.setProperty("--bloom", pillar.color);
  reveal.classList.remove("show");
  void reveal.offsetWidth;
  reveal.classList.add("show");
  reveal.innerHTML = `
    <span class="reveal-meta"><span class="reveal-dot" style="background:${pillar.color}"></span>${escapeHtml(localize(pillar.name))} · ${entry.date}</span>
    <p class="reveal-text">${escapeHtml(text)}</p>
  `;
}

// The year as a column of monthly garden plots. Each month grows blooms sized
// by how much each pillar was tended, tinted by that month's solar-term mood;
// tapping a month reveals its distilled note (or a summary). The year fills in
// as it is lived — progression at the largest scale.
function renderYearGarden() {
  const panel = document.getElementById("yearPanel");
  const garden = document.getElementById("yearGarden");
  const reveal = document.getElementById("yearReveal");
  if (!panel || !garden) return;
  const year = todayKey().slice(0, 4);
  const yearEntries = entries.filter((e) => e.date.startsWith(year));
  if (yearEntries.length === 0) {
    panel.hidden = true;
    garden.innerHTML = "";
    if (reveal) { reveal.hidden = true; reveal.innerHTML = ""; }
    return;
  }
  panel.hidden = false;

  const months = [...new Set(yearEntries.map((e) => e.date.slice(0, 7)))].sort();
  const startMonth = parseInt(months[0].slice(5), 10);
  const currentMonth = parseInt(todayKey().slice(5, 7), 10);
  const rows = [];
  for (let m = startMonth; m <= currentMonth; m++) {
    const mk = `${year}-${String(m).padStart(2, "0")}`;
    const monthEntries = yearEntries.filter((e) => e.date.startsWith(mk));
    const moodColor = groundMoodColors[getSolarTerm(new Date(Number(year), m - 1, 15)).group] || "#d8e1a4";
    const total = monthEntries.length;
    const monthLabel = currentLang === "zh"
      ? `${m}月`
      : new Date(2020, m - 1, 1).toLocaleString("en-US", { month: "short" });
    if (total === 0) {
      rows.push(`<div class="year-plot dormant"><span class="plot-month">${monthLabel}</span><span class="plot-blooms"></span><span class="plot-count">·</span></div>`);
      continue;
    }
    const blooms = pillars.map((p) => {
      const c = monthEntries.filter((e) => e.pillar === p.id).length;
      if (c === 0) return "";
      const scale = (0.6 + Math.min(c, 8) / 8 * 0.7).toFixed(2);
      return `<span class="plot-bloom" style="--pb:${scale}">${memoryBloomSVG(p.color)}</span>`;
    }).join("");
    rows.push(`<button type="button" class="year-plot" data-month="${mk}" style="--mood:${moodColor}" aria-label="${monthLabel} · ${total}">
      <span class="plot-month">${monthLabel}</span>
      <span class="plot-blooms">${blooms}</span>
      <span class="plot-count">${total}</span>
    </button>`);
  }
  garden.innerHTML = rows.join("");

  garden.querySelectorAll(".year-plot[data-month]").forEach((btn) => {
    btn.addEventListener("click", () => {
      garden.querySelectorAll(".year-plot.active").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderYearReveal(btn.dataset.month);
    });
  });
}

function renderYearReveal(monthKey) {
  const reveal = document.getElementById("yearReveal");
  if (!reveal) return;
  const monthEntries = entries.filter((e) => e.date.startsWith(monthKey));
  const note = appData.monthlyReviews.find((r) => r.monthKey === monthKey)?.content?.trim();
  const ranked = pillars
    .map((p) => ({ p, c: monthEntries.filter((e) => e.pillar === p.id).length }))
    .filter((x) => x.c > 0)
    .sort((a, b) => b.c - a.c);
  const lead = ranked[0];
  const leadColor = lead ? lead.p.color : "var(--leaf)";
  const days = new Set(monthEntries.map((e) => e.date)).size;
  const [y, m] = monthKey.split("-");
  const label = currentLang === "zh"
    ? `${y} 年 ${parseInt(m, 10)} 月`
    : `${new Date(2020, parseInt(m, 10) - 1, 1).toLocaleString("en-US", { month: "long" })} ${y}`;
  const body = note
    ? escapeHtml(note)
    : (currentLang === "zh"
      ? `這個月留下 ${days} 天、${monthEntries.length} 個片刻${lead ? `，最常回到「${localize(lead.p.name)}」` : ""}。`
      : `${days} days and ${monthEntries.length} traces${lead ? `, most often ${localize(lead.p.name)}` : ""}.`);
  reveal.hidden = false;
  reveal.style.setProperty("--bloom", leadColor);
  reveal.classList.remove("show");
  void reveal.offsetWidth;
  reveal.classList.add("show");
  const tag = note ? (currentLang === "zh" ? " · 收斂" : " · note") : "";
  reveal.innerHTML = `
    <span class="reveal-meta"><span class="reveal-dot" style="background:${leadColor}"></span>${label}${tag}</span>
    <p class="reveal-text">${body}</p>
  `;
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

  const weekly = [...appData.weeklyReviews].filter((r) => (r.content || "").trim())
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate));
  if (weekly.length) {
    lines.push(`# 每週回顧`, "");
    let currentWeek = "";
    weekly.forEach((r) => {
      if (r.weekStartDate !== currentWeek) {
        currentWeek = r.weekStartDate;
        lines.push(`## ${r.weekStartDate} 那週`, "");
      }
      const pillar = pillars.find((p) => p.id === r.pillar) || pillars[0];
      lines.push(`- **${localize(pillar.name)}**：${r.content}`);
    });
    lines.push("");
  }

  const monthly = [...appData.monthlyReviews].filter((r) => (r.content || "").trim())
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  if (monthly.length) {
    lines.push(`# 月度回顧`, "");
    monthly.forEach((r) => lines.push(`## ${r.monthKey}`, "", r.content, ""));
  }

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
    weeklyReviews: appData.weeklyReviews,
    monthlyReviews: appData.monthlyReviews
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
      appData.monthlyReviews = mergeById(appData.monthlyReviews, (payload.monthlyReviews || []).map(normalizeMonthlyReview).filter(Boolean));
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

function initGoogleDriveAuth() {
  if (!googleClientId) {
    setSyncConfigStatus("尚未設定 Google OAuth Client ID。");
    setCloudStatus("請先把 Google Web Client ID 寫入 script.js，才能啟用 Drive 同步。");
    setSyncState("offline");
    return;
  }

  if (!window.google?.accounts?.oauth2) {
    if (googleInitAttempts < 20) {
      googleInitAttempts += 1;
      setTimeout(initGoogleDriveAuth, 150);
      return;
    }
    setSyncConfigStatus("Google Identity Services 尚未載入，請確認網路後重新整理。");
    return;
  }

  googleTokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: googleClientId,
    scope: googleDriveScope,
    callback: handleGoogleToken
  });
  if (hasStoredGoogleConnection()) {
    restoreGoogleDriveSession("init");
    return;
  }
  renderSignedOutSyncState();
}

async function handleGoogleToken(response) {
  clearGoogleAuthWatch();
  if (response.error) {
    handleGoogleAuthError(response.error);
    return;
  }
  googleAccessToken = response.access_token;
  setSyncState("connecting");
  await loadGoogleUser();
  updateAuthUi();
  syncNow();
}

async function signInWithGoogle() {
  requestGoogleAccessToken({ interactive: true });
}

function requestGoogleAccessToken({ interactive = false } = {}) {
  if (!googleClientId) {
    setAuthStatus("尚未設定 Google OAuth Client ID。");
    return;
  }
  if (!googleTokenClient) {
    initGoogleDriveAuth();
  }
  if (!googleTokenClient) return;
  googleAuthMode = interactive ? "interactive" : "silent";
  setSyncState("connecting");
  setAuthStatus(interactive ? "正在開啟 Google 登入…" : getRememberedGoogleText());
  setCloudStatus(interactive ? "完成 Google 授權後，會自動同步一次。" : "正在恢復 Google Drive 連線…");
  if (interactive) startGoogleAuthWatch();
  googleTokenClient.requestAccessToken({ prompt: getGooglePrompt(interactive) });
}

function getGooglePrompt(interactive) {
  if (!interactive) return "";
  return hasStoredGoogleConnection() ? "" : "consent";
}

function startGoogleAuthWatch() {
  clearGoogleAuthWatch();
  googleAuthWatchTimer = window.setTimeout(() => {
    if (googleAccessToken || currentUser) return;
    setSyncState("error");
    setAuthStatus(lastGoogleEmail ? `上次連結：${lastGoogleEmail}` : "尚未登入。");
    setSyncConfigStatus("Google 授權被擋住。");
    setCloudStatus("如果跳出 Authorization Error，請檢查 Google Cloud OAuth 設定後再重新連結。");
  }, 9000);
}

function clearGoogleAuthWatch() {
  if (!googleAuthWatchTimer) return;
  window.clearTimeout(googleAuthWatchTimer);
  googleAuthWatchTimer = null;
}

function hasStoredGoogleConnection() {
  return localStorage.getItem(googleConnectedKey) === "true" || Boolean(lastGoogleEmail);
}

function getRememberedGoogleText() {
  return lastGoogleEmail ? `上次連結：${lastGoogleEmail}` : "已記住 Google Drive 連結。";
}

function restoreGoogleDriveSession(reason = "manual") {
  if (!hasStoredGoogleConnection()) {
    renderSignedOutSyncState();
    return;
  }

  if (lastGoogleEmail && !currentUser) {
    currentUser = { id: "remembered-google-user", email: lastGoogleEmail };
    updateAuthUi();
  }

  setSyncConfigStatus("Google Drive 已連結。");
  setAuthStatus(getRememberedGoogleText());

  if (googleAccessToken && currentUser) {
    if (reason !== "init") syncNow();
    return;
  }

  setCloudStatus("正在恢復 Google Drive 連線…");
  requestGoogleAccessToken({ interactive: false });
}

function renderSignedOutSyncState() {
  currentUser = null;
  setSyncConfigStatus("還沒連結 Google Drive。");
  setCloudStatus("連結一次後，Mac / iPhone / iPad 會自動合併同步。");
  updateAuthUi();
}

function handleGoogleAuthError(error) {
  const silent = googleAuthMode === "silent";
  googleAccessToken = "";
  if (silent && hasStoredGoogleConnection()) {
    setSyncState("reconnect");
    currentUser = null;
    setAuthStatus(getRememberedGoogleText());
    setSyncConfigStatus("Google Drive 已連結，需要重新授權。");
    setCloudStatus("Google 登入狀態過期了。按「重新連結」後會自動同步一次。");
    renderSyncCta();
    return;
  }
  setSyncState("error");
  setAuthStatus("Google 登入沒有完成。");
  setCloudStatus("請再試一次，或確認瀏覽器沒有阻擋 Google 登入視窗。");
}

async function loadGoogleUser() {
  try {
    const profile = await driveFetch("https://www.googleapis.com/oauth2/v3/userinfo");
    currentUser = {
      id: profile.sub,
      email: profile.email || profile.sub
    };
    lastGoogleEmail = currentUser.email;
    localStorage.setItem("growth-compass-google-email", lastGoogleEmail);
    localStorage.setItem(googleConnectedKey, "true");
  } catch {
    currentUser = { id: "google-user", email: lastGoogleEmail || "Google 已登入" };
    localStorage.setItem(googleConnectedKey, "true");
  }
}

async function signOut() {
  if (googleAccessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(googleAccessToken);
  }
  clearGoogleAuthWatch();
  googleAccessToken = "";
  currentUser = null;
  lastGoogleEmail = "";
  localStorage.removeItem("growth-compass-google-email");
  localStorage.removeItem(googleConnectedKey);
  updateAuthUi();
  setSyncConfigStatus("還沒連結 Google Drive。");
  setCloudStatus("已登出。");
}

function updateAuthUi() {
  const signInButton = document.getElementById("signInGoogle");
  const connectedAccount = document.getElementById("connectedAccount");
  const connectedEmail = document.getElementById("connectedEmail");
  const panel = document.getElementById("syncStatusPanel");
  if (currentUser) {
    const email = currentUser.email || currentUser.id;
    setAuthStatus(`✓ ${email}`);
    if (signInButton) signInButton.hidden = true;
    if (connectedAccount) connectedAccount.hidden = false;
    if (connectedEmail) connectedEmail.textContent = email;
    if (panel) panel.classList.add("is-connected");
    if (["offline", "reconnect", "error"].includes(syncState)) setSyncState("connecting");
  } else {
    setAuthStatus(currentLang === "zh" ? "尚未登入。" : "Not signed in.");
    if (signInButton) signInButton.hidden = false;
    if (connectedAccount) connectedAccount.hidden = true;
    if (connectedEmail) connectedEmail.textContent = currentLang === "zh" ? "Google 已連結" : "Google connected";
    if (panel) panel.classList.remove("is-connected");
    setSyncState("offline");
  }
  renderSyncCta();
}

function renderSyncPanelState() {
  const panel = document.getElementById("syncStatusPanel");
  if (!panel) return;
  panel.dataset.syncState = syncState;
}

function renderSyncCta() {
  const signInButton = document.getElementById("signInGoogle");
  const syncNowButton = document.getElementById("syncNow");
  const signOutButton = document.getElementById("signOut");
  const connectedAccount = document.getElementById("connectedAccount");
  const panel = document.getElementById("syncStatusPanel");
  const signInLabel = signInButton?.querySelector("[data-i18n='signInGoogle']");
  const isZh = currentLang === "zh";
  const needsReconnect = syncState === "reconnect" || syncState === "error";

  if (signInLabel) {
    signInLabel.textContent = needsReconnect
      ? (isZh ? "重新連結 Google Drive" : "Reconnect Google Drive")
      : translations[currentLang].signInGoogle;
  }

  if (syncNowButton) {
    syncNowButton.textContent = syncState === "syncing"
      ? (isZh ? "同步中..." : "Syncing...")
      : translations[currentLang].syncNow;
    syncNowButton.disabled = syncState === "syncing";
    syncNowButton.hidden = !currentUser;
  }

  if (signInButton) signInButton.hidden = Boolean(currentUser);
  if (signOutButton) signOutButton.hidden = !currentUser;
  if (connectedAccount) connectedAccount.hidden = !currentUser;
  if (panel) panel.classList.toggle("is-connected", Boolean(currentUser));
}

async function syncNow() {
  if (!googleAccessToken || !currentUser) {
    if (hasStoredGoogleConnection()) {
      restoreGoogleDriveSession("sync");
      return;
    }
    setCloudStatus("尚未連結 Google Drive；目前只使用本機紀錄。");
    return;
  }

  try {
    setSyncState("syncing");
    setCloudStatus("正在和 Google Drive 同步…");
    const remoteData = await fetchDriveData();
    if (remoteData) mergeAppData(remoteData);
    await saveDriveData();
    const refreshedData = await fetchDriveData();
    if (refreshedData) mergeAppData(refreshedData);

    renderGarden();
    renderPillarBar();
    renderSidebarStatus();
    renderReview();
    restoreToday();
    const now = new Date();
    lastSyncAt = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    localStorage.setItem("growth-compass-last-sync", lastSyncAt);
    setSyncState("ok");
    const entryWord = currentLang === "zh" ? "筆紀錄" : "entries";
    setSyncConfigStatus("Google Drive 已連結。");
    setCloudStatus(`${currentLang === "zh" ? "Google Drive 同步完成" : "Google Drive sync complete"} · ${entries.length} ${entryWord} · ${lastSyncAt}`);
  } catch (error) {
    const formatted = formatSyncError(error);
    setSyncState(formatted.state);
    if (formatted.state === "reconnect") {
      googleAccessToken = "";
      currentUser = null;
      setAuthStatus(hasStoredGoogleConnection() ? getRememberedGoogleText() : "Google 連線已過期。");
      renderSyncCta();
    }
    setSyncConfigStatus(formatted.title);
    setCloudStatus(formatted.message);
  }
}

async function fetchDriveData() {
  const file = await findDriveFile();
  if (!file) return null;
  driveFileId = file.id;
  localStorage.setItem("growth-compass-drive-file-id", driveFileId);
  const data = await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`);
  return normalizeAppData(data);
}

async function findDriveFile() {
  if (driveFileId) {
    try {
      return await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=id,name,modifiedTime`);
    } catch {
      driveFileId = "";
      localStorage.removeItem("growth-compass-drive-file-id");
    }
  }

  const query = encodeURIComponent(`name='${driveFileName}' and trashed=false`);
  const result = await driveFetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&pageSize=1`);
  return result.files?.[0] || null;
}

async function saveDriveData() {
  const payload = JSON.stringify(buildDrivePayload(), null, 2);
  if (!driveFileId) {
    const metadata = {
      name: driveFileName,
      parents: ["appDataFolder"],
      mimeType: "application/json"
    };
    const boundary = `growth_compass_${Date.now()}`;
    const body = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      payload,
      `--${boundary}--`
    ].join("\r\n");
    const file = await driveFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime", {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    });
    driveFileId = file.id;
    localStorage.setItem("growth-compass-drive-file-id", driveFileId);
    return;
  }

  await driveFetch(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media&fields=id,name,modifiedTime`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: payload
  });
}

function buildDrivePayload() {
  return {
    ...normalizeAppData(appData),
    version: appDataVersion,
    updatedAt: new Date().toISOString()
  };
}

async function driveFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const payload = await response.json();
      message = payload.error?.message || message;
    } catch {
      // Keep the HTTP status when Google returns no JSON body.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

function formatSyncError(error) {
  const raw = String(error?.message || "");
  const lower = raw.toLowerCase();
  const isAuthError = error?.status === 401 || lower.includes("invalid authentication credentials") || lower.includes("oauth 2");
  const isDriveDisabled = lower.includes("api has not been used") || lower.includes("disabled");

  if (isAuthError) {
    return {
      state: "reconnect",
      title: "需要重新連結 Google Drive。",
      message: "這台裝置的 Google 授權過期了。按「重新連結」後會自動再同步一次。"
    };
  }

  if (isDriveDisabled) {
    return {
      state: "error",
      title: "Google Drive API 還沒啟用。",
      message: "Google Cloud 專案需要先啟用 Drive API；啟用後通常等幾分鐘再同步即可。"
    };
  }

  return {
    state: "error",
    title: "這次同步沒有完成。",
    message: "資料仍保留在本機。請稍後再按一次同步。"
  };
}

function mergeAppData(incomingData) {
  const incoming = normalizeAppData(incomingData);
  mergeEntries(incoming.dailyEntries);
  appData.flowItems = mergeById(appData.flowItems, incoming.flowItems);
  appData.weeklyReviews = mergeById(appData.weeklyReviews, incoming.weeklyReviews);
  appData.monthlyReviews = mergeById(appData.monthlyReviews, incoming.monthlyReviews);
  appData.traceCards = mergeById(appData.traceCards, incoming.traceCards);
  saveAppData();
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

async function syncEntry(entry) {
  if (!googleAccessToken || !currentUser) return;
  await syncNow();
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
  const status = document.getElementById("dailyStatus");
  if (status) status.textContent = "本機紀錄已清除。";
  renderGarden();
  renderPillarBar();
  renderReview();
}

init();
