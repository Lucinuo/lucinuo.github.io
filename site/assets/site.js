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

  window.LucinuoSite = { applyLanguage, applyTheme, getStored, setStored };
})();
