# 07 — JOURNAL DES DÉCISIONS

> **rôle** : mémoire des choix structurants — pourquoi quelque chose est fait ainsi, et non autrement.
> **contient** : entrées D_XXX avec contexte, options considérées, décision retenue, conséquences.
> **vital parce que** : sans lui, on refait des débats déjà tranchés, ou on "corrige" des choix intentionnels en croyant réparer un bug.
> **à lire avant de** : remettre en question un choix architectural, changer de stack, inverser un comportement qui semble bizarre.
>
> C'est le **registre d'ADR** du projet (Architecture Decision Records). Chaque `D_XXX` est immuable :
> on ne le modifie pas, on en écrit un nouveau qui le supersède (« corrige D_0XX » / « abroge D_0XX »).

---

## INDEX

| id | title | date | time |
| -- | ----- | ---- | ---- |
| D_001 | Reconstruction du site sur Astro, à côté de l'ancien | 2026-10-07 | 10:03 |

> À chaque nouvelle décision : ajouter **aussi** une ligne en haut de cet Index.

---

## CRITÈRES POUR UNE ENTRÉE (les 3 requis)

1. **Difficile à reverser**
2. **Surprenante** sans contexte
3. Issue d'un **vrai trade-off**

Si un critère manque → pas d'entrée. (Une convention de style n'est pas une décision : elle va dans `08`.)

---

## FORMAT D'ENTRÉE

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

---

<!-- Les entrées D_XXX s'ajoutent ici, de la plus récente (haut) à la plus ancienne (bas). -->

### D_001
**Reconstruction du site sur Astro, à côté de l'ancien**

*7 octobre 2026 — 10:03*

| **decision**      | Le site est reconstruit de zéro avec Astro dans `webjourney-astro/`. L'ancien site (`public/`, export Webflow) reste en ligne et intact jusqu'à la bascule. Les URLs sont conservées ; le layout et les textes sont refaits. |
| --- | --- |
| **justification** | Aucune demande de contact depuis le lancement. L'ancien code est un export Webflow : navigation copiée dans 26 fichiers, 9 356 lignes de CSS, jQuery chargé depuis le CDN Webflow, 575 Mo dans `public/`. Chaque évolution coûte trop cher. |
| **alternatives**  | Refonte de la home dans le code existant : rapide, mais conserve la dette et la duplication. Migration à l'identique puis refonte : protège le SEO, mais double le travail alors que les textes changent aussi. |
| **consequences**  | Une baisse SEO temporaire est acceptée par Max. Conserver les URLs reste obligatoire. Plus de jQuery ni de CDN Webflow. Le déploiement passe par un build (`dist/`) avant l'envoi FTP. Aucune évolution sur `public/` hors correctif bloquant. |
