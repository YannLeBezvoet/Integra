# Integra

Quiz web pour apprendre les dérivées et les primitives des fonctions usuelles.

## Développement

```bash
npm install
npm run dev        # serveur de développement
npm run typecheck  # vérification TypeScript
npm run build      # build de production (dist/)
```

## Niveaux

- **Niveau 1 — QCM** : choisir la bonne réponse parmi 4 propositions.
- **Niveau 2 — Saisie libre** : écrire soi-même la réponse, à l'aide d'un éditeur
  de formule (boutons Fraction / Racine / Exposant) — voir
  [src/ui/mathEditor.ts](src/ui/mathEditor.ts).

## Modes de quiz

- **Dérivées** : retrouver f'(x) à partir de f(x).
- **Primitives** : retrouver une primitive F(x) à partir de f(x).
- **Dérivées & primitives** : les deux types de questions mélangés.

Le contenu pédagogique (table des fonctions/dérivées/primitives) se trouve dans
[src/data/functionTable.ts](src/data/functionTable.ts), sous forme structurée
(voir [src/data/mathNode.ts](src/data/mathNode.ts)) : cette même structure sert
au rendu HTML et à la correction des réponses saisies au niveau 2.
