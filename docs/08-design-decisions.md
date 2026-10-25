# 08 — DÉCISIONS DESIGN GLOBALES

> **rôle** : les conventions UI/UX transversales, vivantes (≠ decisions log).
> **contient** : patterns visuels récurrents, règles d'interaction stabilisées.
> **vital parce que** : centralise les choix de design réutilisables pour ne pas les re-discuter.
> **à lire avant de** : concevoir un nouvel écran ou un composant transversal.

---

> ⚠️ Ce fichier n'est **pas** un ADR. C'est un guide de conventions vivant, qu'on édite
> librement. Les décisions structurantes (avec alternatives pesées + immuabilité) vont
> dans [07-decisions-log.md](07-decisions-log.md).

## Deux langages, deux usages

Le site a deux signatures visuelles. Chacune a un seul rôle : on ne les mélange pas.

| Signature | Réservée à | Exemples |
| --- | --- | --- |
| **Terminal** : invite `>` et curseur `_` qui clignote | Tout ce qui met en relation avec l'agence | « Parler de mon projet », téléphone, WhatsApp, email, envoi d'un formulaire |
| **Crochets** | Les boutons d'action qui ne sont pas un contact | « Voir nos réalisations », « Retour à l'accueil » |

Conséquence : un visiteur qui voit l'invite `>` sait qu'il va pouvoir écrire ou appeler.

## Composants

- **Bouton de contact** (`Button`, variante `contact`) : crochets dorés + invite + curseur. Survol : à choisir dans le labo (le surlignage doré a été écarté).
- **Bouton secondaire** (`Button`, variante par défaut) : crochets de la couleur du texte, qui s'élargissent au survol.
- **Lien de contact en texte** (classe `contact-link`) : l'invite et le curseur n'apparaissent qu'au survol. Utilisé dans le bandeau du haut et le pied de page.
- **Lien de navigation** : au survol, le mot roule vers son double doré. Pas de crochets. La page courante est en doré.

## Méthode

- Toute nouvelle proposition visuelle se teste d'abord sur la page `/labo`, puis se reporte sur le site une fois choisie.

## Mots d'accent

- Les mots mis en valeur dans les titres passent par le composant `Accent`. La police d'accent ne contient que des lettres non accentuées et des chiffres : pas de ponctuation, pas d'apostrophe, pas de trait d'union.
- Éviter dans un mot d'accent : apostrophe et trait d'union (ils s'afficheraient dans une autre police).
- Couleur : `--accent-strong` sur fond clair, `--accent` sur fond sombre.
- Signes : aigu, grave et cédille sont une virgule dessinée ; le circonflexe est un chevron.

## Mouvement

- Toute animation respecte `prefers-reduced-motion` : le curseur ne clignote plus, les transitions sont instantanées.
