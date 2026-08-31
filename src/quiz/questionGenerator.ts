import type { FunctionEntry } from "../data/functionTable.ts";
import { type MathNode, renderMathHtml, serializeMath } from "../data/mathNode.ts";
import { pickRandomUnique, shuffle } from "../utils/random.ts";
import type { FreeInputQuestion, QcmQuestion, QuestionKind, QuizChoice, QuizMode } from "./types.ts";

const CHOICES_PER_QUESTION = 4;

function nodeFor(entry: FunctionEntry, kind: QuestionKind): MathNode {
  return kind === "derivative" ? entry.derivativeNode : entry.primitiveNode;
}

function noteFor(entry: FunctionEntry, kind: QuestionKind): string | undefined {
  return kind === "derivative" ? entry.derivativeNote : entry.primitiveNote;
}

function kindsFor(mode: QuizMode): readonly QuestionKind[] {
  return mode === "derivative" ? ["derivative"] : mode === "primitive" ? ["primitive"] : ["derivative", "primitive"];
}

function buildQcmQuestion(entry: FunctionEntry, kind: QuestionKind, table: readonly FunctionEntry[]): QcmQuestion {
  const correctHtml = renderMathHtml(nodeFor(entry, kind));

  const distractorPool = table
    .filter((candidate) => candidate.id !== entry.id)
    .map((candidate): QuizChoice => ({ entryId: candidate.id, html: renderMathHtml(nodeFor(candidate, kind)) }))
    .filter((choice, index, all) => {
      const isDuplicateOfCorrect = choice.html === correctHtml;
      const isFirstOccurrence = all.findIndex((c) => c.html === choice.html) === index;
      return !isDuplicateOfCorrect && isFirstOccurrence;
    });

  const distractors = pickRandomUnique(distractorPool, CHOICES_PER_QUESTION - 1);
  const correctChoice: QuizChoice = { entryId: entry.id, html: correctHtml };
  const note = noteFor(entry, kind);

  return {
    kind,
    promptHtml: renderMathHtml(entry.functionNode),
    ...(note !== undefined ? { note } : {}),
    choices: shuffle([correctChoice, ...distractors]),
    correctAnswer: entry.id,
    answerHtml: correctHtml,
  };
}

export function generateQcmQuiz(mode: QuizMode, table: readonly FunctionEntry[]): QcmQuestion[] {
  const questions = kindsFor(mode).flatMap((kind) => table.map((entry) => buildQcmQuestion(entry, kind, table)));
  return shuffle(questions);
}

function buildFreeInputQuestion(entry: FunctionEntry, kind: QuestionKind): FreeInputQuestion {
  const node = nodeFor(entry, kind);
  const note = noteFor(entry, kind);

  return {
    kind,
    promptHtml: renderMathHtml(entry.functionNode),
    ...(note !== undefined ? { note } : {}),
    correctAnswer: serializeMath(node),
    answerHtml: renderMathHtml(node),
  };
}

export function generateFreeInputQuiz(mode: QuizMode, table: readonly FunctionEntry[]): FreeInputQuestion[] {
  const questions = kindsFor(mode).flatMap((kind) => table.map((entry) => buildFreeInputQuestion(entry, kind)));
  return shuffle(questions);
}
