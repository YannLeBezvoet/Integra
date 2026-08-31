import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { AnsweredQuestion, QcmQuestion } from "../quiz/types.ts";
import { clearChildren, el, setMathHtml } from "./dom.ts";
import { renderQuizHeader, renderQuizPrompt } from "./quizChrome.ts";

export function renderQuestion(
  container: HTMLElement,
  engine: QuizEngine<QcmQuestion>,
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
    renderQuizHeader(engine),
    renderQuizPrompt(question.promptHtml, question.kind),
    el("div", { className: "choices" }, choiceButtons),
  ]);

  container.append(view);
}

export function renderAnswerReveal(
  container: HTMLElement,
  engine: QuizEngine<QcmQuestion>,
  answered: AnsweredQuestion<QcmQuestion>,
  onNext: () => void,
): void {
  clearChildren(container);
  const { question } = answered;

  const choiceButtons = question.choices.map((choice) => {
    const button = el("button", { className: "choice", type: "button", disabled: true });
    setMathHtml(button, choice.html);
    if (choice.entryId === question.correctAnswer) {
      button.classList.add("correct");
    } else if (choice.entryId === answered.givenAnswer) {
      button.classList.add("incorrect");
    }
    return button;
  });

  const feedback = el("p", {
    className: answered.isCorrect ? "feedback correct" : "feedback incorrect",
    textContent: answered.isCorrect ? "Bonne réponse !" : "Réponse incorrecte.",
  });

  const children: (Node | string)[] = [
    renderQuizHeader(engine),
    renderQuizPrompt(question.promptHtml, question.kind),
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
