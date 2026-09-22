---
name: review
description: Relit le diff courant (UI ou code) avant commit selon les règles du projet. Détecte automatiquement si le changement touche l'interface (→ checklist UX) ou le code (→ checklist code), puis produit un verdict clair. Invocable manuellement ou par /implement.
user-invocable: true
---

# RÔLE

Tu relis le diff courant et tu produis un verdict avant tout commit.
Tu ne modifies rien — tu signales, tu ne corriges pas.

# AVANT DE COMMENCER

Identifie le périmètre du changement :

- **Diff touche le code applicatif sans changement CSS/layout notable** → appliquer **Checklist code** uniquement.
- **Diff touche des composants, styles, layout, couleurs, animations** → appliquer **Checklist UX** uniquement.
- **Les deux** → appliquer les deux checklists dans l'ordre : code d'abord, UX ensuite.

Lis également `docs/06-backlog.md` (items `[x]`) pour identifier les fonctionnalités livrées
dans le périmètre — elles doivent rester fonctionnelles après le changement.

---

## CHECKLIST CODE

### Corrections obligatoires (bloquantes)

- [ ] Pas de `console.log` de debug laissé dans le code livré
- [ ] Les fonctions font < 50 lignes (ou justification si dépassé)
- [ ] Aucune nouvelle dépendance ajoutée sans justification explicite dans le chat

**Si la modification touche le code applicatif :**
- [ ] Invariants métier et modèle de données (`docs/03-data-model.md`) non cassés
- [ ] Tokens CSS utilisés — pas de couleur hex hardcodée
- [ ] Types respectés, schéma de données non modifié sans décision documentée

### Qualité du code

- [ ] Les noms de variables / fonctions sont explicites
- [ ] Pas de code mort laissé (supprimer, ne pas commenter)
- [ ] Pas de duplication évitable (3 occurrences similaires → factoriser)

### Impact doc

- [ ] **[BLOQUANT]** Si le diff touche une table, un enum, une colonne, une policy d'accès ou des types générés → `docs/03-data-model.md` doit refléter la réalité implémentée (pas la spec initiale — ce qui a réellement été codé)
- [ ] Si UX changée → `docs/04-ui-ux-guidelines.md` mis à jour
- [ ] Si décision structurante → `docs/07-decisions-log.md` mis à jour
- [ ] Si fonctionnalité livrée → `docs/06-backlog.md` mis à jour

---

## CHECKLIST UX

### Cohérence avec les guidelines

- [ ] Les couleurs utilisées sont dans les tokens définis (`docs/04-ui-ux-guidelines.md`)
- [ ] Pas de blanc pur ni de noir pur en background
- [ ] Le changement fonctionne en dark ET en light theme
- [ ] Les contrastes respectent WCAG AA (tester visuellement)

### Hiérarchie et lisibilité

- [ ] L'objectif des cartes impactées reste visible sans interaction (onglet/section replié — D_085)
- [ ] Aucune information critique n'est masquée derrière un onglet par défaut
- [ ] Les titres sont scannables (pas de texte dense)

### Responsive

- [ ] Testé sur ≥ 1100px (desktop, sidebar visible)
- [ ] Testé sur 700–1100px (sidebar masquée, mobile-nav visible)
- [ ] Testé sur < 700px (layout 1 colonne)

### Feedback fonctionnel

- [ ] **Feedback visuel manquant = bug fonctionnel, pas du polish** : indicateur de sauvegarde absent, état de permission non affiché, status non mis à jour → bloquer la livraison, pas signaler comme amélioration optionnelle.

### Micro-interactions

- [ ] Les animations suivent les règles (`docs/04-ui-ux-guidelines.md`) — pas d'effets gadget
- [ ] Les transitions sont CSS-only (pas d'animation JS)
- [ ] Les durées sont dans les bornes définies (400–600ms)

### Accessibilité

- [ ] Les éléments interactifs ont les bons `role`, `tabindex`, `aria-label`
- [ ] Les éléments décoratifs ont `aria-hidden="true"`

---

## VERDICT

Après chaque checklist applicable, émet un verdict parmi :

**Code :**
- **Approved** → livrer
- **Approved with comments** → livrer + ouvrir des tickets pour les commentaires non bloquants
- **Request changes** → ne pas livrer, corriger d'abord les points bloquants

**UX :**
- **OK** → livrer
- **OK avec réserves** → livrer + ouvrir un ticket pour les réserves
- **Bloquant** → ne pas livrer, corriger d'abord

Si Request changes / Bloquant : liste numérotée des points à corriger, avec suggestion concrète.
