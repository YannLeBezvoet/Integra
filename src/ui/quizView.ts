import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { AnsweredQuestion, QuestionKind } from "../quiz/types.ts";
import { clearChildren, el, setMathHtml } from "./dom.ts";

const KIND_LABEL: Record<QuestionKind, string> = {
  derivative: "Quelle est la dérivée de f ?",
  primitive: "Quelle est une primitive de f ?",
};

function renderHeader(engine: QuizEngine): HTMLElement {
  return el("div", { className: "quiz-header" }, [
    el("span", { textContent: `Question ${engine.currentQuestionNumber} / ${engine.total}` }),
    el("span", { textContent: `Score : ${engine.score}` }),
  ]);
}

function renderPrompt(promptHtml: string, kind: QuestionKind): HTMLElement {
  const functionLine = el("p", { className: "prompt-function" }, ["f(x) = "]);
  const promptSpan = el("span");
  setMathHtml(promptSpan, promptHtml);
  functionLine.append(promptSpan);

  return el("div", { className: "prompt" }, [
    el("p", { className: "prompt-kind", textContent: KIND_LABEL[kind] }),
    functionLine,
  ]);
}

export function renderQuestion(
  container: HTMLElement,
  engine: QuizEngine,
  onAnswer: (entryId: string) => void,
): void {
  clearChildren(container);
  const question = engine.currentQuestion();

  const choiceButtons = question.choices.map((choice) => {
    const button = el("button", { className: "choice", type: "button" });
    setMathHtml(button, choice.html);
    button.addEventListener("click", () => onAnswer(choice.entryId));
    return button;
  });

  const view = el("div", { className: "quiz" }, [
    renderHeader(engine),
    renderPrompt(question.promptHtml, question.kind),
    el("div", { className: "choices" }, choiceButtons),
  ]);

  container.append(view);
}

export function renderAnswerReveal(
  container: HTMLElement,
  engine: QuizEngine,
  answered: AnsweredQuestion,
  onNext: () => void,
): void {
  clearChildren(container);
  const { question } = answered;

  const choiceButtons = question.choices.map((choice) => {
    const button = el("button", { className: "choice", type: "button", disabled: true });
    setMathHtml(button, choice.html);
    if (choice.entryId === question.correctEntryId) {
      button.classList.add("correct");
    } else if (choice.entryId === answered.chosenEntryId) {
      button.classList.add("incorrect");
    }
    return button;
  });

  const feedback = el("p", {
    className: answered.isCorrect ? "feedback correct" : "feedback incorrect",
    textContent: answered.isCorrect ? "Bonne réponse !" : "Réponse incorrecte.",
  });

  const children: (Node | string)[] = [
    renderHeader(engine),
    renderPrompt(question.promptHtml, question.kind),
    el("div", { className: "choices" }, choiceButtons),
    feedback,
  ];

  if (question.note !== undefined) {
    children.push(el("p", { className: "note", textContent: `Condition : ${question.note}` }));
  }

  const nextButton = el("button", {
    className: "next-button",
    type: "button",
    textContent: engine.isFinished ? "Voir le score" : "Question suivante",
  });
  nextButton.addEventListener("click", onNext);
  children.push(nextButton);

  container.append(el("div", { className: "quiz" }, children));
}
