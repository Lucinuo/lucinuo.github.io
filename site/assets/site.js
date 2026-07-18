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

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === nextTheme));
    });
    setStored(themeKey, nextTheme);
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
    document.dispatchEvent(new CustomEvent("lucinuo:language", { detail: nextLanguage }));
  }

  const initialLanguage = getStored(languageKey) || getStored(legacyLanguageKey) || "en";
  const initialTheme = getStored(themeKey) || getStored(legacyThemeKey) || "light";
  applyLanguage(initialLanguage);
  applyTheme(initialTheme);

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
  });

  const menuButton = document.querySelector("[data-menu-button]");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("is-menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen
        ? document.documentElement.dataset.lang === "zh" ? "關閉" : "Close"
        : document.documentElement.dataset.lang === "zh" ? "選單" : "Menu";
    });

    document.addEventListener("lucinuo:language", () => {
      const isOpen = document.body.classList.contains("is-menu-open");
      menuButton.textContent = isOpen
        ? document.documentElement.dataset.lang === "zh" ? "關閉" : "Close"
        : document.documentElement.dataset.lang === "zh" ? "選單" : "Menu";
    });
  }

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("is-menu-open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  window.LucinuoSite = { applyLanguage, applyTheme, getStored, setStored };
})();
