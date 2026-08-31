type ElementAttributes = Partial<{
  className: string;
  textContent: string;
  type: HTMLButtonElement["type"];
  disabled: boolean;
}>;

/** Crée un élément DOM avec quelques attributs courants, sans dépendance externe. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: ElementAttributes = {},
  children: readonly (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (attributes.className !== undefined) element.className = attributes.className;
  if (attributes.textContent !== undefined) element.textContent = attributes.textContent;
  if (attributes.type !== undefined && element instanceof HTMLButtonElement) {
    element.type = attributes.type;
  }
  if (attributes.disabled !== undefined && element instanceof HTMLButtonElement) {
    element.disabled = attributes.disabled;
  }
  for (const child of children) {
    element.append(child);
  }
  return element;
}

/**
 * Injecte une notation mathématique (ex: "x<sup>2</sup>") dans un élément.
 * Réservé au contenu statique défini dans `data/functionTable.ts` — jamais à de la
 * saisie utilisateur — pour éviter tout risque d'injection HTML.
 */
export function setMathHtml(element: HTMLElement, trustedHtml: string): void {
  element.innerHTML = trustedHtml;
}

export function clearChildren(element: HTMLElement): void {
  element.replaceChildren();
}
