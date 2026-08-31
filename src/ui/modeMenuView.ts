import type { QuizMode } from "../quiz/types.ts";
import { clearChildren, el } from "./dom.ts";

interface ModeOption {
  readonly mode: QuizMode;
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

const MODE_OPTIONS: readonly ModeOption[] = [
  {
    mode: "derivative",
    index: "A",
    title: "Dérivées",
    description: "Retrouvez la dérivée f'(x) de chaque fonction f(x).",
  },
  {
    mode: "primitive",
    index: "B",
    title: "Primitives",
    description: "Retrouvez une primitive F(x) de chaque fonction f(x).",
  },
  {
    mode: "mixed",
    index: "C",
    title: "Dérivées & primitives",
    description: "Un quiz qui mélange questions sur les dérivées et sur les primitives.",
  },
];

export function renderModeMenu(
  container: HTMLElement,
  onSelectMode: (mode: QuizMode) => void,
  onBack: () => void,
): void {
  clearChildren(container);

  const menu = el("div", { className: "menu" }, [
    el("p", { className: "menu-subtitle", textContent: "Choisissez un mode de quiz." }),
    el(
      "div",
      { className: "mode-list" },
      MODE_OPTIONS.map((option) =>
        el("button", { className: "mode-card", type: "button" }, [
          el("span", { className: "mode-card-index", textContent: option.index }),
          el("span", { className: "mode-card-body" }, [
            el("h2", { className: "mode-card-title", textContent: option.title }),
            el("p", { className: "mode-card-description", textContent: option.description }),
          ]),
          el("span", { className: "mode-card-arrow", textContent: "→" }),
        ]),
      ),
    ),
  ]);

  menu.querySelectorAll(".mode-card-index, .mode-card-arrow").forEach((span) => {
    span.setAttribute("aria-hidden", "true");
  });

  const buttons = menu.querySelectorAll<HTMLButtonElement>(".mode-card");
  buttons.forEach((button, index) => {
    const option = MODE_OPTIONS[index];
    if (option === undefined) return;
    button.addEventListener("click", () => onSelectMode(option.mode));
  });

  const backButton = el("button", {
    className: "secondary-button",
    type: "button",
    textContent: "← Changer de niveau",
  });
  backButton.addEventListener("click", onBack);
  menu.append(backButton);

  container.append(menu);
}
