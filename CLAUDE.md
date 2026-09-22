# CLAUDE.md — <PROJET>

> Instructions permanentes de ce projet. Complète le CLAUDE.md global utilisateur.
> Court par conception : la connaissance vit dans `docs/`, les procédures dans `.claude/skills/`.

## Source de vérité

- `docs/*.md` = vérité produit. Ne pas coder sans avoir lu les docs concernées.
- Lire `docs/00-index.md` avant toute tâche complexe.
- Conflit code ↔ doc : signaler, ne pas trancher seul.

## Principes permanents

- Anti-bloat / YAGNI : le strict nécessaire, propre, lisible. Pas d'abstraction prématurée.
- Doc avant code. Pas de features spéculatives, pas de refacto non demandé.
- Aucune dépendance sans justification explicite dans le chat.
- Doute sur l'intention → UNE question ciblée, ne pas deviner.

## Règle des deux commits

Jamais doc et code dans le même commit.

1. `docs:` — docs / specs d'abord.
2. `feat:` / `fix:` / `refactor:` — code ensuite.

## Format backlog (glu inter-skills)

Tout item porte un ID stable B-NNN (jamais réutilisé). Une seule table `🎯 À FAIRE` dans `docs/06-backlog.md`, triée par **ID décroissant** (récent en haut). Colonnes :

```
| id | titre | prio | temps | effort | deps | note |
```

- **prio** : 🔴 critique · 🟠 haute · 🟡 moyenne · 🟢 basse — **colonne à scanner**, pas un axe de tri.
- **temps** : ordre de grandeur (min/h/j) — repère, pas un engagement. **effort** : faible/moyen/élevé.
- **status** : `[ ]` à faire · `[x]` fait · `[-]` abandonné · `[?]` idée non qualifiée.

Entretien : nouvel item → **en haut** de la table · item livré → **migré en archive compacte** · re-tri ID à la demande (_pull_). `[?]` = pas d'ID, va en section Idées ; ID figé dès la qualification.
Specs dans `todo/specs/spec-B-NNN.md`. Chaîne : `/spec-feature B-NNN` → `/implement B-NNN`.

## ⚡ Test après livraison — proportionné au risque

À chaque B-NNN livré, **toujours** dire comment vérifier — mais le format dépend du **risque**, pas d'une règle uniforme.

**Routage selon le risque :**

- **Cosmétique / dette / renommage** → une **ligne** dans le chat : « va sur X, vérifie Y ». Pas de bloc, pas de fichier.
- **Logique métier** (calcul, statut dérivé, mutation) → **test auto** (Vitest ou équivalent), pas un bloc manuel.
- **Flux UI à risque** (multi-étapes, argent, transversal) → **bloc ⚡ TEST complet** (ci-dessous), écrit dans `todo/tests/test-B-NNN.md` **uniquement si** un audit `/playwright-audit` est prévu ; sinon le bloc reste dans le chat (éphémère).

**Légende :** `▶` action · `◀` résultat attendu · `◴` temps/attente · `↻` recharger · `⨉` test négatif (ne doit PAS arriver) · `✓` scénario validé · `⚑` pré-requis · `●` point d'attention.

**Format du bloc (condensé — 1 ligne par clic) :**

> ⚡ **TEST — B-NNN Titre**
>
> ⚑ [pré-requis : migration / seed · commande de lancement → URL locale]
>
> ▶ [action] ◀ [attendu]
> ↻ [recharge] ◀ [état conservé]
> ⨉ [cas interdit] ◀ [n'apparaît pas]
> ● [piège éventuel]

## Système documentaire (consommé par les skills)

- Glossaire : `CONTEXT.md` (racine) — à charger à chaque session
- Decisions log : `docs/07-decisions-log.md` — format `D_XXX`, append-only
- Backlog / tracker : `docs/06-backlog.md` — format `B-NNN`
- Specs : `todo/specs/spec-B-NNN.md`
- Handoffs : `todo/handoffs/YYYYMMDD-sujet.md`
- Archives : `zarchives/YYYYMMDD-slug.md` — figées, ne jamais modifier

### Critères pour une entrée D_XXX (les 3 requis)

1. Difficile à reverser
2. Surprenante sans contexte
3. Issue d'un vrai trade-off

Si un critère manque → pas d'entrée.

## Procédures = skills

Pour appliquer une méthode, on invoque le skill — sa `description` suffit à le déclencher.

| Besoin                                                | Skill                 |
| ----------------------------------------------------- | --------------------- |
| Cadrer 1 item backlog avant de coder                  | `/spec-feature B-NNN`      |
| Coder 1 item spécifié                                 | `/implement B-NNN`         |
| Créer/mettre à jour la spec d'une vue (source vérité) | `/spec-module <nom>`        |
| Relire UI ou code avant commit                        | `/review`                  |
| Intégrer une décision dans les docs (sans coder)      | `/integrate-decision`      |
| Réflexion amont / vision / glossaire                  | `/grill-with-docs`         |
| Diagnostiquer un bug difficile                        | `/diagnose`                |
| Sauvegarder / relayer la session en cours             | `/handoff`                 |
| Hygiène repo (liens morts, refs croisées…)            | `/repo-audit`     |
| Auditer un B-NNN livré (bloc ⚡ TEST → rapport HTML)   | `/playwright-audit B-NNN`  |
| Piloter un navigateur / tester des pages              | `/playwright-cli`          |

---

## Démarrage de session

1. Lire `CONTEXT.md` systématiquement.
2. Vérifier si des fichiers existent dans `todo/handoffs/`.
   - Si oui : lister les fichiers disponibles et demander lequel charger.
   - Charger le fichier choisi, confirmer à l'utilisateur.
   - Ne pas supprimer — attendre le premier commit réussi de la session.
3. Si le contexte approche la saturation en cours de session :
   proposer `/handoff` avant tout compactage automatique.

## Contexte projet

<!-- À REMPLIR — décris ton produit en 3-5 lignes :
- Produit : <quoi, pour qui>
- App : <stack — ex. Astro 5, TypeScript strict, Tailwind, déploiement>
- Repo : <url>
- Goal directeur : <l'objectif unique qui prime>
-->

## Fichiers de travail & push

- En cours → `todo/` · Terminés → `zarchives/YYYYMMDD-nom.md` · Support stable → `resources/`.
- Jamais de fichier de travail à la racine ou dans `docs/`.

`todo/` est une salle d'attente entre sessions — elle doit tendre vers le vide.

| Fichier                           | Naît quand                       | Meurt quand                                                   |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------- |
| `todo/specs/spec-B-NNN.md`        | `/spec-feature` crée la spec     | `/implement` termine + commit réussi → suppression            |
| `todo/tests/test-B-NNN.md`        | `/implement` génère le bloc TEST | `/playwright-audit` validé → suppression manuelle             |
| `todo/handoffs/YYYYMMDD-sujet.md` | `/handoff` sauvegarde la session | Commit réussi dans la session de reprise → suppression        |

Si des fichiers s'accumulent dans `todo/` → signal de features en suspens, pas une archive.

- Avant `git push` : mettre à jour `README.md` si un fichier doc/config a été ajouté, renommé,
  supprimé, ou si la stack a changé.

## Références rapides

| Besoin                              | Fichier                             |
| ----------------------------------- | ----------------------------------- |
| Vision / business                   | `docs/01-product-brief.md`          |
| Ce que l'app fait                   | `docs/02-functional-spec.md`        |
| Données                             | `docs/03-data-model.md`             |
| UI / couleurs / layout              | `docs/04-ui-ux-guidelines.md`       |
| Stack / archi                       | `docs/05-technical-architecture.md` |
| Quoi faire ensuite                  | `docs/06-backlog.md`                |
| Pourquoi c'est fait ainsi           | `docs/07-decisions-log.md`          |
| Décisions design globales (UI/UX)   | `docs/08-design-decisions.md`       |
| Guide des skills du projet          | `docs/reference/skills.md`          |
