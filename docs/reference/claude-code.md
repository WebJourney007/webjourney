# Claude Code — CLAUDE.md, Settings, Hooks

> Référence interne sur les mécanismes Claude Code de ce projet.
> Dernière mise à jour : 2026-06-04
>
> **Skills du projet** → voir [skills.md](skills.md)

---

Ce fichier explique comment fonctionnent `CLAUDE.md`, `.claude/`, les Hooks et les commandes natives.
Il ne remplace pas la [documentation officielle Anthropic](https://docs.anthropic.com/en/docs/claude-code/).

---

## 1. Quoi utiliser quand

| Élément | Sert à quoi | Où ça vit | Risque principal |
| ------- | ----------- | --------- | ---------------- |
| `CLAUDE.md` | Instructions persistantes projet | Racine du repo | Trop long ou trop flou |
| `.claude/` | Configuration Claude Code (projet) | Dossier `.claude/` | Mélanger config et specs produit |
| Skills | Procédures invocables via `/` | `.claude/skills/` | Sur-ingénierie prématurée |
| Hooks | Automatisations déclenchées par événements | `.claude/settings*.json` | Effets automatiques non prévus |

---

## 2. `CLAUDE.md`

### Ce que c'est

Un fichier Markdown placé à la racine du repo. Claude Code le lit automatiquement à chaque session. Il contient les **instructions permanentes** que l'IA doit suivre sur ce projet.

Il existe deux niveaux :
- `~/.claude/CLAUDE.md` (ou `C:\Users\shao\.claude\CLAUDE.md` sur Windows) — réglages globaux utilisateur, tous projets confondus
- `CLAUDE.md` à la racine du repo — réglages spécifiques au projet, versionnés dans Git

### Ce qu'on doit y mettre

- Règles obligatoires courtes (ex. : "lire docs/00-index.md avant toute tâche")
- Contraintes techniques non négociables
- Pointeurs vers les fichiers de documentation

### Ce qu'on ne doit PAS y mettre

- Les specs produit (→ `docs/02-functional-spec.md`)
- Le modèle de données (→ `docs/03-data-model.md`)
- Les décisions (→ `docs/07-decisions-log.md`)
- Tout ce qui change souvent

### Pourquoi le garder court

Claude Code charge `CLAUDE.md` dans son contexte à chaque session. Un fichier trop long dilue les instructions importantes. Mieux vaut pointer vers un index que tout contenir.

---

## 3. `.claude/`

### Deux niveaux à ne pas confondre

| Dossier | Portée | Versionné dans Git |
| ------- | ------ | ------------------ |
| `~/.claude/` (utilisateur) | Tous les projets | Non |
| `.claude/` (projet) | Ce repo uniquement | Oui |

### Ce que `.claude/` peut contenir

- `settings.json` — permissions, hooks, configuration Claude Code
- `settings.local.json` — surcharge locale non committée (dans `.gitignore`)
- `commands/` — commandes personnalisées
- `skills/` — skills projet

### Ce qu'il ne doit PAS contenir

Les specs produit, le modèle de données, les guidelines UX. Ces éléments vivent dans `docs/`.

```
docs/       = documentation produit officielle, source de vérité
.claude/    = configuration et extension de Claude Code uniquement
```

---

## 4. Skills

Guide complet (liste, invocation, exemples, workflow) → **[reference/skills.md](skills.md)**

Pour créer un nouveau skill : répertoire `.claude/skills/<nom>/SKILL.md` avec frontmatter `name`, `description`, `user-invocable`. Lancer `/repo-audit` (check refs croisées) ensuite.

---

## 5. Slash commands natives

| Commande | Usage |
| -------- | ----- |
| `/help` | Affiche l'aide Claude Code |
| `/compact` | Compresse le contexte de la session |
| `/memory` | Affiche ou gère la mémoire persistante |
| `/clear` | Réinitialise la session |

Les skills du projet (`/review`, `/implement`, etc.) sont des commandes personnalisées → [skills.md](skills.md).

---

## 6. Hooks

### Ce que sont les hooks

Scripts shell déclenchés automatiquement par Claude Code lors de certains événements. Configurés dans `.claude/settings.json` ou `.claude/settings.local.json`.

### Événements disponibles

| Événement | Déclenché quand… |
| --------- | ---------------- |
| `PreToolUse` | Avant qu'un outil soit exécuté |
| `PostToolUse` | Après qu'un outil s'est exécuté |
| `UserPromptSubmit` | Quand l'utilisateur envoie un prompt |
| `Stop` | Quand l'agent principal a fini de répondre |
| `PreCompact` | Avant une compaction du contexte |
| `SessionStart` | Au démarrage d'une session Claude Code |
| `SessionEnd` | À la fin d'une session |

> Pour réagir à une écriture de fichier, filtrer `PreToolUse` / `PostToolUse` sur les outils `Write` / `Edit`. Vérifier la [doc officielle Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — la liste évolue.

### Règle d'usage

Les hooks **exécutent des commandes automatiquement**. Ne pas en créer sans :
1. Tester le hook en local
2. S'assurer qu'il ne bloque pas le workflow normal
3. Le documenter dans `.claude/settings.json` avec un commentaire

---

## 7. Règles pour ce projet

1. Ne pas mettre les specs produit dans `.claude/` — elles appartiennent à `docs/`.
2. Garder `CLAUDE.md` court — pointer vers `docs/00-index.md` plutôt que tout contenir.
3. Garder `docs/00-index.md` comme carte d'entrée unique pour l'IA et les humains.
4. Les procédures vivent dans `.claude/skills/` — pas de dossier `docs/workflows/`.
5. Ne créer un Hook que s'il apporte un vrai gain de sécurité, qualité ou automatisation — et seulement après avoir testé.
6. Toujours documenter une décision structurante dans [docs/07-decisions-log.md](../07-decisions-log.md).

---

## 8. Références officielles

> Ces liens pointent vers la documentation Anthropic. La doc évolue — vérifier qu'ils sont valides.

| Ressource | Ce qu'elle explique | Quand la consulter |
| --------- | ------------------- | ------------------ |
| [Mémoire et CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory) | Comment CLAUDE.md fonctionne, niveaux global/projet | Avant de modifier CLAUDE.md |
| [Répertoire .claude](https://docs.anthropic.com/en/docs/claude-code/settings) | Settings, permissions, structure de .claude/ | Avant de configurer .claude/ |
| [Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) | Événements disponibles, format de configuration | Avant d'écrire un hook |
| [Slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands) | Commandes natives et commandes personnalisées | Avant de créer une commande |
| [Skills](https://docs.anthropic.com/en/docs/claude-code/skills) | Format des Skills, comment en créer | Avant de convertir un workflow en Skill |
| [Index complet (llms.txt)](https://docs.anthropic.com/llms.txt) | Index machine-readable de toute la doc Anthropic | Pour donner du contexte à une IA web |

---

## 9. Modèle en couches de ce projet

```
CLAUDE.md
→ constitution : principes + glu backlog B-NNN + carte des skills

docs/*.md
→ connaissance produit (source de vérité)

.claude/skills/
→ procédures exécutables (invocables via /nom)

.claude/
→ configuration Claude Code (settings, permissions)
```
