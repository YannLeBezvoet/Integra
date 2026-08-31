import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { QuestionKind, QuizQuestionBase } from "../quiz/types.ts";
import { el, setMathHtml } from "./dom.ts";

const KIND_LABEL: Record<QuestionKind, string> = {
  derivative: "Quelle est la dérivée de f ?",
  primitive: "Quelle est une primitive de f ?",
};

/** En-tête commun aux deux niveaux : barre de progression et score courant. */
export function renderQuizHeader(engine: QuizEngine<QuizQuestionBase>): HTMLElement {
  const answered = engine.results.length;
  const track = el("div", { className: "quiz-progress-track" });
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(engine.total));
  track.setAttribute("aria-valuenow", String(answered));
  track.setAttribute("aria-label", `Question ${engine.currentQuestionNumber} sur ${engine.total}`);

  const fill = el("div", { className: "quiz-progress-fill" });
  fill.style.width = `${(answered / engine.total) * 100}%`;
  track.append(fill);

  return el("div", { className: "quiz-progress" }, [
    track,
    el("span", { className: "quiz-score", textContent: `Score : ${engine.score}` }),
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
