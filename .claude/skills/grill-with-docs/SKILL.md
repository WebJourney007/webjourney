---
name: grill-with-docs
description: Séance de grill qui stress-teste un plan contre le modèle de domaine existant, affine la terminologie, et met à jour la documentation inline (CONTEXT.md, decisions log) au fil des décisions. Utiliser quand l'utilisateur veut clarifier une vision, réfléchir à une feature, ou tester un concept contre la réalité du projet.
user-invocable: true
---

# RÔLE

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

# CHEMINS DE TRAVAIL

Lis d'abord le bloc **"Système documentaire"** dans le `CLAUDE.md` du projet courant pour connaître les chemins exacts. Si ce bloc est absent, demander avant d'écrire quoi que ce soit.

Chemins attendus par défaut :
- Glossaire : `CONTEXT.md` (racine)
- Decisions log : `docs/07-decisions-log.md`
- Backlog : `docs/06-backlog.md`

# PENDANT LA SESSION

## Challenge contre le glossaire

Quand l'utilisateur emploie un terme qui entre en conflit avec un terme existant dans `CONTEXT.md`, le signaler immédiatement. "Ton glossaire définit X comme A, mais tu sembles vouloir dire B — lequel ?"

## Affiner le vocabulaire flou

Quand l'utilisateur utilise un terme vague ou surchargé, proposer un terme canonique précis. "Tu dis 'compte' — veux-tu dire Lead ou Client ? Ce sont deux entités différentes."

## Tester avec des scénarios concrets

Quand des relations de domaine sont en discussion, les stress-tester avec des scénarios précis. Inventer des cas limites qui forcent une réponse précise sur les frontières entre concepts.

## Cross-check avec le code

Quand l'utilisateur décrit le comportement de quelque chose, vérifier si le code est d'accord. Si contradiction : "Ton code fait X, mais tu viens de dire Y — qu'est-ce qui est correct ?"

## Mettre à jour CONTEXT.md inline

Quand un terme est résolu, mettre à jour `CONTEXT.md` immédiatement — ne pas batcher. Format : une ligne par terme.

```
- **Terme** : définition métier en une phrase, sans détail technique.
```

`CONTEXT.md` est un glossaire pur et rien d'autre. Aucun détail d'implémentation, aucun nom de colonne, aucune référence de fichier. Si la définition contient un détail technique → elle va dans `docs/03-data-model.md` à la place.

## Proposer une entrée D_XXX avec parcimonie

Proposer une entrée D_XXX seulement si les **3 critères sont réunis** :

1. **Difficile à reverser** — le coût de changer d'avis plus tard est significatif
2. **Surprenante sans contexte** — un futur lecteur se demandera "pourquoi ils ont fait ça ?"
3. **Issue d'un vrai trade-off** — il y avait de vraies alternatives et on en a choisi une pour des raisons précises

Si un critère manque → pas d'entrée. Quand les 3 sont réunis, ajouter dans le decisions log :

```
### D_XXX
**Titre court**

*JJ mois AAAA — HH:MM*

| **decision**      | ce qui a été choisi |
| --- | --- |
| **justification** | pourquoi ce choix |
| **alternatives**  | ce qui a été refusé et pourquoi |
| **consequences**  | ce que ça implique pour le code/la doc |
```

Ajouter aussi une ligne en haut de l'index du decisions log.

## Idées non qualifiées → backlog

Les idées émergées mais pas encore mûres pour un B-NNN confirmé vont dans la section "Idées" (items `[?]`) du backlog. Pas d'ID, pas de `temps/effort/dépend` — juste le titre et le contexte minimal.
