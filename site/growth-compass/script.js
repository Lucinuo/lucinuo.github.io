const pillars = [
  {
    id: "knowledge",
    name: "知識體系",
    color: "#5577b9",
    copy: "今天有沒有一個概念、paper 或觀點變清楚？",
    prompt: "這週我新增了哪 3 張知識卡？"
  },
  {
    id: "expression",
    name: "有力量的表達",
    color: "#c96f5b",
    copy: "今天有沒有一次把想法說得更清楚？",
    prompt: "這週哪一次表達比以前更清楚？"
  },
  {
    id: "aesthetic",
    name: "審美辨識",
    color: "#c49a45",
    copy: "今天看見了什麼好的圖、簡報、排版或畫面？",
    prompt: "這週看見了什麼美的東西？"
  },
  {
    id: "solitude",
    name: "深度愛好",
    color: "#4f8a73",
    copy: "今天有沒有一段不被外界推著走的安靜時間？",
    prompt: "這週有沒有一段真正安靜、專注、只屬於自己的時間？"
  },
  {
    id: "emotion",
    name: "情緒覺察",
    color: "#7b6598",
    copy: "今天哪個情緒最強烈？它想提醒你什麼？",
    prompt: "這週最常出現的情緒是什麼？它想提醒我什麼？"
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

const storageKey = "lucille-growth-compass-v1";
const supabaseConfigKey = "lucille-growth-compass-supabase-v1";
let selectedPillar = pillars[0].id;
let entries = loadEntries();
let supabaseClient = null;
let currentUser = null;

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate() {
  const date = new Date();
  return new Intl.DateTimeFormat("zh-Hant", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function init() {
  document.getElementById("todayLabel").textContent = formatDate();
  renderTabs();
  renderPillars();
  renderRouter();
  renderBars();
  renderReview();
  restoreToday();

  document.getElementById("saveDaily").addEventListener("click", saveDaily);
  document.getElementById("clearDaily").addEventListener("click", clearDaily);
  document.getElementById("exportMarkdown").addEventListener("click", exportMarkdown);
  document.getElementById("exportJson").addEventListener("click", exportJson);
  document.getElementById("importJson").addEventListener("change", importJson);
  document.getElementById("resetData").addEventListener("click", resetData);
  document.getElementById("saveSupabaseConfig").addEventListener("click", saveSupabaseConfig);
  document.getElementById("clearSupabaseConfig").addEventListener("click", clearSupabaseConfig);
  document.getElementById("sendMagicLink").addEventListener("click", sendMagicLink);
  document.getElementById("signOut").addEventListener("click", signOut);
  document.getElementById("syncNow").addEventListener("click", syncNow);
  initSupabaseFromStorage();
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
        <span class="card-title">${pillar.name}</span>
        <span class="card-copy">${pillar.copy}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      selectedPillar = pillar.id;
      renderPillars();
    });
    grid.appendChild(button);
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
  document.getElementById("routeTitle").textContent = route.place;
  document.getElementById("routeSummary").textContent = route.summary;
  document.getElementById("routePlace").textContent = route.place;
  document.getElementById("routeAvoid").textContent = route.avoid;
  document.getElementById("routeNext").textContent = route.next;
}

function restoreToday() {
  const existing = entries.find((entry) => entry.date === todayKey());
  if (!existing) return;
  selectedPillar = existing.pillar;
  document.getElementById("dailyNote").value = existing.note;
  document.getElementById("dailyStatus").textContent = "今天已經有一筆痕跡，可以修改後重新儲存。";
  renderPillars();
}

function saveDaily() {
  const note = document.getElementById("dailyNote").value.trim();
  if (!note) {
    document.getElementById("dailyStatus").textContent = "先寫一句也可以，空白不會儲存。";
    return;
  }

  const entry = {
    date: todayKey(),
    pillar: selectedPillar,
    note,
    updatedAt: new Date().toISOString()
  };

  entries = entries.filter((item) => item.date !== entry.date);
  entries.unshift(entry);
  saveEntries();
  document.getElementById("dailyStatus").textContent = "已儲存。今天有留下可回收的東西。";
  renderBars();
  renderReview();
  syncEntry(entry);
}

function clearDaily() {
  document.getElementById("dailyNote").value = "";
  document.getElementById("dailyStatus").textContent = "已清空輸入框，尚未改動已儲存紀錄。";
}

function renderBars() {
  const recent = getRecentEntries(7);
  const bars = document.getElementById("pillarBars");
  bars.innerHTML = "";
  const max = Math.max(1, ...pillars.map((pillar) => recent.filter((entry) => entry.pillar === pillar.id).length));

  pillars.forEach((pillar) => {
    const count = recent.filter((entry) => entry.pillar === pillar.id).length;
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <strong>${pillar.name}</strong>
      <span class="bar-track">
        <span class="bar-fill" style="width:${(count / max) * 100}%; background:${pillar.color}"></span>
      </span>
      <span>${count}</span>
    `;
    bars.appendChild(row);
  });
}

function getRecentEntries(days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days + 1);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  return entries.filter((entry) => entry.date >= cutoffKey);
}

function renderReview() {
  const prompts = document.getElementById("reviewPrompts");
  prompts.innerHTML = "";
  pillars.forEach((pillar) => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <p class="entry-meta" style="color:${pillar.color}">${pillar.name}</p>
      <p>${pillar.prompt}</p>
    `;
    prompts.appendChild(card);
  });

  const entriesNode = document.getElementById("entries");
  entriesNode.innerHTML = "";
  if (entries.length === 0) {
    entriesNode.innerHTML = `<p class="helper">還沒有紀錄。先從「今日 5 分鐘」留下一句開始。</p>`;
    return;
  }

  entries.slice(0, 10).forEach((entry) => {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    const card = document.createElement("div");
    card.className = "entry-card";
    card.innerHTML = `
      <p>${entry.note}</p>
      <span class="entry-meta">${entry.date} · ${pillar.name}</span>
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
    `# Lucille Growth Compass Export`,
    ``,
    `匯出時間：${new Date().toLocaleString("zh-Hant")}`,
    ``
  ];

  entries.forEach((entry) => {
    const pillar = pillars.find((item) => item.id === entry.pillar) || pillars[0];
    lines.push(`## ${entry.date} · ${pillar.name}`, "", entry.note, "");
  });

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    alert("已複製 Markdown 到剪貼簿。");
  });
}

function exportJson() {
  const payload = {
    app: "Lucille Growth Compass",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries
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
      const incoming = Array.isArray(payload.entries) ? payload.entries : [];
      const merged = new Map();

      [...entries, ...incoming].forEach((entry) => {
        if (!entry.date || !entry.pillar || !entry.note) return;
        const current = merged.get(entry.date);
        if (!current || (entry.updatedAt || "") > (current.updatedAt || "")) {
          merged.set(entry.date, entry);
        }
      });

      entries = Array.from(merged.values()).sort((a, b) => b.date.localeCompare(a.date));
      saveEntries();
      renderBars();
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

function loadSupabaseConfig() {
  try {
    return JSON.parse(localStorage.getItem(supabaseConfigKey)) || {};
  } catch {
    return {};
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
  document.getElementById("supabaseUrl").value = "";
  document.getElementById("supabaseAnon").value = "";
  setSyncConfigStatus("Supabase 設定已清除。");
  setAuthStatus("尚未登入。");
  setCloudStatus("設定並登入後，會把本機紀錄合併到雲端，也會拉回其他裝置的紀錄。");
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
    setAuthStatus(`已登入：${currentUser.email || currentUser.id}`);
  } else {
    setAuthStatus("尚未登入。");
  }
}

async function syncNow() {
  if (!supabaseClient || !currentUser) {
    setCloudStatus("尚未連上 Supabase 或尚未登入；目前只使用本機紀錄。");
    return;
  }

  setCloudStatus("同步中...");
  const remoteEntries = await fetchRemoteEntries();
  if (remoteEntries === null) return;

  mergeEntries(remoteEntries);
  await pushLocalEntries();
  const refreshedEntries = await fetchRemoteEntries();
  if (refreshedEntries !== null) mergeEntries(refreshedEntries);

  renderBars();
  renderReview();
  restoreToday();
  setCloudStatus(`同步完成。現在共有 ${entries.length} 筆紀錄。`);
}

async function fetchRemoteEntries() {
  const { data, error } = await supabaseClient
    .from("growth_entries")
    .select("entry_date,pillar,note,updated_at")
    .order("entry_date", { ascending: false });

  if (error) {
    setCloudStatus(`讀取雲端失敗：${error.message}`);
    return null;
  }

  return (data || []).map((row) => ({
    date: row.entry_date,
    pillar: row.pillar,
    note: row.note,
    updatedAt: row.updated_at
  }));
}

function mergeEntries(incoming) {
  const merged = new Map();
  [...entries, ...incoming].forEach((entry) => {
    if (!entry.date || !entry.pillar || !entry.note) return;
    const current = merged.get(entry.date);
    if (!current || (entry.updatedAt || "") > (current.updatedAt || "")) {
      merged.set(entry.date, entry);
    }
  });
  entries = Array.from(merged.values()).sort((a, b) => b.date.localeCompare(a.date));
  saveEntries();
}

async function pushLocalEntries() {
  const rows = entries.map((entry) => ({
    id: `${currentUser.id}:${entry.date}`,
    user_id: currentUser.id,
    entry_date: entry.date,
    pillar: entry.pillar,
    note: entry.note,
    updated_at: entry.updatedAt || new Date().toISOString()
  }));

  if (rows.length === 0) return;

  const { error } = await supabaseClient
    .from("growth_entries")
    .upsert(rows, { onConflict: "id" });

  if (error) setCloudStatus(`寫入雲端失敗：${error.message}`);
}

async function syncEntry(entry) {
  if (!supabaseClient || !currentUser) return;
  const row = {
    id: `${currentUser.id}:${entry.date}`,
    user_id: currentUser.id,
    entry_date: entry.date,
    pillar: entry.pillar,
    note: entry.note,
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
  document.getElementById("dailyNote").value = "";
  document.getElementById("dailyStatus").textContent = "本機紀錄已清除。";
  renderBars();
  renderReview();
}

init();
