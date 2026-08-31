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
 *
 * Le HTML est posé dans un <span> intermédiaire plutôt que directement dans
 * `element` : si `element` est un conteneur flex (ex: `.choice`), un <sup>
 * placé en enfant direct deviendrait lui-même un flex item "blockifié", ce
 * qui casse `vertical-align:super` et affiche l'exposant à côté du texte
 * au lieu d'au-dessus. Le wrapper reste hors du flux flex direct.
 */
export function setMathHtml(element: HTMLElement, trustedHtml: string): void {
  const wrapper = document.createElement("span");
  wrapper.innerHTML = trustedHtml;
  element.replaceChildren(wrapper);
}

export function clearChildren(element: HTMLElement): void {
  element.replaceChildren();
}
