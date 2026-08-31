# Integra

Quiz web pour apprendre les dérivées et les primitives des fonctions usuelles.

## Développement

```bash
npm install
npm run dev        # serveur de développement
npm run typecheck  # vérification TypeScript
npm run build      # build de production (dist/)
```

## Modes de quiz

- **Dérivées** : retrouver f'(x) à partir de f(x).
- **Primitives** : retrouver une primitive F(x) à partir de f(x).
- **Dérivées & primitives** : les deux types de questions mélangés.

Le contenu pédagogique (table des fonctions/dérivées/primitives) se trouve dans
[src/data/functionTable.ts](src/data/functionTable.ts).
