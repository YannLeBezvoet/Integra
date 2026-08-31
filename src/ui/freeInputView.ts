import type { QuizEngine } from "../quiz/QuizEngine.ts";
import type { AnsweredQuestion, FreeInputQuestion } from "../quiz/types.ts";
import { clearChildren, el, setMathHtml } from "./dom.ts";
import { MathAnswerEditor } from "./mathEditor.ts";
import { renderQuizHeader, renderQuizPrompt } from "./quizChrome.ts";

export function renderFreeInputQuestion(
  container: HTMLElement,
  engine: QuizEngine<FreeInputQuestion>,
  onAnswer: (serializedAnswer: string, answerHtml: string) => void,
): void {
  clearChildren(container);
  const question = engine.currentQuestion();

  function submit(): void {
    onAnswer(editor.getSerializedAnswer(), editor.getAnswerHtml());
  }

  const editorHost = el("div");
  const editor = new MathAnswerEditor(editorHost, submit);

  const submitButton = el("button", { className: "next-button", type: "button", textContent: "Valider" });
  submitButton.addEventListener("click", submit);

  const view = el("div", { className: "quiz" }, [
    renderQuizHeader(engine),
    renderQuizPrompt(question.promptHtml, question.kind),
    editorHost,
    submitButton,
  ]);

  container.append(view);
  editor.focus();
}

export function renderFreeInputReveal(
  container: HTMLElement,
  engine: QuizEngine<FreeInputQuestion>,
  answered: AnsweredQuestion<FreeInputQuestion>,
  submittedAnswerHtml: string,
  onNext: () => void,
): void {
  clearChildren(container);
  const { question } = answered;

  const feedback = el("p", {
    className: answered.isCorrect ? "feedback correct" : "feedback incorrect",
    textContent: answered.isCorrect ? "Bonne réponse !" : "Réponse incorrecte.",
  });

  const yourAnswerSpan = el("span", {
    className: `review-answer ${answered.isCorrect ? "correct" : "incorrect"}`,
  });
  setMathHtml(yourAnswerSpan, submittedAnswerHtml.trim() === "" ? "<em>(vide)</em>" : submittedAnswerHtml);

  const answerRows: HTMLElement[] = [el("p", {}, ["Votre réponse : ", yourAnswerSpan])];

  if (!answered.isCorrect) {
    const correctSpan = el("span", { className: "review-answer correct" });
    setMathHtml(correctSpan, question.answerHtml);
    answerRows.push(el("p", {}, ["Réponse attendue : ", correctSpan]));
  }

  const children: (Node | string)[] = [
    renderQuizHeader(engine),
    renderQuizPrompt(question.promptHtml, question.kind),
    feedback,
    ...answerRows,
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
