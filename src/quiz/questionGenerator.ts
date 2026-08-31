import type { FunctionEntry } from "../data/functionTable.ts";
import { type MathNode, renderMathHtml } from "../data/mathNode.ts";
import { pickRandomUnique, shuffle } from "../utils/random.ts";
import type { QuestionKind, QuizChoice, QuizMode, QuizQuestion } from "./types.ts";

const CHOICES_PER_QUESTION = 4;

function nodeFor(entry: FunctionEntry, kind: QuestionKind): MathNode {
  return kind === "derivative" ? entry.derivativeNode : entry.primitiveNode;
}

function noteFor(entry: FunctionEntry, kind: QuestionKind): string | undefined {
  return kind === "derivative" ? entry.derivativeNote : entry.primitiveNote;
}

function buildQuestion(
  entry: FunctionEntry,
  kind: QuestionKind,
  table: readonly FunctionEntry[],
): QuizQuestion {
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
    entryId: entry.id,
    kind,
    promptHtml: renderMathHtml(entry.functionNode),
    ...(note !== undefined ? { note } : {}),
    choices: shuffle([correctChoice, ...distractors]),
    correctEntryId: entry.id,
  };
}

export function generateQuiz(mode: QuizMode, table: readonly FunctionEntry[]): QuizQuestion[] {
  const kinds: QuestionKind[] =
    mode === "derivative" ? ["derivative"] : mode === "primitive" ? ["primitive"] : ["derivative", "primitive"];

  const questions = kinds.flatMap((kind) => table.map((entry) => buildQuestion(entry, kind, table)));

  return shuffle(questions);
}
