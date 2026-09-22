# RÉFÉRENCE — SKILLS

> Guide des procédures invocables (`.claude/skills/`). Chaque skill s'invoque via `/nom`
> et sa `description` (frontmatter du `SKILL.md`) suffit à le déclencher.

---

## La chaîne principale

```
Idée → backlog (B-NNN) → /spec-feature B-NNN → /implement B-NNN → /review → commit
```

| Skill | Rôle | Quand |
| ----- | ---- | ----- |
| `/spec-feature B-NNN` | Transforme 1 item backlog en spec codable (`todo/specs/spec-B-NNN.md`). Ne code rien. | Avant de coder une feature non triviale. |
| `/implement B-NNN`    | Code l'item spécifié, génère le bloc ⚡ TEST, met à jour la spec module touchée. | Quand la spec est validée. |
| `/review`             | Relit le diff courant (UI → checklist UX, code → checklist code) avant commit. | Juste avant chaque commit. |
| `/spec-module <nom>`  | Crée / régénère la spec durable d'une vue (`docs/modules/<nom>.md`) — source de vérité lisible. | Quand un module est codé ou a divergé. |
| `/integrate-decision` | Intègre une décision structurante dans `docs/07` (D_XXX) sans coder. | Quand une décision est tranchée en conversation. |
| `/grill-with-docs`    | Séance de stress-test d'un plan contre le modèle existant ; affine le vocabulaire et la doc. | Réflexion amont, vision, clarification d'un concept. |
| `/diagnose`           | Méthodologie bug difficile : feedback loop déterministe → reproduire → hypothèses → fix + test de régression. | Tout bug non trivial. |
| `/handoff`            | Compacte la session en un document de reprise (`todo/handoffs/`). | Avant un arrêt / un compactage de contexte. |
| `/repo-audit`         | Hygiène repo : liens morts, refs croisées, fichiers flottants. | Entretien périodique. |
| `/playwright-audit B-NNN` | Transforme un bloc ⚡ TEST en audit Playwright (headed, vidéo, rapport HTML). | Vérifier un flux UI à risque livré. |
| `/playwright-cli`     | Piloter un navigateur / tester des pages manuellement. | Test exploratoire d'une page. |

---

## Principe

Pas de "modes" : une méthode = un skill. Pour en ajouter un, crée un dossier
`.claude/skills/<nom>/SKILL.md` avec un frontmatter (`name`, `description`, `user-invocable`).

> Pense à adapter chaque `SKILL.md` à TON projet : certains référencent `app/` ou des
> conventions issues du projet d'origine. Relis-les une fois avant ta première vraie session.
