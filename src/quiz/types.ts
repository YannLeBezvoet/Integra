export type QuizLevel = "qcm" | "free-input";

export type QuizMode = "derivative" | "primitive" | "mixed";

/** Le type de question porté par une question donnée (utile en mode "mixed"). */
export type QuestionKind = "derivative" | "primitive";

/**
 * Champs communs aux deux niveaux. `correctAnswer` est la valeur que
 * `QuizEngine.answer` doit recevoir pour valider la question : l'id de l'entrée
 * pour un QCM, la forme canonique de la réponse pour une saisie libre.
 */
export interface QuizQuestionBase {
  readonly kind: QuestionKind;
  readonly promptHtml: string;
  readonly note?: string;
  readonly correctAnswer: string;
  readonly answerHtml: string;
}

export interface QuizChoice {
  readonly entryId: string;
  readonly html: string;
}

export interface QcmQuestion extends QuizQuestionBase {
  readonly choices: readonly QuizChoice[];
}

export type FreeInputQuestion = QuizQuestionBase;

export interface AnsweredQuestion<Q extends QuizQuestionBase> {
  readonly question: Q;
  readonly givenAnswer: string;
  readonly isCorrect: boolean;
}
