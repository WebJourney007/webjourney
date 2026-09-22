---
name: integrate-decision
description: Intègre une décision structurante dans les docs officielles sans produire de code. Remplaçant du "Mode décision" — se déclenche quand l'utilisateur formule une décision à figer dans la doc (ex. "j'ai décidé que… intègre ça dans la doc"). Invocable manuellement ou automatiquement sur ce type de formulation.
user-invocable: true
---

# RÔLE

Tu figes une décision dans les docs officielles **avant** tout code.
Tu ne codes rien. Tu ne décides pas à la place de l'utilisateur si la décision est ambiguë.

# ÉTAPES OBLIGATOIRES

## 1. Ne pas coder

Suspendre toute implémentation. Ce skill produit uniquement de la documentation.

## 2. Reformuler la décision

Avant de modifier quoi que ce soit, résumer en une phrase :

> "Tu décides que **[X]**, parce que **[raison]**, ce qui implique **[conséquence principale]**."

Si la décision est ambiguë, poser **une seule question** pour clarifier. Ne pas deviner.

## 3. Identifier les docs concernées

Lire `docs/00-index.md` et identifier les fichiers à mettre à jour.

| Si la décision touche… | Fichier à mettre à jour |
| ---------------------- | ----------------------- |
| Le produit, la vision | `docs/01-product-brief.md` |
| Les fonctionnalités attendues | `docs/02-functional-spec.md` |
| Le modèle de données / state | `docs/03-data-model.md` |
| Les couleurs, layout, UX | `docs/04-ui-ux-guidelines.md` |
| La stack ou l'architecture | `docs/05-technical-architecture.md` |
| Toujours (si structurant) | `docs/07-decisions-log.md` |
| Si ça crée du travail futur | `docs/06-backlog.md` |

## 4. Mettre à jour les docs

Modifier **uniquement** les fichiers identifiés à l'étape 3.
Ne pas modifier le code applicatif.

## 5. Ajouter une entrée dans decisions-log (si structurant)

Une décision est **structurante** si elle :
- remet en question une D_XXX existante
- introduit un choix technique ou architectural nouveau
- modifie la stratégie produit ou l'ordre des priorités
- change une règle permanente du projet

Format :

```
### D_XXX

**Titre court**

_JJ mois AAAA — HH:MM_

| **decision**      | ce qui a été choisi |
| --- | --- |
| **justification** | pourquoi ce choix |
| **alternatives**  | ce qui a été refusé et pourquoi |
| **consequences**  | ce que ça implique pour le code / la doc |
```

Ajouter aussi une ligne en haut de l'index (table) du decisions log.

## 6. Mettre à jour le backlog (si la décision crée du travail)

Si la décision implique une tâche future, ajouter un item dans `docs/06-backlog.md`
au format B-NNN.

## 7. Proposer la prochaine action

```
Décision intégrée dans :
- [fichier 1] — [ce qui a changé]
- [fichier 2] — [ce qui a changé]

Prochaine étape recommandée :
→ commit docs: + [liste des fichiers] / puis /implement B-NNN si applicable
```

Attendre la validation de l'utilisateur avant tout commit ou toute implémentation.

# CE QUE CE SKILL NE FAIT PAS

- Il ne produit pas de code.
- Il ne choisit pas à la place de l'utilisateur si la décision est ambiguë.
- Il ne modifie pas le code applicatif ni aucun fichier hors `docs/` et `CLAUDE.md`.
