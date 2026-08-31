import { exp, frac, type MathNode, renderMathHtml, seq, serializeMath, sqrt, text } from "../data/mathNode.ts";
import { el } from "./dom.ts";

/**
 * Modèle mutable d'un bloc en cours de saisie. Un bloc structurel (fraction,
 * racine, exposant) contient lui-même une liste de blocs, ce qui permet
 * d'imbriquer une racine dans un dénominateur par exemple (1/(2√x)).
 */
type EditBlock =
  | { readonly type: "text"; readonly id: number; value: string }
  | { readonly type: "frac"; readonly id: number; readonly numerator: EditBlock[]; readonly denominator: EditBlock[] }
  | { readonly type: "sqrt"; readonly id: number; readonly radicand: EditBlock[] }
  | { readonly type: "exp"; readonly id: number; readonly exponent: EditBlock[] };

let nextBlockId = 0;

function makeTextBlock(): EditBlock {
  return { type: "text", id: nextBlockId++, value: "" };
}

function makeFracBlock(): EditBlock {
  return { type: "frac", id: nextBlockId++, numerator: [makeTextBlock()], denominator: [makeTextBlock()] };
}

function makeSqrtBlock(): EditBlock {
  return { type: "sqrt", id: nextBlockId++, radicand: [makeTextBlock()] };
}

function makeExpBlock(): EditBlock {
  return { type: "exp", id: nextBlockId++, exponent: [makeTextBlock()] };
}

function blockToNode(block: EditBlock): MathNode {
  switch (block.type) {
    case "text":
      return text(block.value);
    case "frac":
      return frac(blocksToNode(block.numerator), blocksToNode(block.denominator));
    case "sqrt":
      return sqrt(blocksToNode(block.radicand));
    case "exp":
      return exp(blocksToNode(block.exponent));
  }
}

function blocksToNode(blocks: readonly EditBlock[]): MathNode {
  return seq(...blocks.map(blockToNode));
}

/**
 * Éditeur de formule : une ligne de saisie où l'on tape du texte normalement,
 * et où des boutons insèrent des blocs de fraction / racine / exposant à
 * l'endroit du curseur. Chaque bloc structurel expose ses propres champs de
 * texte, stylés comme la vraie notation mathématique (voir `.frac`,
 * `.sqrt-radicand`, `<sup>` dans style.css).
 */
export class MathAnswerEditor {
  private blocks: EditBlock[] = [makeTextBlock()];
  private activeList: EditBlock[] = this.blocks;
  private activeIndex = 0;
  private readonly formulaContainer: HTMLElement;
  private readonly onSubmit: () => void;

  constructor(container: HTMLElement, onSubmit: () => void) {
    const fracButton = this.toolbarButton("a⁄b", "Insérer une fraction", () => this.insertStructural(makeFracBlock()));
    const sqrtButton = this.toolbarButton("√", "Insérer une racine carrée", () =>
      this.insertStructural(makeSqrtBlock()),
    );
    const expButton = this.toolbarButton("xⁿ", "Insérer un exposant", () => this.insertStructural(makeExpBlock()));
    const clearButton = this.toolbarButton("⟲", "Effacer la réponse", () => this.reset(), "toolbar-button toolbar-button-danger");

    this.formulaContainer = el("div", { className: "math-editor-formula" });
    this.onSubmit = onSubmit;

    container.append(
      this.formulaContainer,
      el("div", { className: "math-toolbar" }, [fracButton, sqrtButton, expButton, clearButton]),
    );

    this.renderFormula();
  }

  getMathNode(): MathNode {
    return blocksToNode(this.blocks);
  }

  getSerializedAnswer(): string {
    return serializeMath(this.getMathNode());
  }

  getAnswerHtml(): string {
    return renderMathHtml(this.getMathNode());
  }

  focus(): void {
    const first = this.blocks[0];
    if (first !== undefined) this.focusBlock(first);
  }

  reset(): void {
    this.blocks = [makeTextBlock()];
    this.activeList = this.blocks;
    this.activeIndex = 0;
    this.renderFormula();
    this.focus();
  }

  private toolbarButton(
    glyph: string,
    label: string,
    onClick: () => void,
    className = "toolbar-button",
  ): HTMLButtonElement {
    const button = el("button", { className, type: "button", textContent: glyph });
    button.setAttribute("aria-label", label);
    button.title = label;
    button.addEventListener("click", onClick);
    return button;
  }

  private insertStructural(block: EditBlock): void {
    const insertIndex = this.activeIndex + 1;
    this.activeList.splice(insertIndex, 0, block, makeTextBlock());
    this.renderFormula();
    this.focusBlock(block);
  }

  private renderFormula(): void {
    this.formulaContainer.replaceChildren(this.renderBlockList(this.blocks));
  }

  private renderBlockList(list: EditBlock[]): HTMLElement {
    const wrapper = el("span", { className: "math-block-list" });
    list.forEach((block, index) => wrapper.append(this.renderBlock(block, list, index)));
    return wrapper;
  }

  private renderBlock(block: EditBlock, ownerList: EditBlock[], index: number): HTMLElement {
    switch (block.type) {
      case "text":
        return this.renderTextInput(block, ownerList, index);
      case "frac": {
        const wrapper = el("span", { className: "frac editable" }, [
          el("span", { className: "frac-num" }, [this.renderBlockList(block.numerator)]),
          el("span", { className: "frac-den" }, [this.renderBlockList(block.denominator)]),
        ]);
        wrapper.dataset.blockId = String(block.id);
        return wrapper;
      }
      case "sqrt": {
        const wrapper = el("span", { className: "sqrt-block" }, [
          "√",
          el("span", { className: "sqrt-radicand" }, [this.renderBlockList(block.radicand)]),
        ]);
        wrapper.dataset.blockId = String(block.id);
        return wrapper;
      }
      case "exp": {
        const wrapper = el("sup", { className: "exp-block" }, [this.renderBlockList(block.exponent)]);
        wrapper.dataset.blockId = String(block.id);
        return wrapper;
      }
    }
  }

  private renderTextInput(
    block: Extract<EditBlock, { type: "text" }>,
    ownerList: EditBlock[],
    index: number,
  ): HTMLElement {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "math-input";
    input.value = block.value;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.dataset.blockId = String(block.id);
    this.autosize(input);

    input.addEventListener("input", () => {
      block.value = input.value;
      this.autosize(input);
    });
    input.addEventListener("focus", () => {
      this.activeList = ownerList;
      this.activeIndex = index;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onSubmit();
      }
    });

    return input;
  }

  private autosize(input: HTMLInputElement): void {
    input.size = Math.max(1, input.value.length);
  }

  private focusBlock(block: EditBlock): void {
    const selector =
      block.type === "text"
        ? `[data-block-id="${block.id}"]`
        : block.type === "frac"
          ? `[data-block-id="${block.id}"] .frac-num input`
          : block.type === "sqrt"
            ? `[data-block-id="${block.id}"] .sqrt-radicand input`
            : `[data-block-id="${block.id}"] input`;
    this.formulaContainer.querySelector<HTMLInputElement>(selector)?.focus();
  }
}
