export type QuizMode = "derivative" | "primitive" | "mixed";

/** Le type de question porté par une question donnée (utile en mode "mixed"). */
export type QuestionKind = "derivative" | "primitive";

export interface QuizChoice {
  readonly entryId: string;
  readonly html: string;
}

export interface QuizQuestion {
  readonly entryId: string;
  readonly kind: QuestionKind;
  readonly promptHtml: string;
  readonly note?: string;
  readonly choices: readonly QuizChoice[];
  readonly correctEntryId: string;
}

export interface AnsweredQuestion {
  readonly question: QuizQuestion;
  readonly chosenEntryId: string;
  readonly isCorrect: boolean;
}
