/**
 * Représentation structurée d'une expression mathématique simple (texte, fraction,
 * racine, exposant). Sert de source unique pour :
 *  - le rendu HTML (QCM, aperçus, niveau 2) via `renderMathHtml` ;
 *  - la comparaison d'une réponse saisie librement (niveau 2) via `serializeMath`.
 *
 * `renderMathHtml` échappe le texte des feuilles : les nœuds de `functionTable.ts`
 * sont statiques, mais ce rendu est aussi utilisé pour réafficher une saisie
 * utilisateur (niveau 2), qu'il ne faut jamais injecter telle quelle dans le DOM.
 */
export type MathNode =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "seq"; readonly parts: readonly MathNode[] }
  | { readonly kind: "frac"; readonly numerator: MathNode; readonly denominator: MathNode }
  | { readonly kind: "sqrt"; readonly radicand: MathNode }
  | { readonly kind: "exp"; readonly exponent: MathNode };

type MathInput = MathNode | string;

function toNode(input: MathInput): MathNode {
  return typeof input === "string" ? text(input) : input;
}

export function text(value: string): MathNode {
  return { kind: "text", value };
}

export function seq(...parts: readonly MathInput[]): MathNode {
  return { kind: "seq", parts: parts.map(toNode) };
}

export function frac(numerator: MathInput, denominator: MathInput): MathNode {
  return { kind: "frac", numerator: toNode(numerator), denominator: toNode(denominator) };
}

export function sqrt(radicand: MathInput): MathNode {
  return { kind: "sqrt", radicand: toNode(radicand) };
}

export function exp(exponent: MathInput): MathNode {
  return { kind: "exp", exponent: toNode(exponent) };
}

/** Sucre syntaxique pour "base suivie d'un exposant" (ex : x², eˣ). */
export function pow(base: MathInput, exponent: MathInput): MathNode {
  return seq(base, exp(exponent));
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderMathHtml(node: MathNode): string {
  switch (node.kind) {
    case "text":
      return escapeHtml(node.value);
    case "seq":
      return node.parts.map(renderMathHtml).join("");
    case "frac":
      return `<span class="frac"><span class="frac-num">${renderMathHtml(node.numerator)}</span><span class="frac-den">${renderMathHtml(node.denominator)}</span></span>`;
    case "sqrt":
      return `√<span class="sqrt-radicand">${renderMathHtml(node.radicand)}</span>`;
    case "exp":
      return `<sup>${renderMathHtml(node.exponent)}</sup>`;
  }
}

/** Normalise une feuille de texte pour rendre la comparaison tolérante à la saisie. */
function normalizeLeaf(value: string): string {
  return value
    .toLowerCase()
    .replace(/[·*]/g, "")
    .replace(/[−-]/g, "-")
    .replace(/\s+/g, "");
}

/** Sérialise en chaîne canonique comparable, indépendante de la présentation. */
export function serializeMath(node: MathNode): string {
  switch (node.kind) {
    case "text":
      return normalizeLeaf(node.value);
    case "seq":
      return node.parts.map(serializeMath).join("");
    case "frac":
      return `(${serializeMath(node.numerator)})/(${serializeMath(node.denominator)})`;
    case "sqrt":
      return `sqrt(${serializeMath(node.radicand)})`;
    case "exp":
      return `^(${serializeMath(node.exponent)})`;
  }
}
