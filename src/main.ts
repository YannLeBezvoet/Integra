import { startApp } from "./ui/App.ts";
import { initThemeToggle } from "./ui/theme.ts";

const container = document.getElementById("app");
if (container === null) {
  throw new Error("Élément #app introuvable dans le document.");
}

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle instanceof HTMLButtonElement) {
  initThemeToggle(themeToggle);
}

startApp(container);
