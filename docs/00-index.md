# 00 — INDEX DE NAVIGATION

> **rôle** : carte de navigation de toute la documentation du projet.
> **contient** : table "selon ta tâche → lis ce fichier", liste des skills, références techniques.
> **vital parce que** : sans lui, on ne sait pas quel fichier lire pour quelle tâche.
> **à lire avant de** : démarrer toute tâche complexe, quelle qu'elle soit.

---

## SELON TA TÂCHE, LIS EN PRIORITÉ

| need                                                    | file                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Vocabulaire canonique du projet                         | [CONTEXT.md](../CONTEXT.md)                                  |
| Comprendre le projet, sa vision, son but                | [01-product-brief.md](01-product-brief.md)                  |
| Coder ou spécifier une fonctionnalité                   | [02-functional-spec.md](02-functional-spec.md)              |
| Modifier la base de données / le state                  | [03-data-model.md](03-data-model.md)                        |
| Toucher l'interface, les couleurs, les layouts          | [04-ui-ux-guidelines.md](04-ui-ux-guidelines.md)            |
| Comprendre la stack ou les choix techniques             | [05-technical-architecture.md](05-technical-architecture.md)|
| Planifier une tâche / choisir quoi faire                | [06-backlog.md](06-backlog.md)                              |
| Comprendre pourquoi quelque chose est fait ainsi        | [07-decisions-log.md](07-decisions-log.md)                  |
| Décisions design globales                               | [08-design-decisions.md](08-design-decisions.md)            |
| Spec comportement d'une vue (base tests E2E + design)   | [modules/](modules/) — un fichier par vue                   |

---

## PROCÉDURES (SKILLS)

Les procédures vivent dans `.claude/skills/` et s'invoquent via `/nom`. Deux entrées :

- **Carte rapide** (chargée à chaque session) : table des skills dans [CLAUDE.md](../CLAUDE.md).
- **Guide détaillé** (quand / comment / exemples) : [reference/skills.md](reference/skills.md).

---

## RÉFÉRENCES TECHNIQUES

| file                                                    | usage                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [reference/claude-code.md](reference/claude-code.md)    | CLAUDE.md, .claude/, Hooks, commandes natives                |
| [reference/gitignore.md](reference/gitignore.md)        | Ce qui est ignoré par Git, pourquoi                          |
| [reference/skills.md](reference/skills.md)              | Guide complet des skills — invocation, workflow              |

---

## RÈGLES DE MISE À JOUR

- **Toujours** mettre à jour le fichier concerné avant ou juste après une modification majeure.
- Ne jamais laisser le code diverger de la doc sans noter la divergence dans [07-decisions-log.md](07-decisions-log.md).
- En cas de doute : la doc prime. Si la doc est fausse, corrige-la d'abord.
