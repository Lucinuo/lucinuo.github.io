(function () {
  "use strict";

  const Data = window.BearingData;
  if (!Data) return;

  const googleClientId = "278079408254-7qv6codp91vp7sfjc5hin55el1c4ob9h.apps.googleusercontent.com";
  const googleDriveScope = "openid email profile https://www.googleapis.com/auth/drive.appdata";
  const driveFileName = "bearing-data.json";
  const legacyDriveFileName = "growth-compass-data.json";
  const keys = {
    onboarded: "bearing-onboarded",
    googleConnected: "bearing-google-connected",
    driveFileId: "bearing-drive-file-id",
    lastSync: "bearing-last-sync",
    googleEmail: "bearing-google-email"
  };
  const legacyKeys = {
    googleConnected: "growth-compass-google-connected",
    driveFileId: "growth-compass-drive-file-id",
    lastSync: "growth-compass-last-sync",
    googleEmail: "growth-compass-google-email"
  };

  let appData;
  let pendingImport = null;
  let googleTokenClient = null;
  let googleAccessToken = "";
  let currentUser = null;
  let driveFileId = "";
  let googleInitAttempts = 0;
  let syncState = "offline";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const currentLanguage = () => document.documentElement.dataset.lang === "zh" ? "zh" : "en";
  const t = (en, zh) => currentLanguage() === "zh" ? zh : en;

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  }

  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch { /* Keep the app usable. */ }
  }

  function migratePreference(newKey, oldKey) {
    const current = safeGet(newKey);
    const legacy = safeGet(oldKey);
    if (current === null && legacy !== null) safeSet(newKey, legacy);
  }

  Object.keys(legacyKeys).forEach((name) => migratePreference(keys[name], legacyKeys[name]));
  driveFileId = safeGet(keys.driveFileId) || "";

  try {
    const loaded = Data.readStoredData(localStorage);
    appData = loaded.data;
    if (loaded.migrated) appData = Data.writeData(localStorage, appData);
  } catch {
    appData = Data.createEmptyData();
  }

  function writeAppData() {
    try {
      appData = Data.writeData(localStorage, appData);
      return true;
    } catch {
      setFlowFeedback(t("This browser could not save the record.", "這個瀏覽器目前無法保存紀錄。"), true);
      return false;
    }
  }

  function createId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function showIntro() {
    $("#bearingIntro").hidden = false;
    $("#bearingWorkspace").hidden = true;
  }

  function showWorkspace() {
    safeSet(keys.onboarded, "true");
    $("#bearingIntro").hidden = true;
    $("#bearingWorkspace").hidden = false;
    renderAll();
  }

  function setActiveView(viewName) {
    $$(".app-tab").forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.view === viewName)));
    $$(".app-view").forEach((view) => { view.hidden = view.id !== `view-${viewName}`; });
    if (viewName === "archive") renderArchive();
    if (viewName === "reflect") renderDirections();
    if (viewName === "data") renderDataState();
  }

  function setFlowStep(step) {
    $$(".flow-step").forEach((panel) => { panel.hidden = Number(panel.dataset.step) !== step; });
    const target = $(`.flow-step[data-step="${step}"] textarea`);
    if (target) target.focus();
  }

  function validateStep(step) {
    const field = $(`.flow-step[data-step="${step}"] textarea`);
    if (!field || field.value.trim()) return true;
    field.setCustomValidity(t("Write one sentence before continuing.", "先留下一句話，再繼續。"));
    field.reportValidity();
    field.addEventListener("input", () => field.setCustomValidity(""), { once: true });
    return false;
  }

  function latestObservation() {
    return [...appData.observations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null;
  }

  function currentBearing() {
    const observation = latestObservation();
    if (!observation) return null;
    const priority = [...appData.priorities].filter((item) => item.observationId === observation.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null;
    const nextMove = priority ? [...appData.nextMoves].filter((item) => item.priorityId === priority.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null : null;
    return { observation, priority, nextMove };
  }

  function resetFlow() {
    $("#observation").value = "";
    $("#priority").value = "";
    $("#nextMove").value = "";
    $("#currentSummary").hidden = true;
    $("#bearingFlow").hidden = false;
    setFlowStep(0);
    setFlowFeedback("");
  }

  function renderCurrent() {
    const bearing = currentBearing();
    const summary = $("#currentSummary");
    const flow = $("#bearingFlow");
    const legacyNotice = $("#legacyNotice");

    if (appData.legacyImport) {
      legacyNotice.hidden = false;
      legacyNotice.textContent = t("Your previous records are safe and remain available in Archive.", "你先前的紀錄已安全保留，可在「紀錄」中查看。" );
    } else {
      legacyNotice.hidden = true;
    }

    if (!bearing) {
      summary.hidden = true;
      flow.hidden = false;
      return;
    }

    $("#summaryObservation").textContent = bearing.observation.content;
    $("#summaryPriority").textContent = bearing.priority?.content || t("Not defined yet.", "尚未形成。" );
    $("#summaryMove").textContent = bearing.nextMove?.content || t("Not defined yet.", "尚未形成。" );
    summary.hidden = false;
    flow.hidden = true;
  }

  function setFlowFeedback(message, isError = false) {
    const feedback = $("#flowFeedback");
    feedback.textContent = message;
    feedback.style.color = isError ? "var(--color-error)" : "var(--color-accent)";
  }

  function saveBearing(event) {
    event.preventDefault();
    if (!validateStep(2)) return;
    const observationText = $("#observation").value.trim();
    const priorityText = $("#priority").value.trim();
    const nextMoveText = $("#nextMove").value.trim();
    if (!observationText || !priorityText || !nextMoveText) return;

    const timestamp = new Date().toISOString();
    const observationId = createId("observation");
    const priorityId = createId("priority");
    appData.observations.unshift({ id: observationId, date: localDateKey(), content: observationText, createdAt: timestamp, updatedAt: timestamp });
    appData.priorities.unshift({ id: priorityId, observationId, content: priorityText, createdAt: timestamp, updatedAt: timestamp });
    appData.nextMoves.unshift({ id: createId("move"), priorityId, content: nextMoveText, status: "open", createdAt: timestamp, updatedAt: timestamp });
    if (!writeAppData()) return;
    renderAll();
    setFlowFeedback(t("Your bearing is saved.", "這次方向已保存。"));
    if (googleAccessToken) syncNow();
  }

  function renderStorageState() {
    const lastSync = safeGet(keys.lastSync);
    const parts = [Data.hasMeaningfulData(appData)
      ? t("Records saved on this device", "紀錄保存在此裝置")
      : t("Saved on this device", "保存在此裝置")];
    if (lastSync) parts.push(t(`Last synced ${lastSync}`, `上次同步 ${lastSync}`));
    $("#storageState").textContent = parts.join(" · ");
  }

  function saveDirection(event) {
    event.preventDefault();
    const field = $("#directionNote");
    const content = field.value.trim();
    if (!content) {
      field.setCustomValidity(t("Write the change you noticed.", "先寫下你注意到的改變。"));
      field.reportValidity();
      field.addEventListener("input", () => field.setCustomValidity(""), { once: true });
      return;
    }
    const timestamp = new Date().toISOString();
    appData.directionNotes.unshift({ id: createId("direction"), periodStart: localDateKey(), content, createdAt: timestamp, updatedAt: timestamp });
    if (!writeAppData()) return;
    field.value = "";
    $("#reflectFeedback").textContent = t("Direction note saved.", "方向筆記已保存。" );
    renderDirections();
    renderStorageState();
    if (googleAccessToken) syncNow();
  }

  function createArchiveItem(date, primary, secondary) {
    const article = document.createElement("article");
    article.className = "archive-item";
    const dateNode = document.createElement("div");
    dateNode.className = "archive-date";
    dateNode.textContent = date || "—";
    const content = document.createElement("div");
    content.className = "archive-content";
    const primaryNode = document.createElement("p");
    primaryNode.textContent = primary;
    content.appendChild(primaryNode);
    if (secondary) {
      const secondaryNode = document.createElement("p");
      secondaryNode.textContent = secondary;
      content.appendChild(secondaryNode);
    }
    article.append(dateNode, content);
    return article;
  }

  function renderDirections() {
    const list = $("#directionList");
    list.replaceChildren();
    const notes = [...appData.directionNotes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12);
    if (!notes.length) {
      list.appendChild(createArchiveItem("—", t("No direction notes yet.", "還沒有方向筆記。"), t("Use reflection only when comparison is useful.", "只在比較真正有幫助時使用反思。")));
      return;
    }
    notes.forEach((note) => list.appendChild(createArchiveItem(note.periodStart, note.content, "")));
  }

  function renderArchive() {
    const list = $("#archiveList");
    list.replaceChildren();
    const items = [];
    [...appData.observations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).forEach((observation) => {
      const priority = appData.priorities.find((item) => item.observationId === observation.id);
      const move = priority ? appData.nextMoves.find((item) => item.priorityId === priority.id) : null;
      const secondary = [priority?.content, move?.content].filter(Boolean).join(" → ");
      items.push({ date: observation.date, primary: observation.content, secondary });
    });

    const legacy = appData.legacyImport?.raw || {};
    (legacy.dailyEntries || []).forEach((entry) => {
      const text = String(entry.reusableTrace || entry.note || "").trim();
      if (text) items.push({ date: entry.date || "—", primary: text, secondary: t("Previous record · original category preserved", "先前紀錄 · 原始分類已保留") });
    });
    (legacy.weeklyReviews || []).forEach((entry) => {
      const text = String(entry.content || "").trim();
      if (text) items.push({ date: entry.weekStartDate || "—", primary: text, secondary: t("Previous reflection", "先前回顧") });
    });
    (legacy.monthlyReviews || []).forEach((entry) => {
      const text = String(entry.content || "").trim();
      if (text) items.push({ date: entry.monthKey || "—", primary: text, secondary: t("Previous monthly reflection", "先前月度回顧") });
    });
    items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    $("#archiveSummary").textContent = items.length
      ? t(
          items.length === 1
            ? "1 record is available."
            : `${items.length} records are available. Recent records appear first.`,
          `共有 ${items.length} 筆紀錄，最近的內容優先顯示。`
        )
      : t("No records yet. Begin with what is true now.", "還沒有紀錄，從現在真實發生的事開始。" );
    items.slice(0, 60).forEach((item) => list.appendChild(createArchiveItem(item.date, item.primary, item.secondary)));
  }

  function renderAll() {
    renderCurrent();
    renderDirections();
    renderArchive();
    renderStorageState();
    renderDataState();
    applyLocalizedPlaceholders();
  }

  function applyLocalizedPlaceholders() {
    $("#observation").placeholder = t("One honest observation.", "留下一個誠實的觀察。" );
    $("#priority").placeholder = t("Choose one thing.", "只選一件事。" );
    $("#nextMove").placeholder = t("Make it small enough to begin.", "讓它小到可以開始。" );
    $("#directionNote").placeholder = t("Name the change, then the direction it suggests.", "先寫下改變，再寫它指向的方向。" );
  }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const payload = { app: "Bearing", version: Data.VERSION, exportedAt: new Date().toISOString(), ...appData };
    downloadText(`bearing-${localDateKey()}.json`, JSON.stringify(payload, null, 2), "application/json");
  }

  function exportMarkdown() {
    const lines = ["# Bearing Reflection Export", "", `${t("Exported", "匯出時間")}：${new Date().toLocaleString(currentLanguage() === "zh" ? "zh-Hant" : "en-US")}`, ""];
    [...appData.observations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).forEach((observation) => {
      const priority = appData.priorities.find((item) => item.observationId === observation.id);
      const move = priority ? appData.nextMoves.find((item) => item.priorityId === priority.id) : null;
      lines.push(`## ${observation.date}`, "", `${t("Observation", "現況")}：${observation.content}`);
      if (priority) lines.push(`${t("What matters", "重要之事")}：${priority.content}`);
      if (move) lines.push(`${t("Next move", "下一步")}：${move.content}`);
      lines.push("");
    });
    if (appData.directionNotes.length) {
      lines.push(`# ${t("Direction notes", "方向筆記")}`, "");
      appData.directionNotes.forEach((note) => lines.push(`## ${note.periodStart}`, "", note.content, ""));
    }
    const legacy = appData.legacyImport?.raw;
    if (legacy?.dailyEntries?.length) {
      lines.push(`# ${t("Previous compatible records", "先前相容紀錄")}`, "");
      legacy.dailyEntries.forEach((entry) => lines.push(`## ${entry.date || "—"}`, "", String(entry.reusableTrace || entry.note || ""), ""));
    }
    downloadText(`bearing-${localDateKey()}.md`, lines.join("\n"), "text/markdown;charset=utf-8");
  }

  function previewImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        pendingImport = JSON.parse(String(reader.result));
        const preview = Data.mergeData(Data.createEmptyData(), pendingImport);
        const count = Data.recordCount(preview);
        $("#importSummary").textContent = t(`This backup contains ${count} compatible records. Your current records will be merged, not replaced.`, `這份備份包含 ${count} 筆相容紀錄；目前資料會合併，不會被整批覆蓋。`);
        $("#confirmImport").hidden = false;
        $("#importPreview").hidden = false;
      } catch {
        pendingImport = null;
        $("#importPreview").hidden = false;
        $("#importSummary").textContent = t("This file is not a valid Bearing backup. Nothing was imported.", "這不是有效的 Bearing 備份，沒有匯入任何內容。" );
        $("#confirmImport").hidden = true;
      }
    };
    reader.readAsText(file);
  }

  function confirmImport() {
    if (!pendingImport) return;
    appData = Data.mergeData(appData, pendingImport);
    if (!writeAppData()) return;
    pendingImport = null;
    $("#importPreview").hidden = true;
    $("#confirmImport").hidden = false;
    $("#importFile").value = "";
    renderAll();
    if (googleAccessToken) syncNow();
  }

  function clearBearingData() {
    const confirmed = window.confirm(t("Clear the new Bearing records saved on this device? Previous compatibility data will not be deleted.", "確定清除此裝置上的新版 Bearing 紀錄嗎？先前相容資料不會被刪除。"));
    if (!confirmed) return;
    appData = Data.createEmptyData();
    writeAppData();
    resetFlow();
    renderAll();
    setActiveView("current");
  }

  function rememberedGoogleConnection() {
    return safeGet(keys.googleConnected) === "true" || Boolean(safeGet(keys.googleEmail));
  }

  function setSyncState(state, message) {
    syncState = state;
    $("#syncStatus").textContent = message || getDefaultSyncMessage();
    $("#syncNow").hidden = !googleAccessToken;
    $("#signOutGoogle").hidden = !rememberedGoogleConnection() && !googleAccessToken;
    $("#connectGoogle").hidden = Boolean(googleAccessToken);
    $("#syncNow").disabled = state === "syncing";
  }

  function getDefaultSyncMessage() {
    if (syncState === "syncing") return t("Syncing with Google Drive…", "正在與 Google Drive 同步…");
    if (syncState === "ok") return t("Google Drive is up to date.", "Google Drive 已是最新狀態。" );
    if (syncState === "error") return t("Sync did not finish. Your local data is still safe.", "同步未完成，本機資料仍然安全。" );
    if (rememberedGoogleConnection()) return t("Google Drive was connected before. Reconnect when you want to sync.", "此裝置曾連結 Google Drive；需要同步時請重新連結。" );
    return t("Records are currently stored only on this device.", "目前紀錄只保存在此裝置。" );
  }

  function renderDataState() {
    setSyncState(syncState);
    const email = safeGet(keys.googleEmail);
    $("#connectedEmail").hidden = !email;
    $("#connectedEmail").textContent = email ? `${t("Last connected", "上次連結")}：${email}` : "";
  }

  function initGoogleDrive() {
    if (!window.google?.accounts?.oauth2) {
      if (googleInitAttempts < 30) {
        googleInitAttempts += 1;
        window.setTimeout(initGoogleDrive, 200);
      }
      return;
    }
    googleTokenClient = window.google.accounts.oauth2.initTokenClient({ client_id: googleClientId, scope: googleDriveScope, callback: handleGoogleToken });
  }

  function connectGoogle() {
    if (!googleTokenClient) {
      initGoogleDrive();
      setSyncState("offline", t("Google sign-in is still loading. Try again in a moment.", "Google 登入仍在載入，請稍後再試。"));
      return;
    }
    setSyncState("syncing", t("Opening Google authorization…", "正在開啟 Google 授權…"));
    googleTokenClient.requestAccessToken({ prompt: rememberedGoogleConnection() ? "" : "consent" });
  }

  async function handleGoogleToken(response) {
    if (response.error || !response.access_token) {
      setSyncState("error", t("Google authorization did not finish. Your local data was not changed.", "Google 授權未完成，本機資料沒有被更動。"));
      return;
    }
    googleAccessToken = response.access_token;
    try {
      const profile = await driveFetch("https://www.googleapis.com/oauth2/v3/userinfo");
      currentUser = { id: profile.sub, email: profile.email || profile.sub };
      safeSet(keys.googleEmail, currentUser.email);
    } catch {
      currentUser = { id: "google-user", email: safeGet(keys.googleEmail) || "Google Drive" };
    }
    safeSet(keys.googleConnected, "true");
    renderDataState();
    await syncNow();
  }

  async function syncNow() {
    if (!googleAccessToken) {
      connectGoogle();
      return;
    }
    try {
      setSyncState("syncing");
      const remote = await fetchDriveData();
      if (remote) appData = Data.mergeData(appData, remote);
      writeAppData();
      await saveDriveData();
      const stamp = new Date().toLocaleTimeString(currentLanguage() === "zh" ? "zh-Hant" : "en-US", { hour: "2-digit", minute: "2-digit" });
      safeSet(keys.lastSync, stamp);
      setSyncState("ok", t(`Synced at ${stamp}.`, `已於 ${stamp} 完成同步。`));
      renderAll();
    } catch (error) {
      if (error?.status === 401) googleAccessToken = "";
      setSyncState("error", formatSyncError(error));
    }
  }

  async function fetchDriveData() {
    const file = await findDriveFile();
    if (!file) return null;
    driveFileId = file.id;
    safeSet(keys.driveFileId, driveFileId);
    const payload = await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`);
    if (file.name === legacyDriveFileName) {
      try {
        await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=id,name`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: driveFileName }) });
      } catch {
        // Continue with the same file ID. A failed rename must never block access to data.
      }
    }
    return payload;
  }

  async function findDriveFile() {
    if (driveFileId) {
      try {
        return await driveFetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=id,name,modifiedTime`);
      } catch {
        driveFileId = "";
        safeRemove(keys.driveFileId);
      }
    }
    for (const name of [driveFileName, legacyDriveFileName]) {
      const query = encodeURIComponent(`name='${name}' and trashed=false`);
      const result = await driveFetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&pageSize=1`);
      if (result.files?.[0]) return result.files[0];
    }
    return null;
  }

  async function saveDriveData() {
    const payload = JSON.stringify({ app: "Bearing", ...appData, version: Data.VERSION, updatedAt: new Date().toISOString() }, null, 2);
    if (!driveFileId) {
      const metadata = { name: driveFileName, parents: ["appDataFolder"], mimeType: "application/json" };
      const boundary = `bearing_${Date.now()}`;
      const body = [`--${boundary}`, "Content-Type: application/json; charset=UTF-8", "", JSON.stringify(metadata), `--${boundary}`, "Content-Type: application/json; charset=UTF-8", "", payload, `--${boundary}--`].join("\r\n");
      const file = await driveFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name", { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body });
      driveFileId = file.id;
      safeSet(keys.driveFileId, driveFileId);
      return;
    }
    await driveFetch(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media&fields=id,name`, { method: "PATCH", headers: { "Content-Type": "application/json; charset=UTF-8" }, body: payload });
  }

  async function driveFetch(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${googleAccessToken}`, ...(options.headers || {}) } });
    if (!response.ok) {
      let message = `${response.status} ${response.statusText}`;
      try { const payload = await response.json(); message = payload.error?.message || message; } catch { /* Keep status. */ }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  function formatSyncError(error) {
    const raw = String(error?.message || "").toLowerCase();
    if (error?.status === 401 || raw.includes("authentication")) return t("Google authorization expired. Reconnect to sync; local data is still safe.", "Google 授權已過期；重新連結即可同步，本機資料仍然安全。" );
    if (raw.includes("api has not been used") || raw.includes("disabled")) return t("Google Drive API is not available for this project. Local data is still safe.", "這個專案目前無法使用 Google Drive API，本機資料仍然安全。" );
    return t("Sync did not finish. Try again later; local data is still safe.", "同步未完成，請稍後再試；本機資料仍然安全。" );
  }

  function signOutGoogle() {
    if (googleAccessToken && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(googleAccessToken);
    googleAccessToken = "";
    currentUser = null;
    safeRemove(keys.googleConnected);
    safeRemove(keys.googleEmail);
    safeRemove(legacyKeys.googleConnected);
    safeRemove(legacyKeys.googleEmail);
    setSyncState("offline", t("Signed out. Records remain on this device.", "已登出，紀錄仍保留在此裝置。"));
    renderDataState();
  }

  $("#beginBearing").addEventListener("click", showWorkspace);
  $("#bearingFlow").addEventListener("submit", saveBearing);
  $("#updateBearing").addEventListener("click", resetFlow);
  $("#reflectForm").addEventListener("submit", saveDirection);
  $("#exportJson").addEventListener("click", exportJson);
  $("#exportMarkdown").addEventListener("click", exportMarkdown);
  $("#importFile").addEventListener("change", previewImport);
  $("#confirmImport").addEventListener("click", confirmImport);
  $("#clearBearing").addEventListener("click", clearBearingData);
  $("#connectGoogle").addEventListener("click", connectGoogle);
  $("#syncNow").addEventListener("click", syncNow);
  $("#signOutGoogle").addEventListener("click", signOutGoogle);
  $$(".app-tab").forEach((tab) => tab.addEventListener("click", () => setActiveView(tab.dataset.view)));
  $$('[data-next-step]').forEach((button) => button.addEventListener("click", () => { const current = Number(button.closest(".flow-step").dataset.step); if (validateStep(current)) setFlowStep(Number(button.dataset.nextStep)); }));
  $$('[data-previous-step]').forEach((button) => button.addEventListener("click", () => setFlowStep(Number(button.dataset.previousStep))));

  document.addEventListener("lucinuo:language", () => renderAll());

  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
  initGoogleDrive();
  if (Data.hasMeaningfulData(appData) || safeGet(keys.onboarded) === "true") showWorkspace(); else showIntro();
})();
