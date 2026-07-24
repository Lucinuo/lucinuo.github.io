(function () {
  const languageKey = "lucinuo-language";
  const legacyLanguageKey = "growth-compass-language";
  const themeKey = "lucinuo-theme";
  const legacyThemeKey = "growth-compass-theme";

  const getStored = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setStored = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The site remains usable when storage is unavailable.
    }
  };

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function updateThemeControls(theme) {
    const language = document.documentElement.dataset.lang === "zh" ? "zh" : "en";
    const nextLabel = theme === "dark"
      ? language === "zh" ? "切換至淺色模式" : "Switch to light mode"
      : language === "zh" ? "切換至深色模式" : "Switch to dark mode";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", nextLabel);
      button.setAttribute("title", nextLabel);
    });
  }

  function applyTheme(theme, { persist = true } = {}) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", nextTheme === "dark" ? "#111411" : "#FBFBFA");
    });
    updateThemeControls(nextTheme);
    if (persist) setStored(themeKey, nextTheme);
    document.dispatchEvent(new CustomEvent("lucinuo:theme", { detail: nextTheme }));
  }

  function applyLanguage(language) {
    const nextLanguage = language === "zh" ? "zh" : "en";
    document.documentElement.dataset.lang = nextLanguage;
    document.documentElement.lang = nextLanguage === "zh" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === nextLanguage));
    });

    const title = document.body.dataset[`title${nextLanguage === "zh" ? "Zh" : "En"}`];
    const description = document.body.dataset[`description${nextLanguage === "zh" ? "Zh" : "En"}`];
    if (title) document.title = title;
    if (description) {
      document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((meta) => {
        meta.setAttribute("content", description);
      });
    }
    document.querySelectorAll('meta[property="og:title"]').forEach((meta) => {
      if (title) meta.setAttribute("content", title);
    });

    setStored(languageKey, nextLanguage);
    updateThemeControls(document.documentElement.dataset.theme || "light");
    document.dispatchEvent(new CustomEvent("lucinuo:language", { detail: nextLanguage }));
  }

  const initialLanguage = getStored(languageKey) || getStored(legacyLanguageKey) || "en";
  const storedTheme = getStored(themeKey) || getStored(legacyThemeKey);
  const initialTheme = storedTheme || (systemTheme.matches ? "dark" : "light");
  applyLanguage(initialLanguage);
  applyTheme(initialTheme, { persist: Boolean(storedTheme) });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  });

  systemTheme.addEventListener("change", (event) => {
    if (!getStored(themeKey) && !getStored(legacyThemeKey)) applyTheme(event.matches ? "dark" : "light", { persist: false });
  });

  const menuButton = document.querySelector("[data-menu-button]");
  if (menuButton) {
    const compactNavigation = window.matchMedia("(max-width: 1080px)");

    const updateMenuButton = () => {
      const isOpen = document.body.classList.contains("is-menu-open");
      const label = isOpen
        ? document.documentElement.dataset.lang === "zh" ? "關閉" : "Close"
        : document.documentElement.dataset.lang === "zh" ? "選單" : "Menu";
      menuButton.textContent = label;
      menuButton.setAttribute("aria-label", label);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      document.body.classList.remove("is-menu-open");
      updateMenuButton();
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      document.body.classList.toggle("is-menu-open");
      updateMenuButton();
    });

    document.addEventListener("lucinuo:language", updateMenuButton);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("is-menu-open")) closeMenu({ restoreFocus: true });
    });
    compactNavigation.addEventListener("change", (event) => {
      if (!event.matches) closeMenu();
    });
    updateMenuButton();

    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // 背景音樂：預設關閉，需使用者點擊才播放（瀏覽器不允許網頁自動出聲）。
  // Lighthouse 與 Phase Shift 有各自的音軌與控制，不載入本檔，因此不會互相干擾。
  const bgmStateKey = "lucinuo-bgm";
  const bgmTimeKey = "lucinuo-bgm-time";
  const themeSwitch = document.querySelector(".theme-switch");

  if (themeSwitch && !document.querySelector("[data-bgm]")) {
    const getSession = (key) => {
      try { return sessionStorage.getItem(key); } catch { return null; }
    };
    const setSession = (key, value) => {
      try { sessionStorage.setItem(key, value); } catch { /* 隱私模式下略過 */ }
    };

    const bgm = document.createElement("audio");
    bgm.dataset.bgm = "";
    bgm.loop = true;
    bgm.preload = "none";
    bgm.src = "/assets/lucinuo-bgm.mp3";
    bgm.volume = 0.22;
    document.body.appendChild(bgm);

    // 多頁式網站換頁會整頁重載，靠 sessionStorage 記住播放位置接續，聽起來才連貫。
    bgm.addEventListener("loadedmetadata", () => {
      const resumeAt = Number(getSession(bgmTimeKey));
      if (resumeAt > 0 && resumeAt < bgm.duration) bgm.currentTime = resumeAt;
    }, { once: true });

    const soundToggle = document.createElement("button");
    soundToggle.className = "theme-toggle sound-toggle";
    soundToggle.type = "button";
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.innerHTML =
      '<svg class="sound-icon-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>' +
      '<svg class="sound-icon-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="m18 9 4 4M22 9l-4 4"/></svg>';
    themeSwitch.insertBefore(soundToggle, themeSwitch.firstChild);

    let soundOn = false;

    function updateSoundControls() {
      const zh = document.documentElement.dataset.lang === "zh";
      const label = soundOn
        ? zh ? "關閉背景音樂" : "Turn background music off"
        : zh ? "播放背景音樂" : "Play background music";
      soundToggle.setAttribute("aria-pressed", String(soundOn));
      soundToggle.setAttribute("aria-label", label);
      soundToggle.setAttribute("title", label);
    }

    function applySound(next) {
      soundOn = Boolean(next);
      if (soundOn) {
        // 換頁後的自動接續可能被瀏覽器擋下，擋下就誠實顯示為關閉，等使用者再點一次。
        bgm.play().catch(() => {
          soundOn = false;
          setSession(bgmStateKey, "off");
          updateSoundControls();
        });
      } else {
        bgm.pause();
      }
      setSession(bgmStateKey, soundOn ? "on" : "off");
      updateSoundControls();
    }

    soundToggle.addEventListener("click", () => applySound(!soundOn));
    document.addEventListener("lucinuo:language", updateSoundControls);
    window.addEventListener("pagehide", () => {
      if (soundOn) setSession(bgmTimeKey, String(bgm.currentTime));
    });

    updateSoundControls();
    if (getSession(bgmStateKey) === "on") applySound(true);
  }

  window.LucinuoSite = { applyLanguage, applyTheme, getStored, setStored };
})();
