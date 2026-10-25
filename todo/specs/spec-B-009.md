# Spec B-009 — Pages services : applications sur mesure et identité visuelle

> Source : `docs/06-backlog.md`, ligne B-009 (🟠 · j · élevé · deps B-003).
> Décisions de Max (2026-10-25) : option C (une page par service), menu déroulant au survol de
> « Services », URLs `/applications-sur-mesure` et `/identite-visuelle` (sans export Keyword Planner).

## 1. Spec en une phrase

Le visiteur voit les trois services de l'agence (sites internet, applications sur mesure, identité
visuelle) depuis la navigation, et chacun a sa propre page qui explique le service, montre des
projets livrés et mène au formulaire de contact.

## 2. Pourquoi

Goal directeur : obtenir des demandes de contact. Aujourd'hui « Services » ne mène qu'à la création
de site : le visiteur qui cherche un logo ou un outil de réservation ne trouve pas d'offre, et Google
n'a aucune page à classer sur ces recherches (« création logo Valais », « réservation en ligne »).

## 3. Comportement attendu

### 3.1 Navigation desktop (≥ 62em)

- Barre : `Services ▾` · `Réalisations` · `À propos`. « Services » est un **bouton**, pas un lien.
- Survol de « Services » (appareils `hover: hover`) : un panneau s'ouvre sous le bouton avec 3 liens.
  - **Sites internet** → `/creation-site-internet`
  - **Applications sur mesure** → `/applications-sur-mesure`
  - **Identité visuelle** → `/identite-visuelle`
- Chaque lien porte une ligne de description courte, tirée du pitch existant dans `products.ts`.
- Le panneau reste ouvert pendant que le curseur passe du bouton au panneau (délai de fermeture
  ~150 ms), et se ferme quand le curseur quitte les deux.
- Clic ou tap sur « Services » : ouvre / ferme (tablette en paysage, sans survol).
- Clavier : `Entrée` / `Espace` ouvre, `Tab` parcourt les 3 liens, `Échap` ferme et rend le focus au
  bouton, le focus qui sort du panneau le ferme.
- Clic en dehors : ferme.
- Bouton : `aria-expanded` à jour, `aria-controls` vers le panneau. Pattern « disclosure », pas de
  `role="menu"`.
- Page courante = une des 3 pages services : « Services » en doré, et le lien concerné porte
  `aria-current="page"`.
- Panneau ouvert : la barre ne sort pas de l'écran au scroll et garde son fond (même règle que le
  menu mobile), y compris sur un hero sombre.

### 3.2 Navigation mobile et tablette (< 62em)

- Menu existant : un petit intitulé « Services », puis les 3 liens au même niveau que les autres
  (pas d'accordéon imbriqué), puis `Réalisations`, `À propos`.

### 3.3 Pied de page

- Les 3 liens services remplacent « Services », à plat.

### 3.4 Pages `/applications-sur-mesure` et `/identite-visuelle`

Même squelette pour les deux, sur le modèle de `/creation-site-internet`, sans formules ni tableau
(les deux services sont sur devis).

| # | Section | Contenu | Source |
| - | ------- | ------- | ------ |
| 1 | Hero (`HeroText`) | H1 avec lieu + promesse, accroche, « Démarrer votre projet » + « Voir les réalisations » (ancre vers la section 3), ligne prix « Sur devis : un prix fixe, annoncé après un premier échange » | `appProduct` / `designProduct` |
| 2 | Ce qui est inclus (`PointList`) | Les 4 points avec leur texte | `appCapabilities` / `designIncluded`, supprimés de `products.ts` le 2026-10-25, à reprendre du commit `e5e7bb4` |
| 3 | Projets livrés (`CaseGrid`) | Applications : Astral Motorclub, Cyclo Gordo, Charly's Bike Store · Identité : Varela Brothers, Cirque de Noël | `case-studies.ts` |
| 4 | Témoignage | Applications seulement : Alan Lepart, Astral Motorclub. Identité : aucun disponible, pas de section | `home.ts` |
| 5 | Méthode (`Steps`) | Les 3 étapes de la home, valables pour les 3 services | `methodSteps` |
| 6 | FAQ (`Faq`) | 3 à 5 questions propres au service | voir règle 4.3 |
| 7 | Nos autres services | 2 cartes vers les 2 autres pages services | — |
| 8 | CTA (`Cta`) | Même bloc que les autres pages : contact + WhatsApp + `ReplyNote` | — |

- Titres de page : `Application web sur mesure en Valais | Web journey` · `Identité visuelle et logo en Valais | Web journey`.
- Données structurées : `Service` (provider `#business`, areaServed Valais / Sion / Suisse), `BreadcrumbList`, `FAQPage`, sur le modèle de `serviceStructuredData`.

### 3.5 Liens entrants

- `/creation-site-internet` : section « Nos autres services » (même bloc que 3.4 §7), avant la FAQ.
- Home, sections Applications et Identité : `href` du produit vers sa page, et un second bouton
  « Voir le détail » (crochets, pas un contact) à côté de « Démarrer votre projet ».

## 4. Règles métier

1. **Une seule action de contact** : « Démarrer votre projet » → `/contact`. Pas de lien vers `/demander-un-devis`.
2. **Aucun prix, délai ou chiffre inventé** : les deux services restent « sur devis ».
3. **FAQ : chaque affirmation vient d'une source existante** (études de cas, FAQ de la home, `products.ts`). Toute réponse qui demande un fait absent (délai type, formats de fichiers livrés, cession des droits du logo) est marquée `[à valider par Max]` et n'est pas publiée tant qu'elle n'est pas validée.
4. **Mots d'accent** sans apostrophe ni trait d'union (`docs/08-design-decisions.md`).
5. **Navigation** : les liens du panneau suivent le style « lien de navigation » (le mot roule vers son double doré au survol). Le bouton « Services » n'est pas un bouton terminal (ce n'est pas un contact).
6. **Mouvement** : ouverture du panneau instantanée sous `prefers-reduced-motion`.
7. **Pas de nouvelle dépendance** : le comportement du panneau va dans `src/scripts/nav.ts`, qui gère déjà le menu mobile.

## 5. Impact docs

- `docs/02-functional-spec.md` : section « Navigation principale » (comportement du panneau, 3.1 à 3.3) et section « Pages services ».
- `docs/05-technical-architecture.md` : ajouter les 2 nouvelles URLs (hors des 29 URLs conservées).
- `docs/08-design-decisions.md` : composant « panneau de navigation » (bouton, survol, style des liens).
- `docs/06-backlog.md` : B-009 migré en archive à la livraison.
- **D_002 proposée** pour `docs/07-decisions-log.md` : une page par service, URLs fixées sans données de recherche. Les 3 critères sont remplis : difficile à reverser après la bascule (301 nécessaires), surprenant sans contexte (pourquoi ces URLs), vrai arbitrage (attendre Keyword Planner ou avancer).
- **Écarts doc ↔ code relevés** (à corriger, hors de cette spec) : `05` cite `src/data/site.ts`, le fichier est `src/lib/site.ts` ; `05` dit « aucun JavaScript par défaut » alors que `src/scripts/nav.ts` existe.

## 6. Impact code

Dans `webjourney-astro/` :

| Fichier | Action |
| ------- | ------ |
| `src/lib/site.ts` | `NAV_LINKS` : « Services » devient un groupe de 3 liens (label + href + description). `FOOTER_LINKS` aplatit le groupe. |
| `src/components/Nav.astro` | Bouton « Services » + panneau desktop, intitulé + 3 liens dans le menu mobile. |
| `src/scripts/nav.ts` | Ouverture / fermeture du panneau : survol avec délai, clic, `Échap`, clic dehors, perte du focus. Panneau ouvert = barre non masquée. |
| `src/components/Footer.astro` | Lecture du groupe aplati (si `FOOTER_LINKS` ne suffit pas). |
| `src/pages/applications-sur-mesure.astro` | Création. |
| `src/pages/identite-visuelle.astro` | Création. |
| `src/data/applications.ts` | Création : textes, points inclus, FAQ, données structurées. |
| `src/data/identite.ts` | Création : idem. |
| `src/components/ServiceLinks.astro` | Création : bloc « Nos autres services » (2 cartes), sauf si `CardGrid` convient tel quel (à vérifier avant de créer). |
| `src/pages/creation-site-internet.astro` | Ajout du bloc « Nos autres services ». |
| `src/data/products.ts` | `appProduct` / `designProduct` : `href` vers leur page, second bouton « Voir le détail ». Commentaire « Pas de page dédiée tant que l'export Keyword Planner… » mis à jour. |
| `src/data/sion.ts`, `src/pages/agence-web-sion.astro` | À vérifier : s'ils citent les applications ou l'identité, lien vers la nouvelle page. |

Sitemap : automatique (`@astrojs/sitemap`), rien à faire.

## 7. Hors-scope

- Page carrefour `/services`.
- Formules et prix pour les applications ou l'identité.
- Page dédiée au print (fondu dans l'identité visuelle, choix de Max).
- Nouvelles études de cas, nouveaux visuels ou vidéos.
- Choix des URLs à partir de données de recherche (Keyword Planner) : à refaire avant B-007 si l'export arrive.
- Refonte de la page `/creation-site-internet` (review du 2026-10-25 : proposée, non validée).

## 8. Critères d'acceptation

- [ ] Desktop : survol de « Services » → panneau avec 3 liens ; le curseur va du bouton au panneau sans qu'il se ferme.
- [ ] Desktop : clic sur « Services » ouvre / ferme ; `Échap` ferme et rend le focus ; clic dehors ferme.
- [ ] Clavier seul : on atteint et ouvre les 3 liens sans souris.
- [ ] `aria-expanded` suit l'état du panneau.
- [ ] Sur une page service : « Services » en doré, lien courant avec `aria-current="page"`.
- [ ] Panneau ouvert en haut de la home (hero clair) : fond visible, texte lisible ; la barre ne disparaît pas au scroll.
- [ ] Mobile 360 px : intitulé « Services » + 3 liens dans le menu, pas de débordement horizontal ; 320 px : idem.
- [ ] Pied de page : 3 liens services.
- [ ] `/applications-sur-mesure` et `/identite-visuelle` rendent les sections du tableau 3.4, avec un seul H1.
- [ ] Aucun lien vers `/demander-un-devis` sur ces pages ; tous les boutons de contact mènent à `/contact`.
- [ ] Aucune réponse FAQ marquée `[à valider par Max]` en ligne.
- [ ] Données structurées `Service`, `BreadcrumbList`, `FAQPage` présentes et valides (test des résultats enrichis).
- [ ] Les 2 URLs figurent dans `dist/sitemap-0.xml`.
- [ ] Home : les sections Applications et Identité mènent à leur page.
- [ ] `/creation-site-internet` : bloc « Nos autres services » présent.
- [ ] `pnpm check` : 0 erreur · `pnpm build` : vert.

## Découpage

Un seul item, mais trois livrables dépendants. Ordre d'implémentation : **pages** (sinon le menu
mène à des 404) → **navigation et pied de page** → **liens entrants** (home, page sites). Navigation
transversale → bloc ⚡ TEST complet dans le chat à la livraison.
