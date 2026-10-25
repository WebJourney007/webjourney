# Checklist — Site vitrine (du devis à la livraison)

> Pense-bête complet pour un site vitrine Web journey (offre « jusqu'à 5 pages, SEO technique complet, formation, 2 mois de support »).
> Structure calquée sur le modèle de projet Odoo : `##` = colonne · `###` = tâche · cases = micro-tâches (checklist dans la description de la tâche).
> 🧾 = action dans Odoo · ⚠️ = piège fréquent

---

## 0. Commercial

### Devis
- [ ] 🧾 Devis envoyé depuis Odoo (signature en ligne activée)
- [ ] Périmètre écrit noir sur blanc : nombre de pages, fonctionnalités, nombre de tours de retours inclus, ce qui est hors forfait
- [ ] Délai indicatif et conditions (acompte 50 %, solde à la mise en ligne)
- [ ] 🧾 Activité de relance planifiée à J+3
- [ ] Relance J+3 (mail court) · J+7 (appel)

### Signature & acompte
- [ ] 🧾 Devis signé ➜ commande confirmée ➜ projet créé depuis le modèle
- [ ] 🧾 Facture d'acompte 50 % émise
- [ ] 🧾 Paiement de l'acompte reçu et rapproché ➜ **pas de démarrage avant**
- [ ] Mail de bienvenue : prochaines étapes, calendrier, lien vers le questionnaire
- [ ] 🧾 Accès portail client envoyé

---

## 1. Brief

### Questionnaire & appel de lancement
- [ ] Questionnaire de brief envoyé
- [ ] Questionnaire reçu (relancer à J+3)
- [ ] Appel de lancement planifié (30–60 min)
- [ ] Objectif n°1 du site défini (appels, demandes, réservations…)
- [ ] Cible(s) et zone géographique
- [ ] 3 concurrents ou sites de référence (aimés / pas aimés)
- [ ] Ton et image souhaités
- [ ] Interlocuteur unique côté client + qui valide

### Arborescence & périmètre
- [ ] Liste des pages (≤ 5) validée
- [ ] Sections de chaque page
- [ ] Fonctionnalités : formulaire, carte, prise de RDV, galerie, avis, multilingue ?
- [ ] Mots-clés principaux (métier + ville) pour le SEO
- [ ] Compte-rendu écrit envoyé au client (vaut validation du périmètre)

### Accès & existant
- [ ] Nom de domaine : existant ? chez qui ? qui en est titulaire ?
- [ ] Accès registrar / ancien hébergeur obtenus (ou transfert à prévoir)
- [ ] ⚠️ E-mails du client : où sont-ils hébergés ? (ne rien casser à la mise en ligne)
- [ ] Ancien site : liste des URLs existantes (pour les redirections 301)
- [ ] Fiche Google Business Profile : existe ? accès gestionnaire ?
- [ ] Réseaux sociaux à lier
- [ ] Outils existants (réservation, newsletter, analytics)

---

## 2. Contenus

### Collecte
- [ ] Logo en vectoriel (SVG / AI / PDF) + versions claire / sombre
- [ ] Charte : couleurs, polices (si existantes)
- [ ] Textes de chaque page (ou notes pour rédaction)
- [ ] Photos haute résolution + ⚠️ droits d'utilisation confirmés
- [ ] Coordonnées : adresse, téléphone, mail, horaires
- [ ] Infos légales : raison sociale, forme juridique, IDE, responsable (mentions légales)
- [ ] Témoignages / avis clients, références, logos partenaires
- [ ] Relance contenus manquants (J+5, puis J+10) ⚠️ 1ʳᵉ cause de retard

### Préparation
- [ ] Rédaction / réécriture SEO (si incluse)
- [ ] Titres et accroches orientés objectif
- [ ] Banque d'images complémentaire si photos manquantes
- [ ] Optimisation des images (recadrage, poids)

---

## 3. Maquette

### Conception
- [ ] Moodboard / direction artistique (si utile)
- [ ] Wireframe de l'accueil
- [ ] Maquette accueil desktop
- [ ] Maquette accueil mobile
- [ ] Déclinaison des pages intérieures (gabarit type)
- [ ] Vérification contrastes et lisibilité

### Présentation & validation
- [ ] Présentation au client (visio ou lien commenté)
- [ ] Retours collectés par écrit (une seule liste consolidée)
- [ ] Tour de corrections n°1 (n°2 si inclus)
- [ ] ⚠️ Validation écrite de la maquette (mail) ➜ tout changement après = hors forfait

---

## 4. Développement

### Mise en place
- [ ] Repo créé + projet Astro initialisé
- [ ] Design tokens (couleurs, typo, espacements) depuis la maquette
- [ ] Polices auto-hébergées (woff2), `font-display: swap`
- [ ] Environnement de préproduction (sous-domaine) protégé + `noindex`

### Intégration
- [ ] Header / navigation (desktop + menu mobile)
- [ ] Footer (coordonnées, liens légaux, réseaux)
- [ ] Composants réutilisables (boutons, cartes, sections)
- [ ] Pages 1 à 5 intégrées
- [ ] Responsive : 360 px, 768 px, 1024 px, 1440 px
- [ ] États hover / focus / actif
- [ ] Animations sobres + respect de `prefers-reduced-motion`

### Formulaire de contact
- [ ] Formulaire PHP : champs, validation côté client et serveur
- [ ] Anti-spam (honeypot / délai minimal)
- [ ] Mail de notification au client + accusé de réception au visiteur
- [ ] Message de succès / d'erreur clair
- [ ] Case de consentement + lien vers la politique de confidentialité

### Pages obligatoires
- [ ] Mentions légales (impressum)
- [ ] Politique de confidentialité (nLPD, et RGPD si clients UE)
- [ ] Bannière cookies **uniquement** si traceurs non essentiels
- [ ] Page 404 personnalisée

### SEO technique
- [ ] `<title>` et meta description uniques par page
- [ ] Un seul H1 par page, hiérarchie Hn propre
- [ ] Attributs `alt` sur toutes les images
- [ ] URLs propres et lisibles
- [ ] Balise canonical
- [ ] `sitemap.xml` + `robots.txt`
- [ ] Données structurées `LocalBusiness` (adresse, horaires, téléphone)
- [ ] Open Graph + image de partage (1200×630)
- [ ] Favicon + icônes (apple-touch-icon, manifest)
- [ ] Liens internes entre pages
- [ ] Langue déclarée (`lang="fr-CH"`)

### Performance & accessibilité
- [ ] Images AVIF/WebP, dimensions fixées, lazy-loading hors écran
- [ ] Image héro prioritaire (`fetchpriority="high"`)
- [ ] Scripts tiers différés
- [ ] Lighthouse mobile ≥ 90 sur les 4 axes
- [ ] Navigation clavier complète, focus visible
- [ ] Contrastes AA

### Mesure
- [ ] Outil d'analytics installé (respectueux de la vie privée ou avec consentement)
- [ ] Suivi des conversions (envoi du formulaire, clic téléphone, clic mail)

---

## 5. Recette interne

### Tests
- [ ] Chrome, Firefox, Safari, Edge
- [ ] iPhone + Android réels
- [ ] Tous les liens (internes, externes, tel:, mailto:)
- [ ] Formulaire : envoi réel, réception, accusé, anti-spam
- [ ] Orthographe et typographie suisse (espaces insécables, apostrophes)
- [ ] Validation HTML (W3C)
- [ ] Données structurées (test des résultats enrichis Google)
- [ ] Aperçu de partage (LinkedIn, WhatsApp)
- [ ] Impression / zoom 200 %

---

## 6. Relecture client

### Retours
- [ ] Lien de préproduction envoyé avec consignes de relecture
- [ ] Retours consolidés reçus par écrit
- [ ] Corrections appliquées
- [ ] ⚠️ Demandes hors périmètre identifiées ➜ devis complémentaire
- [ ] Validation finale écrite (« bon pour mise en ligne »)

---

## 7. Mise en ligne

### Domaine & hébergement
- [ ] Hébergement Infomaniak prêt (site créé, PHP actif)
- [ ] Domaine : transfert ou DNS pointés (A / AAAA)
- [ ] ⚠️ Enregistrements MX / SPF / DKIM du client intacts ➜ ses mails fonctionnent toujours
- [ ] Certificat SSL actif + redirection HTTP ➜ HTTPS
- [ ] Version canonique www / sans www + redirection

### Déploiement
- [ ] Build de production
- [ ] Envoi par FTP
- [ ] `noindex` de préproduction **retiré**
- [ ] Redirections 301 des anciennes URLs
- [ ] Formulaire testé **en production** (configuration SMTP)
- [ ] Test complet rapide en production (pages, liens, mobile)

### Référencement
- [ ] Google Search Console : propriété validée + sitemap envoyé
- [ ] Bing Webmaster Tools (import depuis Search Console)
- [ ] Google Business Profile : URL du site, catégories, horaires à jour
- [ ] Analytics : données reçues
- [ ] Sauvegarde initiale du site

---

## 8. Livraison & clôture

### Remise au client
- [ ] Formation à la gestion du contenu (visio, enregistrée si possible)
- [ ] Mini-guide / récapitulatif écrit
- [ ] Accès remis (domaine, hébergement, analytics, Search Console)
- [ ] Date de fin des 2 mois de support communiquée

### Facturation
- [ ] 🧾 Facture de solde (acompte déduit)
- [ ] 🧾 Paiement reçu et rapproché
- [ ] 🧾 Abonnement hébergement + domaine (annuel) créé
- [ ] 🧾 Abonnement Sécurité & Maintenance proposé ➜ créé si accepté

### Suivi & capitalisation
- [ ] Demande d'avis Google (lien direct)
- [ ] Demande de témoignage + autorisation de publier en référence
- [ ] Étude de cas / page portfolio
- [ ] 🧾 Activité J+30 : contrôle indexation Search Console + premières stats
- [ ] 🧾 Activité fin du support (J+60) : bilan + relance maintenance
- [ ] 🧾 Projet passé en « Terminé »
