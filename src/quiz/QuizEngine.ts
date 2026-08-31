import type { AnsweredQuestion, QuizQuestion } from "./types.ts";

/** Encapsule la progression d'une partie : questions, réponses données, score. */
export class QuizEngine {
  private readonly questions: readonly QuizQuestion[];
  private readonly answers: AnsweredQuestion[] = [];
  private currentIndex = 0;

  constructor(questions: readonly QuizQuestion[]) {
    if (questions.length === 0) {
      throw new Error("QuizEngine requiert au moins une question.");
    }
    this.questions = questions;
  }

  get total(): number {
    return this.questions.length;
  }

  get currentQuestionNumber(): number {
    return this.currentIndex + 1;
  }

  get score(): number {
    return this.answers.filter((answer) => answer.isCorrect).length;
  }

  get isFinished(): boolean {
    return this.currentIndex >= this.questions.length;
  }

  get results(): readonly AnsweredQuestion[] {
    return this.answers;
  }

  currentQuestion(): QuizQuestion {
    if (this.isFinished) {
      throw new Error("Le quiz est terminé, il n'y a plus de question courante.");
    }
    return this.questions[this.currentIndex] as QuizQuestion;
  }

  /** Enregistre la réponse à la question courante et avance à la suivante. */
  answer(chosenEntryId: string): AnsweredQuestion {
    const question = this.currentQuestion();
    const answered: AnsweredQuestion = {
      question,
      chosenEntryId,
      isCorrect: chosenEntryId === question.correctEntryId,
    };
    this.answers.push(answered);
    this.currentIndex += 1;
    return answered;
  }
}
