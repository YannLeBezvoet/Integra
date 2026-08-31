import type { QuizLevel } from "../quiz/types.ts";
import { clearChildren, el } from "./dom.ts";

interface LevelOption {
  readonly level: QuizLevel;
  readonly title: string;
  readonly description: string;
}

const LEVEL_OPTIONS: readonly LevelOption[] = [
  {
    level: "qcm",
    title: "Niveau 1 — QCM",
    description: "Choisissez la bonne réponse parmi 4 propositions.",
  },
  {
    level: "free-input",
    title: "Niveau 2 — Saisie libre",
    description: "Écrivez vous-même la réponse, avec fractions, racines et exposants.",
  },
];

export function renderLevelMenu(container: HTMLElement, onSelectLevel: (level: QuizLevel) => void): void {
  clearChildren(container);

  const menu = el("div", { className: "menu" }, [
    el("p", { className: "menu-subtitle", textContent: "Choisissez un niveau pour commencer." }),
    el(
      "div",
      { className: "mode-list" },
      LEVEL_OPTIONS.map((option) =>
        el("button", { className: "mode-card", type: "button" }, [
          el("h2", { textContent: option.title }),
          el("p", { textContent: option.description }),
        ]),
      ),
    ),
  ]);

  const buttons = menu.querySelectorAll<HTMLButtonElement>(".mode-card");
  buttons.forEach((button, index) => {
    const option = LEVEL_OPTIONS[index];
    if (option === undefined) return;
    button.addEventListener("click", () => onSelectLevel(option.level));
  });

  container.append(menu);
}
