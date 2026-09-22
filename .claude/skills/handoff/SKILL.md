---
name: handoff
description: Compacte la conversation courante en un document de handoff pour reprendre le travail dans une prochaine session ou relayer à un autre agent. À utiliser avant un arrêt forcé, avant un compactage de contexte imminent, ou pour relayer à un autre agent.
argument-hint: "Pour quoi sera utilisée la prochaine session ?"
user-invocable: true
---

Écris un document de handoff résumant la conversation courante pour qu'un agent frais puisse reprendre le travail.

## Destination

Chercher le chemin handoffs dans le bloc **"Système documentaire"** du `CLAUDE.md` du projet courant.
- Si déclaré (ex. `todo/handoffs/`) → sauvegarder là, avec le nom `YYYYMMDD-sujet.md`.
- Si absent → sauvegarder dans le dossier temporaire de l'OS.

⚠️ **Ne jamais supprimer ce fichier au chargement.** Supprimer uniquement après le premier commit réussi de la session qui l'a consommé.

## Contenu du document

- État actuel : ce qui a été fait, ce qui reste à faire.
- Décisions prises en session (non encore commitées dans les docs officielles).
- Contexte non évident que le prochain agent ne pourrait pas inférer du code seul.
- Section **"Skills suggérés"** : quels skills invoquer pour reprendre (`/implement B-NNN`, `/spec-feature`, etc.).

Ne pas dupliquer le contenu déjà capturé dans d'autres artefacts (specs, commits, diffs). Référencer par chemin plutôt que reproduire.

Masquer toute information sensible (clés API, tokens, identifiants personnels).

Si l'utilisateur a fourni des arguments, les traiter comme une description de ce sur quoi la prochaine session va se concentrer — adapter le document en conséquence.
