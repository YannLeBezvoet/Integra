import type { AnsweredQuestion, QuizQuestionBase } from "./types.ts";

/**
 * Encapsule la progression d'une partie : questions, réponses données, score.
 * Générique sur le type de question pour servir aussi bien le QCM (niveau 1,
 * réponse = id de l'entrée choisie) que la saisie libre (niveau 2, réponse =
 * forme canonique de ce qui a été écrit) — voir `QuizQuestionBase.correctAnswer`.
 */
export class QuizEngine<Q extends QuizQuestionBase> {
  private readonly questions: readonly Q[];
  private readonly answers: AnsweredQuestion<Q>[] = [];
  private currentIndex = 0;

  constructor(questions: readonly Q[]) {
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

  get results(): readonly AnsweredQuestion<Q>[] {
    return this.answers;
  }

  currentQuestion(): Q {
    if (this.isFinished) {
      throw new Error("Le quiz est terminé, il n'y a plus de question courante.");
    }
    return this.questions[this.currentIndex] as Q;
  }

  /** Enregistre la réponse à la question courante et avance à la suivante. */
  answer(givenAnswer: string): AnsweredQuestion<Q> {
    const question = this.currentQuestion();
    const answered: AnsweredQuestion<Q> = {
      question,
      givenAnswer,
      isCorrect: givenAnswer === question.correctAnswer,
    };
    this.answers.push(answered);
    this.currentIndex += 1;
    return answered;
  }
}
