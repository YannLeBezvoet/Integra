import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { QuizQuestionBase } from "../quiz/types.ts";
import { clearChildren, el, setMathHtml } from "./dom.ts";

const KIND_LABEL = {
  derivative: "dérivée",
  primitive: "primitive",
} as const;

export function renderResults(
  container: HTMLElement,
  engine: QuizEngine<QuizQuestionBase>,
  onRetry: () => void,
  onBackToMenu: () => void,
): void {
  clearChildren(container);

  const percentage = Math.round((engine.score / engine.total) * 100);
  const mistakes = engine.results.filter((answer) => !answer.isCorrect);

  const mistakeItems = mistakes.map((answer) => {
    const functionSpan = el("span", { className: "review-function" });
    setMathHtml(functionSpan, answer.question.promptHtml);

    const answerSpan = el("span", { className: "review-answer correct" });
    setMathHtml(answerSpan, answer.question.answerHtml);

    return el("li", {}, [
      "f(x) = ",
      functionSpan,
      ` — ${KIND_LABEL[answer.question.kind]} attendue : `,
      answerSpan,
    ]);
  });

  const review =
    mistakes.length > 0
      ? el("div", { className: "review" }, [
          el("h3", { textContent: "À revoir" }),
          el("ul", { className: "review-list" }, mistakeItems),
        ])
      : el("p", { className: "feedback correct", textContent: "Sans faute, bravo !" });

  const retryButton = el("button", {
    className: "next-button",
    type: "button",
    textContent: "Rejouer ce mode",
  });
  retryButton.addEventListener("click", onRetry);

  const menuButton = el("button", {
    className: "secondary-button",
    type: "button",
    textContent: "Retour au menu",
  });
  menuButton.addEventListener("click", onBackToMenu);

  const view = el("div", { className: "results" }, [
    el("h1", { textContent: "Résultats" }),
    el("p", { className: "score-summary", textContent: `${engine.score} / ${engine.total} (${percentage}%)` }),
    review,
    el("div", { className: "actions" }, [retryButton, menuButton]),
  ]);

  container.append(view);
}
