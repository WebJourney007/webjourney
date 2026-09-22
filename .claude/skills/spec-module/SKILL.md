---
name: spec-module
description: Crée ou met à jour docs/modules/<nom>.md — source de vérité unique d'une vue/page/layout. Accepte n'importe quel point d'entrée : concept flou, code existant, ou les deux. Alimente le dev, les tests Playwright et les briefs design.
user-invocable: true
disable-model-invocation: true
---

# RÔLE

Tu génères ou mets à jour `docs/modules/<nom>.md` — la source de vérité observable d'une vue.

Arguments attendus via `$ARGUMENTS` :
- `<nom>` — nom du module (ex. `projets`, `clients`, `dashboard`). Obligatoire.
- `update` — si présent en second argument, mode mise à jour du module existant.

Si aucun nom n'est fourni, demande lequel — ne devine pas.

---

# AVANT D'ÉCRIRE, LIS

**Toujours :**
- `CONTEXT.md` (racine) — glossaire et vocabulaire canonique
- `docs/00-index.md` — carte de navigation
- `docs/04-ui-ux-guidelines.md` — règles UI globales (couleurs, tokens, patterns)
- `docs/08-design-decisions.md` si existant — décisions de design transversales

**Si le module existe déjà (`update`) :**
- `docs/modules/<nom>.md` — version actuelle
- `git diff HEAD -- <dossier code du module>` — changements récents non encore documentés
  (chemins exacts définis par l'organisation du code dans `docs/05-technical-architecture.md`)

**Pour explorer le code :**
- Point d'entrée de la vue (route/page) pour `<nom>`
- Composants de la vue `<nom>`
- Logique métier / queries associées à `<nom>`
- `docs/06-backlog.md` — items B-NNN liés à ce module (filtre sur `cible:` contenant le nom)
- `docs/modules/<nom>.md` existant si présent (mode update)

---

# DÉTECTER LE POINT D'ENTRÉE

Avant de générer, identifie ce que tu as :

| Situation | Mode |
|---|---|
| Code existant pour ce module | **code → module** : extraire depuis le code |
| Description verbale fournie par l'utilisateur, pas encore codé | **concept → module** : structurer le concept |
| Les deux | **mixte** : code en base, concept pour les intentions non codées |

Annonce le mode détecté en une ligne avant de générer.

---

# RÈGLES DE GÉNÉRATION

- **Recentrer sur le durable (D_092)** : documente les **règles métier, invariants et décisions** — PAS le comportement exhaustif (libellés, états fins, interactions évidentes), qui se **régénère depuis le code**. Une spec module ne duplique jamais ce que le code dit déjà ; elle capture ce que le code ne dit pas (le pourquoi, les cas limites, les choix figés).
- **Non-interactif** : génère sans poser de questions. Avance.
- **`TODO:` précis** là où le code est muet. Jamais `TODO: compléter ici` — toujours `TODO: [question précise sur le comportement manquant]`.
- **Orienté "observable dans le navigateur"** : chaque comportement décrit doit être vérifiable par un testeur sans lire le code.
- **Décisions intentionnelles** : si un comportement semble surprenant, le noter en §Décisions figées avec la raison. Pas corriger, documenter.
- **Bugs identifiés** : les noter explicitement avec `> Bug : [description]` dans la section concernée, ne pas les corriger silencieusement.
- Les `TODO:` et bugs identifiés pendant la génération → les lister aussi dans une section `## ⚠️ Zones à valider` en fin de fichier.

---

# TEMPLATE DU MODULE

Génère `docs/modules/<nom>.md` avec cette structure exacte.
Référence canonique du format : le premier module que tu écris fait jurisprudence — garde-le cohérent.

```markdown
# Module <Nom> — Spec de comportement

> Source de vérité unique du module. Orientée "observable dans le navigateur".
> Base pour générer les specs Playwright et les briefs design.
>
> Généré le YYYY-MM-DD depuis : [sources utilisées : code, concept, backlog B-NNN, etc.]

---

## 1. Entrée et navigation

- Route(s) d'accès
- Item sidebar / lien entrant
- Type de composant (Server / Client)
- Données chargées au montage (query ou fetch)

---

## 2. Types de données fondamentaux

Tableau des entités, statuts, enums manipulés dans cette vue.

---

## 3. Données globales / KPIs (si applicable)

Métriques ou données affichées en permanence (topbar, summary, etc.).

---

## 4. Structure UI

### 4.1 Toolbar / Filtres

### 4.2 Vues disponibles (si multiple)

---

## 5. Comportements interactifs

Une sous-section par composant ou zone d'interaction majeure.

### 5.1 [Composant A]

### 5.2 [Composant B]

...

---

## 6. États limites

Tableau : Situation → Comportement observable.

---

## 7. Persistance

Ce qui est persisté (localStorage, query params, cookies) avec la clé et les valeurs possibles.

---

## 8. Décisions de design figées

Comportements intentionnels qui ne doivent pas être "corrigés" sans discussion.
Format : `**Comportement** — raison`.

---

## ⚠️ Zones à valider

Liste des `TODO:` et bugs identifiés pendant la génération.
À vider au fur et à mesure que les zones sont confirmées ou corrigées.
```

---

# MODE UPDATE

Si `update` est passé en argument :

1. Lis le module existant en entier.
2. Identifie les changements dans le code depuis la dernière génération (git diff ou date du module).
3. Met à jour uniquement les sections affectées — ne retouche pas ce qui n'a pas changé.
4. Ajoute les nouveaux comportements, retire les comportements supprimés.
5. Mets à jour la ligne `Généré le` → `Mis à jour le YYYY-MM-DD`.
6. Si de nouveaux `TODO:` ou bugs apparaissent, les ajouter en `## ⚠️ Zones à valider`.

---

# APRÈS GÉNÉRATION

1. **Mettre à jour `docs/00-index.md`** : ajouter ou mettre à jour la ligne de référence vers le module dans le tableau de navigation.

2. **Mettre à jour `docs/06-backlog.md`** si des items B-NNN liés à ce module ont été intégrés dans le module : ajouter le champ `module: <nom>` à ces items si absent.

3. **Annoncer ce que ce module débloque :**
   - `/spec-feature B-NNN` pour tout item lié : le contexte est désormais dans le module
   - Brief ClaudeDesign : le module est prêt à être collé comme brief design
   - Tests Playwright : chaque §5.x est un scénario de test en prose

---

# FIN

- Ce fichier est un commit `docs:` seul (jamais avec du code).
- Termine par : « Module `<nom>` prêt. » La fraîcheur se maintient en _pull_ (D_092) : l'agent met à jour la spec quand il code le module, ou on régénère à la demande — **pas** de resync systématique après chaque livraison.