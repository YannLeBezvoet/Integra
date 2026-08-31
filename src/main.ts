import { startApp } from "./ui/App.ts";

const container = document.getElementById("app");
if (container === null) {
  throw new Error("Élément #app introuvable dans le document.");
}

startApp(container);
