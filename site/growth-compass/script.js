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

/* ─── Ambient sound (brown noise via Web Audio API) ─── */


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
  renderMonthNote();
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
