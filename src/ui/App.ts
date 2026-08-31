import { FUNCTION_TABLE } from "../data/functionTable.ts";
import { generateQuiz } from "../quiz/questionGenerator.ts";
import { QuizEngine } from "../quiz/QuizEngine.ts";
import type { QuizMode } from "../quiz/types.ts";
import { renderMenu } from "./menuView.ts";
import { renderAnswerReveal, renderQuestion } from "./quizView.ts";
import { renderResults } from "./resultView.ts";

/** Contrôleur applicatif : gère la navigation entre menu, quiz et résultats. */
export function startApp(container: HTMLElement): void {
  let currentMode: QuizMode | null = null;
  let engine: QuizEngine | null = null;

  function showMenu(): void {
    currentMode = null;
    engine = null;
    renderMenu(container, startQuiz);
  }

  function startQuiz(mode: QuizMode): void {
    currentMode = mode;
    engine = new QuizEngine(generateQuiz(mode, FUNCTION_TABLE));
    renderQuestion(container, engine, handleAnswer);
  }

  function handleAnswer(entryId: string): void {
    if (engine === null) return;
    const answered = engine.answer(entryId);
    renderAnswerReveal(container, engine, answered, handleNext);
  }

  function handleNext(): void {
    if (engine === null) return;
    if (engine.isFinished) {
      renderResults(container, engine, retry, showMenu);
    } else {
      renderQuestion(container, engine, handleAnswer);
    }
  }

  function retry(): void {
    if (currentMode === null) return;
    startQuiz(currentMode);
  }

  showMenu();
}
