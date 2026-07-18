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
