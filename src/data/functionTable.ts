/**
 * Table de référence : pour chaque fonction f, sa dérivée f' et une primitive F.
 * Les chaînes contiennent du HTML minimal (sup, ...) pour l'affichage des notations
 * mathématiques ; ce contenu est entièrement statique (pas de saisie utilisateur),
 * il peut donc être injecté sans risque via innerHTML.
 */
export interface FunctionEntry {
  readonly id: string;
  readonly functionHtml: string;
  readonly derivativeHtml: string;
  readonly derivativeNote?: string;
  readonly primitiveHtml: string;
  readonly primitiveNote?: string;
}

export const FUNCTION_TABLE: readonly FunctionEntry[] = [
  {
    id: "const",
    functionHtml: "k",
    derivativeHtml: "0",
    primitiveHtml: "kx",
  },
  {
    id: "identity",
    functionHtml: "x",
    derivativeHtml: "1",
    primitiveHtml: "x<sup>2</sup>/2",
  },
  {
    id: "power",
    functionHtml: "x<sup>n</sup>",
    derivativeHtml: "n·x<sup>n−1</sup>",
    primitiveHtml: "x<sup>n+1</sup>/(n+1)",
    primitiveNote: "n ≠ −1",
  },
  {
    id: "inverse",
    functionHtml: "1/x",
    derivativeHtml: "−1/x<sup>2</sup>",
    primitiveHtml: "ln|x|",
  },
  {
    id: "sqrt",
    functionHtml: "√x",
    derivativeHtml: "1/(2√x)",
    primitiveHtml: "(2/3)x<sup>3/2</sup>",
  },
  {
    id: "exp",
    functionHtml: "e<sup>x</sup>",
    derivativeHtml: "e<sup>x</sup>",
    primitiveHtml: "e<sup>x</sup>",
  },
  {
    id: "expA",
    functionHtml: "a<sup>x</sup>",
    derivativeHtml: "a<sup>x</sup>·ln(a)",
    primitiveHtml: "a<sup>x</sup>/ln(a)",
  },
  {
    id: "ln",
    functionHtml: "ln x",
    derivativeHtml: "1/x",
    primitiveHtml: "x·ln x − x",
  },
  {
    id: "sin",
    functionHtml: "sin x",
    derivativeHtml: "cos x",
    primitiveHtml: "−cos x",
  },
  {
    id: "cos",
    functionHtml: "cos x",
    derivativeHtml: "−sin x",
    primitiveHtml: "sin x",
  },
  {
    id: "tan",
    functionHtml: "tan x",
    derivativeHtml: "1 + tan<sup>2</sup>x = 1/cos<sup>2</sup>x",
    primitiveHtml: "−ln|cos x|",
  },
];
