---
name: implement
description: Implémente UN item déjà spécifié (par son ID B-NNN). Lit la spec, code, respecte la règle des deux commits, ne re-réfléchit pas la stratégie. Invocation manuelle, prend l'ID en argument.
user-invocable: true
disable-model-invocation: true
---

# RÔLE

Tu implémentes EXACTEMENT ce que décrit `todo/specs/spec-$ARGUMENTS.md`. Rien de plus.

Argument attendu : un ID backlog (ex. `B-042`), fourni via `$ARGUMENTS`.
Si aucun ID n'est fourni, ou si `todo/specs/spec-$ARGUMENTS.md` n'existe pas,
arrête-toi et demande de lancer `/spec-feature $ARGUMENTS` d'abord. Ne code pas sans spec.

# AVANT DE CODER, LIS IMPÉRATIVEMENT

- `todo/specs/spec-$ARGUMENTS.md` (la source de vérité de cette tâche)
- `docs/05-technical-architecture.md` — stack et conventions structurantes du projet
- `CLAUDE.md` (règle des deux commits, conventions)
- Le code cible existant listé par la spec (Impact code)

# RÈGLES D'EXÉCUTION (NON NÉGOCIABLES)

- **Ne re-réfléchis pas la stratégie.** Si une idée neuve surgit, ne l'implémente pas :
  signale-la pour un futur item backlog et continue la spec en cours.
- **Ne casse pas** : les invariants métier et le schéma de données documentés dans
  `docs/03-data-model.md`, les routes/flux et queries existants.
- **Tokens, pas de hex** : utilise les variables CSS / tokens définis dans
  `docs/04-ui-ux-guidelines.md`, jamais de couleur hardcodée.
- **Anti-bloat / YAGNI** : pas de wrapper inutile, pas d'abstraction prématurée,
  aucune nouvelle dépendance sans justification explicite.
- **Commentaires en français.**
- **Migrations DB** : si le schéma évolue, respecte l'ordre de dépendance du moteur
  utilisé (ex. retirer une policy/contrainte avant de supprimer la colonne qu'elle référence).

# VÉRIFICATION AVANT COMMIT

1. Lance la commande de typecheck/lint du projet (voir `docs/05-technical-architecture.md`).
   Si des erreurs → corriger avant de continuer.
2. Invoque `/review` sur le diff. Vérifie les critères d'acceptation de la spec un par un.

# COMMITS — RÈGLE DES DEUX COMMITS

- La spec a déjà été commitée en `docs:` (via `/spec-feature`). NE mélange PAS doc et code.
- Ce skill produit UN commit `feat:` (ou `fix:` / `refactor:`) contenant le code uniquement.
- Message : `feat: $ARGUMENTS <titre court de l'item>`.

# FIN

- **Si l'implémentation a touché un schéma de données, une table, un enum, une colonne, une policy d'accès ou des types générés** : mettre à jour `docs/03-data-model.md` pour refléter la réalité du code livré (pas la spec — ce qui a réellement été implémenté). Ce delta va dans le commit `docs:` ci-dessous.
- Marque l'item `$ARGUMENTS` `[x]` **puis migre-le** de la table `🎯 À FAIRE` vers l'archive compacte (id + titre + statut) dans `docs/06-backlog.md` — ne pas le laisser dans À FAIRE (règle d'entretien du backlog).
- **Supprime `todo/specs/spec-$ARGUMENTS.md`** — la spec est morte une fois livrée. Pas d'archivage, suppression directe (`git rm`). Ces deux opérations (backlog + suppression spec) vont dans le même commit `docs:`.
- **Vérification après livraison** selon le routage par risque de `CLAUDE.md` (section "Test après livraison") : cosmétique → 1 ligne dans le chat · logique métier → Vitest · flux UI à risque → bloc ⚡ TEST complet, écrit dans `todo/tests/test-$ARGUMENTS.md` via Write **uniquement si** `/playwright-audit $ARGUMENTS` est prévu (le fichier permet de l'invoquer dans une session future).
- Récapitule en 3 lignes : ce qui a été codé, fichiers touchés, critères d'acceptation validés.
