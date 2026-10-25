# 06 — BACKLOG

> **rôle** : la file d'attente du travail. Quoi faire ensuite, dans quel ordre.
> **contient** : une table `🎯 À FAIRE` (items `B-NNN`), une section Idées, une archive du livré.
> **vital parce que** : source unique de ce qui reste à faire — pas de GitHub Issues en parallèle.
> **à lire avant de** : choisir une tâche, lancer `/spec-feature`, prioriser.

---

## 🎯 À FAIRE

> Trié par **ID décroissant** (récent en haut). `prio` = colonne à scanner, pas un axe de tri.

| id | titre | prio | temps | effort | deps | note |
| -- | ----- | ---- | ----- | ------ | ---- | ---- |
| B-008 | Visibilité : pages locales, fiche Google Business, contenus | 🟠 | j | élevé | B-007 | Ce qui fait monter le trafic. À prioriser avec les chiffres Search Console. |
| B-007 | Bascule vers le nouveau site | 🔴 | h | moyen | B-002 à B-006 | Parité des 29 URLs, envoi FTP de `dist/`, suivi Search Console 2 à 4 semaines. |
| B-006 | Performance, SEO, sécurité | 🟠 | j | moyen | B-002 à B-005 | Images, sitemap généré, en-têtes de sécurité, secrets hors racine web, tracking et information nLPD. |
| B-005 | Blog et ressources | 🟡 | j | moyen | B-001 | blog, 2 articles, ressources, guide-gratuit, compresseur-images, audit. |
| B-004 | Réalisations : gabarit et contenus | 🟠 | j | moyen | B-001 | 10 projets + page liste. Textes rédigés par Max. |
| B-003 | Pages services, contact, légales | 🟠 | j | moyen | B-001 | 4 pages services, à-propos, contact, devis, CGV, mentions légales, 404. Reprise des formulaires PHP. |
| B-002 | Home : design, enchaînement, textes | 🔴 | j | élevé | B-001 | Direction du hero à trancher. |

<!-- Statuts : [ ] à faire · [x] fait · [-] abandonné · [?] idée non qualifiée.
     Nouvel item → en haut. Item livré → migré dans « Archive » ci-dessous. -->

---

## 💡 IDÉES (non qualifiées)

> Pas encore d'ID. Une idée reçoit un `B-NNN` figé dès qu'elle est qualifiée → elle monte dans la table.

-

---

## 📦 ARCHIVE (livré)

> Items terminés, forme compacte : `B-NNN — titre — date`.

- B-009 — Pages services : applications sur mesure, identité visuelle, panneau « Services » — 2026-10-25
- B-001 — Socle Astro — 2026-10-07
