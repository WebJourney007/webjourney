# Harness Starter Kit

Un **harness de gouvernance pour agent de code** (Claude Code) : l'ossature documentaire,
les conventions et les procédures qui font qu'un agent avance *proprement* sur un projet —
sans réinventer le contexte à chaque session, sans refaire des débats déjà tranchés.

Stack-agnostic : rien ici ne dépend d'un framework. Marche pour un site web, une app, un CLI, etc.

---

## La philosophie en 30 secondes

| Pièce | Rôle |
| ----- | ---- |
| `docs/` | La **vérité** du projet (vision, fonctionnel, données, archi). On lit avant de coder. |
| `CONTEXT.md` | Le **glossaire** : un mot = un sens. Tue l'ambiguïté de vocabulaire avec l'agent. |
| `docs/07-decisions-log.md` | Le **registre d'ADR** (`D_XXX`) : le *pourquoi* des choix structurants, immuable. |
| `docs/06-backlog.md` | La file de travail (`B-NNN`). Pas de GitHub Issues en parallèle. |
| `.claude/skills/` | Les **procédures** invocables (`/spec-feature`, `/implement`, `/review`…). |
| `.claude/hooks/` + `.githooks/` | Les **garde-fous** automatiques (horodatage d'archives, liens morts, rappels). |
| `todo/` | Salle d'attente entre sessions (specs, tests, handoffs). Tend vers le vide. |

Deux règles de fer :

- **Doc avant code.** On ne code pas sans avoir lu les docs concernées.
- **Deux commits séparés.** `docs:` d'abord, `feat:`/`fix:` ensuite. Jamais mélangés.

---

## Installation (une fois)

```bash
# 1. Activer les git hooks (horodatage archives + rappel todo/)
git config core.hooksPath .githooks

# 2. Les hooks Claude Code sont déjà branchés dans .claude/settings.json
#    (chemins dynamiques via $CLAUDE_PROJECT_DIR — rien à éditer).
```

> **Hooks PowerShell** : `archive-table.ps1` et `check-doc-refs.ps1` tournent sous Windows.
> Sur Mac/Linux, désactive-les dans `.claude/settings.json` ou porte-les en bash.

Pour la **config globale** (tes préférences, tous projets confondus) :
copie `.claude/CLAUDE-global.template.md` vers `~/.claude/CLAUDE.md` et remplis-le.

---

## Par où commencer (ordre conseillé)

1. **`CLAUDE.md`** (racine) — remplis la section « Contexte projet » (produit, stack, goal).
2. **`docs/05-technical-architecture.md`** — décris ta vraie stack.
3. **`CONTEXT.md`** — ajoute tes premiers termes métier au fil de l'eau.
4. **`docs/01-product-brief.md`** — la vision, même en 5 lignes.
5. Le reste des `docs/` se remplit **quand tu touches le sujet**, pas d'un coup.

Puis lance ta première feature :

```
/spec-feature B-001   →   /implement B-001   →   /review
```

---

## Ce qui est volontairement vide

Ce kit est l'**ossature**, pas le contenu. Sont vides et à remplir par toi :
les `docs/` (sauf en-têtes de rôle), `CONTEXT.md`, le backlog, le decisions log, la mémoire.

Ce qui est **fourni prêt à l'emploi** : les skills, les hooks, les conventions
(`B-NNN`, `D_XXX`, règle des 2 commits, format ⚡ TEST), la structure de dossiers.

> Relis les `SKILL.md` une fois : certains renvoient vers `docs/05-technical-architecture.md`
> pour les chemins/conventions réels — à préciser dès que ta stack est choisie.

---

## Bonus : config VSCode (`vscode-profile/`)

Le dossier [`vscode-profile/`](vscode-profile/) contient une config VSCode prête à appliquer
(réglages éditeur, raccourcis, icônes Material, ~21 extensions curées pour un projet web — à adapter à ta stack) :

```powershell
cd vscode-profile
pwsh -File install.ps1   # installe les extensions + applique settings/keybindings (avec backup)
```

Indépendant du harness — utilisable seul, supprimable après usage. Détails dans
[`vscode-profile/README.md`](vscode-profile/README.md).
