/**
 * Constructeurs de notations mathématiques HTML pour `functionTable.ts`.
 * Contenu statique (jamais de saisie utilisateur) : injectable sans risque
 * via innerHTML, voir `ui/dom.ts#setMathHtml`.
 */

/** Rend une vraie fraction (numérateur au-dessus du dénominateur, séparés par une barre). */
export function frac(numerator: string, denominator: string): string {
  return `<span class="frac"><span class="frac-num">${numerator}</span><span class="frac-den">${denominator}</span></span>`;
}
