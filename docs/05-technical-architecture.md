# 05 — ARCHITECTURE TECHNIQUE

> **rôle** : la stack et les choix techniques structurants.
> **contient** : technologies, organisation du code, conventions, intégrations externes.
> **vital parce que** : connaître la stack évite d'introduire des outils redondants ou incompatibles.
> **à lire avant de** : ajouter une dépendance, créer un module, changer la structure du code.

---

<!-- À REMPLIR : stack (langages, frameworks, CMS/DB, hébergement), organisation du code,
     conventions structurantes (style, tests, CI). -->

## Stack

| Brique | Choix |
| --- | --- |
| Générateur | Astro 7, sortie statique |
| Langage | TypeScript strict (TypeScript 6 : `astro check` ne supporte pas encore la version 7) |
| Styles | CSS natif : jetons globaux + styles par composant. Pas de framework CSS. |
| JavaScript côté visiteur | Aucun par défaut. Pas de jQuery, pas de CDN Webflow. |
| Formulaires | Scripts PHP de l'ancien site, à reprendre avec B-003 |
| Hébergement | Infomaniak (Apache), envoi de `webjourney-astro/dist/` par FTP |
| Paquets | pnpm |

## Organisation du code

- `webjourney-astro/` — nouveau site.
  - `src/pages/` : une page par URL.
  - `src/layouts/BaseLayout.astro` : structure HTML et balises SEO.
  - `src/components/` : bouton, en-tête, pied de page.
  - `src/data/site.ts` : coordonnées et navigation, source unique.
  - `src/styles/global.css` : polices, jetons de design, styles de base.
  - `public/` : fichiers servis tels quels (polices, favicon).
- `public/` (racine du repo) — ancien site, en ligne jusqu'à la bascule (D_001).

Commandes, depuis `webjourney-astro/` : `pnpm dev` · `pnpm check` · `pnpm build`.

## Conventions

- **URLs** : `trailingSlash: 'never'` et `build.format: 'file'`. Chaque page sort en `nom.html`, servie sans extension par le `.htaccess`. L'URL canonique est celle sans extension.
- **Poste Windows de Max** : le compilateur natif d'Astro est bloqué par le contrôle des applications de Windows. `pnpm-workspace.yaml` installe sa variante WebAssembly officielle, qu'Astro utilise en repli. Ne pas retirer ce réglage.
- **Accent** : `--accent` (doré) sur fond sombre et en aplat ; `--accent-strong` pour le texte sur fond clair.

## URLs à conserver (29)

Racine : `/` · `a-propos` · `agence-web-sion` · `audit` · `blog` · `cgv` · `compresseur-images` · `contact` · `creation-boutique-en-ligne` · `creation-site-internet` · `creation-site-vitrine` · `demander-un-devis` · `guide-gratuit` · `mentions-legales` · `nos-sites-internet` · `ressources` · `404`

Réalisations : `astral-motorclub` · `charlys-bike-store` · `cirque-de-noel` · `cyclo-gordo` · `dinoworld` · `insectopia` · `la-meltingpote` · `pirates-aventure` · `varela-brothers` · `victor-rossi`

Blog : `blog/7-erreurs-site-web-pme` · `blog/combien-coute-un-site-web-en-suisse-2026`
