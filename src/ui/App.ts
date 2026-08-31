import { FUNCTION_TABLE } from "../data/functionTable.ts";
import { generateFreeInputQuiz, generateQcmQuiz } from "../quiz/questionGenerator.ts";
import { QuizEngine } from "../quiz/QuizEngine.ts";
import type { FreeInputQuestion, QcmQuestion, QuizLevel, QuizMode } from "../quiz/types.ts";
import { renderFreeInputQuestion, renderFreeInputReveal } from "./freeInputView.ts";
import { renderLevelMenu } from "./levelMenuView.ts";
import { renderModeMenu } from "./modeMenuView.ts";
import { renderAnswerReveal, renderQuestion } from "./quizView.ts";
import { renderResults } from "./resultView.ts";

/** Contrôleur applicatif : gère la navigation entre niveau, mode, quiz et résultats. */
export function startApp(container: HTMLElement): void {
  let level: QuizLevel | null = null;
  let mode: QuizMode | null = null;
  let qcmEngine: QuizEngine<QcmQuestion> | null = null;
  let freeInputEngine: QuizEngine<FreeInputQuestion> | null = null;

  function showLevelMenu(): void {
    level = null;
    mode = null;
    qcmEngine = null;
    freeInputEngine = null;
    renderLevelMenu(container, selectLevel);
  }

  function showModeMenu(): void {
    renderModeMenu(container, startQuiz, showLevelMenu);
  }

  function selectLevel(selectedLevel: QuizLevel): void {
    level = selectedLevel;
    showModeMenu();
  }

  function startQuiz(selectedMode: QuizMode): void {
    mode = selectedMode;
    if (level === "qcm") {
      qcmEngine = new QuizEngine(generateQcmQuiz(selectedMode, FUNCTION_TABLE));
      freeInputEngine = null;
      renderQuestion(container, qcmEngine, handleQcmAnswer);
    } else {
      freeInputEngine = new QuizEngine(generateFreeInputQuiz(selectedMode, FUNCTION_TABLE));
      qcmEngine = null;
      renderFreeInputQuestion(container, freeInputEngine, handleFreeInputAnswer);
    }
  }

  function handleQcmAnswer(entryId: string): void {
    if (qcmEngine === null) return;
    const answered = qcmEngine.answer(entryId);
    renderAnswerReveal(container, qcmEngine, answered, handleNext);
  }

  function handleFreeInputAnswer(serializedAnswer: string, answerHtml: string): void {
    if (freeInputEngine === null) return;
    const answered = freeInputEngine.answer(serializedAnswer);
    renderFreeInputReveal(container, freeInputEngine, answered, answerHtml, handleNext);
  }

  function handleNext(): void {
    if (qcmEngine !== null) {
      if (qcmEngine.isFinished) {
        renderResults(container, qcmEngine, retry, showModeMenu);
      } else {
        renderQuestion(container, qcmEngine, handleQcmAnswer);
      }
    } else if (freeInputEngine !== null) {
      if (freeInputEngine.isFinished) {
        renderResults(container, freeInputEngine, retry, showModeMenu);
      } else {
        renderFreeInputQuestion(container, freeInputEngine, handleFreeInputAnswer);
      }
    }
  }

  function retry(): void {
    if (mode === null) return;
    startQuiz(mode);
  }

  showLevelMenu();
}
