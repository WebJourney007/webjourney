---
name: repo-audit
description: Audit hygiène du repo — détecte les fichiers flottants, liens morts, migrations non commitées, specs orphelines, handoffs périmés. À lancer périodiquement (mensuel) ou quand todo/ semble encombré.
user-invocable: true
disable-model-invocation: true
---

# RÔLE

Audite l'état du repo en dehors du code applicatif et signale ce qui dérive des règles de cycle de vie définies dans `CLAUDE.md`.

Tu ne modifies rien. Tu signales, listes, et proposes les actions correctives.

# CHECKS À EFFECTUER (dans cet ordre)

## 1. Références croisées : liens morts + complétude (ex-sync-docs)

**Liens morts** — vérifie que chaque lien Markdown pointe vers un fichier existant, dans :
- `README.md` · `docs/00-index.md` · `CLAUDE.md` · `docs/reference/skills.md` · `docs/reference/claude-code.md`

**Complétude** — pour chaque fichier `docs/*.md` ou skill `.claude/skills/*/` récent, vérifie qu'il est bien référencé dans `README.md` + `docs/00-index.md` (+ `claude-code.md` si c'est un skill).

Signale chaque anomalie avec source + ligne. Pour cette section (hygiène déterministe), tu peux **corriger** les refs directement, puis attendre validation si plus de 3 fichiers sont touchés.

## 2. Fichiers `??` dans git status

Lance `git status --short` et filtre les `??`.
Pour chaque fichier non tracké :
- Dans `todo/` ou `todo/handoffs/` → doit être commité ou archivé
- Dans `resources/` → doit être commité ou supprimé
- Dans un dossier de migrations DB (si le projet en a un) → doit être commité (migrations flottantes = risque DB)
- Dans le code applicatif → probablement lié à un handoff en cours — signaler

## 3. Specs orphelines vs backlog

Pour chaque `todo/specs/spec-B-NNN.md` :
- Vérifie que l'item B-NNN dans `docs/06-backlog.md` est encore `[ ]` (pas `[x]`)
- Si `[x]` → la spec est morte et doit être supprimée (`git rm`)

Pour chaque item `[x]` récent dans le backlog :
- Vérifie qu'il n'y a pas une `spec-B-NNN.md` orpheline restante

## 4. Handoffs périmés

Pour chaque `todo/handoffs/YYYYMMDD-*.md` :
- Si la date est > 7 jours, avertir — handoff potentiellement stale
- Si le handoff référence des fichiers dans `todo/` qui n'existent plus → lien périmé

## 5. Incohérence backlog ↔ decisions-log

Vérifie que les D_XXX cités dans les notes du backlog (`docs/06-backlog.md`) existent bien dans `docs/07-decisions-log.md`.

## 6. `todo/` tend vers le vide

Compte les fichiers dans `todo/` (hors `.gitkeep`). Si > 5 fichiers, alerte : le pipeline est peut-être bouché.

# SORTIE

Rapport structuré en 3 blocs :

```
## ✅ OK
[ce qui est propre]

## ⚠️ À corriger
[problèmes non bloquants + action suggérée]

## 🔴 Bloquant
[migrations flottantes, specs orphelines sur items livrés, liens cassés]
```

Termine par une liste d'actions groupées prêtes à copier-coller.
