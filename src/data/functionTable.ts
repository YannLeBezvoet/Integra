import { frac, type MathNode, pow, seq, sqrt, text } from "./mathNode.ts";

/**
 * Table de référence : pour chaque fonction f, sa dérivée f' et une primitive F,
 * sous forme structurée (voir `mathNode.ts`). Contenu statique, jamais issu d'une
 * saisie utilisateur.
 */
export interface FunctionEntry {
  readonly id: string;
  readonly functionNode: MathNode;
  readonly derivativeNode: MathNode;
  readonly derivativeNote?: string;
  readonly primitiveNode: MathNode;
  readonly primitiveNote?: string;
}

export const FUNCTION_TABLE: readonly FunctionEntry[] = [
  {
    id: "const",
    functionNode: text("k"),
    derivativeNode: text("0"),
    primitiveNode: text("kx"),
  },
  {
    id: "identity",
    functionNode: text("x"),
    derivativeNode: text("1"),
    primitiveNode: frac(pow("x", "2"), "2"),
  },
  {
    id: "power",
    functionNode: pow("x", "n"),
    derivativeNode: seq(text("n·"), pow("x", "n−1")),
    primitiveNode: frac(pow("x", "n+1"), "n+1"),
    primitiveNote: "n ≠ −1",
  },
  {
    id: "inverse",
    functionNode: frac("1", "x"),
    derivativeNode: frac("−1", pow("x", "2")),
    primitiveNode: text("ln|x|"),
  },
  {
    id: "sqrt",
    functionNode: sqrt("x"),
    derivativeNode: frac("1", seq(text("2"), sqrt("x"))),
    primitiveNode: seq(frac("2", "3"), pow("x", "3/2")),
  },
  {
    id: "exp",
    functionNode: pow("e", "x"),
    derivativeNode: pow("e", "x"),
    primitiveNode: pow("e", "x"),
  },
  {
    id: "expA",
    functionNode: pow("a", "x"),
    derivativeNode: seq(pow("a", "x"), text("·ln(a)")),
    primitiveNode: frac(pow("a", "x"), "ln(a)"),
  },
  {
    id: "ln",
    functionNode: text("ln x"),
    derivativeNode: frac("1", "x"),
    primitiveNode: text("x·ln x − x"),
  },
  {
    id: "sin",
    functionNode: text("sin x"),
    derivativeNode: text("cos x"),
    primitiveNode: text("−cos x"),
  },
  {
    id: "cos",
    functionNode: text("cos x"),
    derivativeNode: text("−sin x"),
    primitiveNode: text("sin x"),
  },
  {
    id: "tan",
    functionNode: text("tan x"),
    derivativeNode: seq(
      text("1 + "),
      pow("tan", "2"),
      text("x = "),
      frac("1", seq(pow("cos", "2"), text("x"))),
    ),
    primitiveNode: text("−ln|cos x|"),
  },
];
