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

  const scoreDots = el(
    "ul",
    { className: "score-dots" },
    engine.results.map((answer, index) => {
      const status = answer.isCorrect ? "correct" : "incorrect";
      const dot = el("li", { className: `score-dot ${status}` }, [
        el("span", {
          className: "visually-hidden",
          textContent: `Question ${index + 1} : ${answer.isCorrect ? "correcte" : "incorrecte"}`,
        }),
      ]);
      return dot;
    }),
  );

  const mistakeItems = mistakes.map((answer) => {
    const functionSpan = el("span", { className: "review-item-function" });
    setMathHtml(functionSpan, `f(x) = ${answer.question.promptHtml}`);

    const answerSpan = el("span", { className: "review-answer correct" });
    setMathHtml(answerSpan, answer.question.answerHtml);

    return el("li", { className: "review-item" }, [
      functionSpan,
      el("span", { className: "review-item-expected" }, [`${KIND_LABEL[answer.question.kind]} attendue : `, answerSpan]),
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

  const scoreSummary = el("div", { className: "score-summary" }, [
    el("p", { className: "score-summary-numbers" }, [
      el("span", { className: "score-summary-value", textContent: String(engine.score) }),
      el("span", { className: "score-summary-total", textContent: `/ ${engine.total}` }),
    ]),
    el("p", { className: "score-summary-percentage", textContent: `${percentage}% de bonnes réponses` }),
  ]);

  const view = el("div", { className: "results" }, [
    el("h1", { textContent: "Résultats" }),
    scoreSummary,
    scoreDots,
    review,
    el("div", { className: "actions" }, [retryButton, menuButton]),
  ]);

  container.append(view);
}
