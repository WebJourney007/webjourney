# Refonte du site sur Astro

| Ouverture | 2026-10-07 | 10:03 |
| Clôture | | |

## Progression

- [x] Phase 0 — Correctif site en ligne : boutons de contact de la home vers `/contact` (2026-10-07 10:00, commité 2026-10-25 18:55 sur `feat/astro-v2`, non déployé)
- [x] Phase 1 — Socle Astro (B-001) (2026-10-07 10:10, check et build verts)
- [ ] Phase 2 — Home (B-002)
- [ ] Phase 3 — Pages services, contact, légales (B-003)
- [ ] Phase 4 — Réalisations (B-004)
- [ ] Phase 5 — Blog et ressources (B-005)
- [ ] Phase 6 — Performance, SEO, sécurité (B-006)
- [ ] Phase 7 — Bascule (B-007)
- [ ] Phase 8 — Visibilité (B-008)

## Cadre

- Nouveau site dans `webjourney-astro/`, ancien site intact dans `public/` jusqu'à la bascule.
- 2026-10-25 18:55 : la v2 développée hors repo (`test/webjourney`, 32 pages) remplace l'ébauche de `webjourney-astro/`. Check 0 erreur, build vert. Les phases 2 à 5 sont à recocher après relecture. Les vidéos restent hors git (déploiement FTP).
- Décision et arbitrages : D_001 dans `docs/07-decisions-log.md`.
- Les 29 URLs actuelles sont conservées (liste dans `docs/05-technical-architecture.md`).
- Layout et textes sont refaits. Les textes des réalisations sont rédigés par Max.

## Phase courante — 2. Home (B-002)

Avancée étape par étape, en commençant par l'en-tête et les boutons.

- Fait (2026-10-07 11:55) : bandeau téléphone + email au-dessus de la navigation ; composant `Accent` (accents de la police d'accent, sans JavaScript) ; page `/labo` avec 6 boutons (B1 à B6) et 6 survols de navigation (N1 à N6).
- Fait (2026-10-07 12:05) : règle d'usage terminal / crochets écrite dans `docs/08-design-decisions.md` ; bouton de contact en style terminal (survol : surlignage par blocs) ; liens de navigation crochets + texte qui roule ; liens de contact du bandeau et du pied de page ; circonflexe et cédille dessinés en CSS.
- Fait (2026-10-07 12:20) : liens de navigation réduits au texte qui roule ; surlignage doré du bouton de contact retiré ; accents aigu, grave et cédille en virgule dessinée ; labo refait avec 6 survols du bouton de contact (T1 à T6).
- Fait (2026-10-25 19:10) : home réordonnée pour la conversion. Hero → site internet → étude de cas Astral → applications → identité → témoignages → méthode → fondateur → FAQ → CTA. Les listes « Inclus » sont fusionnées dans leur section produit, la section problème est supprimée (le lien vers l'audit passe sous le CTA), le bouton « Demander un devis » est retiré des sections produit. Témoignages signés « Alan Lepart, Astral Motorclub », `numberOfEmployees` retiré, logo Aleiko renommé. Stats Astral inchangées pour l'instant.
- Règle de travail : toute proposition se teste d'abord dans `/labo`, puis se reporte sur le site.
- En attente : choix de Max parmi T1 à T6 ; accord pour supprimer `src/components/lab/NavLab.astro`, qui n'est plus utilisé.
- À supprimer avant la bascule : `src/pages/labo.astro` et `src/components/lab/`.

1. Trancher la direction du hero.
2. Arrêter l'enchaînement des sections et les textes.
3. Construire les sections une par une, mobile d'abord.
4. Retirer le `noindex` provisoire de `src/pages/index.astro`.

## Questions ouvertes

- Direction du hero de la home (A : texte + capture d'un site client · B : photo plein écran · C : mosaïque de captures).
- Trafic actuel (visites par mois, clics Search Console sur 3 mois) pour prioriser la phase 8.
