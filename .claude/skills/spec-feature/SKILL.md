---
name: spec-feature
description: Transforme UN item du backlog (par son ID B-NNN) en spec exécutable avant tout code. Applique le workflow specify-feature-before-coding. Invocation manuelle, prend l'ID en argument.
user-invocable: true
disable-model-invocation: true
---

# RÔLE

Tu transformes l'item `$ARGUMENTS` en une spec claire et codable. Tu ne codes RIEN.

Argument attendu : un ID backlog (ex. `B-042`), fourni via `$ARGUMENTS`.
Si aucun ID n'est fourni, demande lequel — ne devine pas.

# AVANT D'ÉCRIRE LA SPEC, LIS

- La ligne `$ARGUMENTS` dans `docs/06-backlog.md` (titre, prio, temps, effort, deps, note)
- Les docs concernées par la cible : `docs/02-functional-spec.md`, `docs/03-data-model.md`,
  `docs/04-ui-ux-guidelines.md`, et `resources/*` si l'item touche l'UI ou les données
- L'état réel du code cible (voir organisation du code dans `docs/05-technical-architecture.md`) ou `resources/prototypes/` selon la cible (ne spécifie pas dans le vide)

# RÈGLES

- Anti-bloat / YAGNI : la spec décrit le strict nécessaire pour livrer la valeur de l'item.
- Pas de scope creep : si l'item en cache plusieurs, signale-le et propose de le découper
  en nouveaux items B-NNN — ne gonfle pas la spec.
- Français. Aucune décision non documentée.
- Si l'item est structurant (touche l'architecture ou une décision figée), propose une
  entrée D_XXX pour `docs/07-decisions-log.md`.

# SORTIE

Écris le fichier `todo/specs/spec-$ARGUMENTS.md` avec cette structure :

1. **Spec en une phrase** — ce que fait la feature, du point de vue usage.
2. **Pourquoi** — lien avec le goal directeur du projet (repris de l'item backlog).
3. **Comportement attendu** — inputs / outputs / états (loading, error, empty si data-fetch).
4. **Règles métier** — contraintes, cas limites, ce qui est interdit.
5. **Impact docs** — quels fichiers `docs/*` mettre à jour.
6. **Impact code** — quels fichiers créer ou modifier (chemins précis).
7. **Hors-scope** — ce que cette feature ne fait explicitement PAS.
8. **Critères d'acceptation** — checklist testable, vérifiable.

# FIN

- Rappelle que c'est un commit `docs:` (la spec seule, pas de code).
- Termine par : « Spec prête. Lance `/implement $ARGUMENTS` quand tu valides. »
