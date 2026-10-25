# Paramétrage Odoo — Web journey

| Ouverture | 2026-10-14 | 14:01 |
| Clôture | | |

> Objectif : tout le cycle client dans Odoo, de la demande à l'abonnement, sans ressaisie.
> Odoo Online (base **webjourney1.odoo.com**), plan **Standard**, 1 utilisateur. Interdits : **Studio**, **2ᵉ société** (bascule auto en Custom).

## Progression

- [x] Phase 0 — Cadrage (apps, flux cible, plan)
- [x] Phase 1 — Fondations : société, TVA, banque / QR-facture, mails (clôturée 2026-10-16 13:52, reliquats ci-dessous)
- [ ] Phase 2 — Catalogue & processus : produits, modèle de projet, abonnements
- [ ] Phase 3 — Acquisition : pipeline CRM, formulaire du site ➜ CRM
- [ ] Phase 4 — Données : import clients, abonnements en cours, historique factures (2026-10-17 13:29 : factures émises + en attente saisies, abonnements domaine/hébergement saisis ; reste relances + rapprochement bancaire)
- [ ] Phase 5 — Test complet avec un faux client, puis mise en service
- [ ] Phase 6 — Extensions : Rendez-vous, Email Marketing, Feuilles de temps
- [ ] Phase 7 — À évaluer : Social Marketing (vs outil dédié)

## Flux cible

Demande (site ➜ CRM) ➜ devis signé en ligne ➜ projet créé depuis un modèle ➜ facture d'acompte 50 % ➜ facture finale à la mise en ligne ➜ abonnement maintenance (mensuel) + hébergement (annuel). Le client suit tout depuis son portail.

## Questions ouvertes

- Hébergement + domaine : prix annuel ? Facturé à part ou inclus dans la maintenance ? (phase 2)
- Factures passées : importer dans Odoo ou garder l'ancien outil comme archive ? (phase 4)
- Clients actuels en hébergement / maintenance : dates de renouvellement connues ? (phase 4)

---

## Phase 1 — acquis

- TVA : non assujetti (2026-10-14 17:26). Taxes par défaut ventes **et** achats vides.
- Banque : IBAN normal (pas QR-IBAN) sur le journal Banque, relevés « Manuel ». Codes QR actifs, facture test OK.
- Mise en page : Light, Montserrat, #1e1e1e / #a8700a.
- Mails : base réelle = `webjourney1.odoo.com` (`webjourney.odoo.com` = autre base, ne jamais l'utiliser).
  - Sous-domaine `odoo.webjourney.ch` : MX ➜ `webjourney1.odoo.com`, SPF OK. Domaine d'alias Odoo = `odoo.webjourney.ch`.
  - Catchall `suivi`, rebond `bounce`, alias CRM `demandes`.
  - Boîtes Infomaniak gardées : `hello@` prospects · `suivi@` clients qualifiés · `compta@` factures · `inbox@` tri perso.
  - Utilisateur Odoo : e-mail = `suivi@webjourney.ch`.

### Reliquats phase 1 (avant le 1er mail envoyé à un client)

- [x] DNS vérifié 2026-10-17 13:52 : DKIM racine + sous-domaine (CNAME ➜ clé Odoo), SPF racine OK — DMARC est en `p=reject` :
  - CNAME `odoo._domainkey` ➜ `odoo._domainkey.odoo.com.`
  - CNAME `odoo._domainkey.odoo` ➜ `odoo._domainkey.odoo.com.`
  - SPF remplacé par `v=spf1 include:spf.infomaniak.ch include:_spf.odoo.com -all`
- [x] Test Gmail « Afficher l'original » : SPF / DKIM / DMARC = PASS (2026-10-17).
- [ ] Alias `inbox` (Documents) : sécurité ➜ partenaires authentifiés.
- [ ] Option : `compta@` redirigée (copie gardée) vers `purchases@odoo.webjourney.ch`.

### CGV v2 — avant publication (ajouté 2026-10-18 17:44)

Brouillon : https://claude.ai/code/artifact/e0652fb6-4175-40b9-89a8-772e18ab817d

- [ ] Compléter les crochets [ ] :
  - art. 1 : raison sociale, forme juridique, IDE
  - art. 4 : délai de paiement (15 ou 30 jours ?), frais de rappel
  - art. 5 : nombre de tours de corrections, taux horaire, délai de suspension (60 jours)
  - art. 8 : préavis de résiliation (15 jours / 60 jours), délai de suspension (10 jours), préavis de hausse de prix (60 jours)
  - art. 9 : délai de suppression après la fin de l'abonnement (30 jours)
  - art. 15 : préavis de modification (30 jours), date de publication
- [ ] Vérifier l'art. 3 : liste des prestations = offres réellement vendues
- [ ] Relecture par un juriste ou la fiduciaire
- [ ] Odoo : délai de paiement par défaut aligné sur l'art. 4
- [ ] Odoo : paramètre « Conditions générales » ➜ lien vers webjourney.ch/cgv sur devis et factures
- [ ] Publier la page `/cgv` sur le nouveau site (+ lien dans le footer)
- [ ] Ancien site : mettre à jour `public/cgv.html` (erreur TVA) en attendant la bascule
- [ ] Devis test : vérifier que le lien vers les CGV apparaît bien avant la signature

---

## Plan détaillé — Phase 2 : Catalogue & processus

Offres reprises du site actuel (`public/creation-site-internet.html`, `creation-boutique-en-ligne.html`).

### 2.1 Modèle de projet (avant les produits : ils le référencent)

- Projet ➜ Nouveau : « MODÈLE — Création site ».
- Contenu complet : [resources/checklist-site-vitrine.md](../resources/checklist-site-vitrine.md) (`##` = colonne, `###` = tâche, cases = checklist dans la description).
- Colonnes : Démarrage · Brief · Contenus · Maquette · Développement · Recette & relecture · Mise en ligne · Livraison · Terminé.
- Section « 0. Commercial » : reste dans Ventes / CRM (avant signature), sauf « Signature & acompte » ➜ colonne Démarrage.
- Partage portail : le client voit l'avancement.

### 2.2 Produits one-shot (Ventes ➜ Produits ➜ Nouveau)

| Produit | Prix | Type | Créer à la commande | Modèle de projet |
| --- | --- | --- | --- | --- |
| Landing page | 990 (dès) | Service | Projet | MODÈLE — Création site |
| Site vitrine professionnel | 2'990 | Service | Projet | MODÈLE — Création site |
| Boutique en ligne | 4'999 (dès) | Service | Projet | MODÈLE — Création site |

- Politique de facturation : quantités commandées (pas de jalons : 2 paiements = acompte + solde, YAGNI).
- Acompte : sur le devis confirmé ➜ Créer une facture ➜ Acompte (pourcentage) 50 %. Facture finale à la mise en ligne, l'acompte est déduit automatiquement.
- Prix « dès » : prix de base, ajusté ligne par ligne sur le devis.

### 2.3 Abonnements

- Abonnements ➜ Configuration ➜ Plans récurrents : **Mensuel** (1 mois) · **Annuel** (1 an).
- Abonnements ➜ Produits ➜ Nouveau, type Service, onglet prix récurrents :

| Produit | Plan | Prix |
| --- | --- | --- |
| Sécurité & Maintenance | Mensuel | 99 |
| Sécurité & Maintenance e-commerce | Mensuel | 149 |
| Accompagnement | Mensuel | 249 |
| Hébergement + domaine | Annuel | ? (question ouverte) |

- Sans engagement (site) ➜ pas de durée minimale, fermeture possible par le client.

### 2.4 Test de la phase

- Devis test « Site vitrine » + « Sécurité & Maintenance » pour Client Test ➜ confirmer ➜ projet créé depuis le modèle ? ➜ facture d'acompte 50 % ➜ abonnement créé ?

Sources :
- https://www.odoo.com/documentation/20.0/applications/sales/subscriptions.html
- https://www.odoo.com/documentation/20.0/applications/sales/sales/invoicing/milestone.html
