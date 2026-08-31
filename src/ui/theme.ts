const STORAGE_KEY = "integra-theme";

type Theme = "light" | "dark";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

/**
 * Bascule clair/sombre : suit la préférence système par défaut, et retient un
 * choix explicite dans localStorage une fois que l'utilisateur a cliqué.
 */
export function initThemeToggle(button: HTMLButtonElement): void {
  function effectiveTheme(): Theme {
    return readStoredTheme() ?? systemTheme();
  }

  function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    button.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    const glyph = button.querySelector("span");
    if (glyph !== null) glyph.textContent = theme === "dark" ? "☀" : "☾";
  }

  applyTheme(effectiveTheme());

  button.addEventListener("click", () => {
    const next: Theme = effectiveTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (readStoredTheme() === null) applyTheme(systemTheme());
  });
}
