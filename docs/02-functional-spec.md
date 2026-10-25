# 02 — SPEC FONCTIONNELLE

> **rôle** : ce que l'app fait, vue par vue / feature par feature.
> **contient** : comportements attendus, règles métier, parcours utilisateur.
> **vital parce que** : c'est la référence pour coder ou spécifier sans réinventer.
> **à lire avant de** : coder une feature, écrire une spec `/spec-feature`, vérifier un comportement.

---

<!-- À REMPLIR au fil du projet. Une section par vue ou par module fonctionnel.
     Décris le COMPORTEMENT (ce que l'utilisateur voit / peut faire), pas l'implémentation. -->

## Navigation principale

- **Desktop (≥ 992 px)** : `Services ▾` · `Réalisations` · `À propos`, logo au centre, « Démarrer votre projet » à droite.
- **« Services »** est un bouton qui ouvre un panneau de 3 liens, chacun avec une phrase : Sites internet (`/creation-site-internet`), Applications sur mesure (`/applications-sur-mesure`), Identité visuelle (`/identite-visuelle`).
  - Souris : le survol ouvre ; le panneau reste ouvert pendant le passage du bouton au panneau ; il se ferme 150 ms après la sortie du curseur. Un clic de souris sur le bouton laisse le panneau ouvert.
  - Tap et clavier : le clic ouvre et ferme. `Échap` ferme et rend le focus au bouton ; le focus qui part vers un autre élément ferme ; un clic en dehors ferme.
  - Sur une page service, « Services » est en doré et le lien de la page porte `aria-current="page"`.
  - Panneau ouvert : la barre garde son fond et ne sort pas de l'écran au scroll.
- **Mobile et tablette** : le menu affiche l'intitulé « Services », les 3 liens, puis `Réalisations` et `À propos` sous un filet.
- **Pied de page** : les 3 liens services, à plat.

## Pages services

Trois pages, une par besoin du client : `/creation-site-internet` (formules et prix), `/applications-sur-mesure` et `/identite-visuelle` (sur devis).

- Les deux pages sur devis : hero (promesse, « Sur devis : un prix fixe, annoncé après un premier échange »), ce qui est inclus, réalisations de la famille du service (filtre de `/nos-sites-internet`), témoignage (applications seulement), méthode en 3 étapes, FAQ, « Nos autres services », appel à l'action.
- Les trois pages se terminent par « Nos autres services » : les deux autres services, chacun avec son lien.
- Une seule action de contact : « Démarrer votre projet » vers `/contact`. Aucun lien vers `/demander-un-devis`.
- Aucun prix, délai ou chiffre qui n'existe pas déjà ailleurs sur le site.

