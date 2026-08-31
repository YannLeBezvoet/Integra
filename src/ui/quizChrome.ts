import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { QuestionKind, QuizQuestionBase } from "../quiz/types.ts";
import { el, setMathHtml } from "./dom.ts";

const KIND_LABEL: Record<QuestionKind, string> = {
  derivative: "Quelle est la dérivée de f ?",
  primitive: "Quelle est une primitive de f ?",
};

/** En-tête commun aux deux niveaux : numéro de question et score courant. */
export function renderQuizHeader(engine: QuizEngine<QuizQuestionBase>): HTMLElement {
  return el("div", { className: "quiz-header" }, [
    el("span", { textContent: `Question ${engine.currentQuestionNumber} / ${engine.total}` }),
    el("span", { textContent: `Score : ${engine.score}` }),
  ]);
}

/** Affichage de f(x) commun aux deux niveaux. */
export function renderQuizPrompt(promptHtml: string, kind: QuestionKind): HTMLElement {
  const functionLine = el("p", { className: "prompt-function" }, ["f(x) = "]);
  const promptSpan = el("span");
  setMathHtml(promptSpan, promptHtml);
  functionLine.append(promptSpan);

  return el("div", { className: "prompt" }, [
    el("p", { className: "prompt-kind", textContent: KIND_LABEL[kind] }),
    functionLine,
  ]);
}
