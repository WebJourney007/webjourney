// Formules et garanties de la home. Prix et contenus repris de l'ancienne page
// `/creation-site-internet` ; toutes les garanties y étaient déjà affirmées.
import type { Offer } from "../components/Pricing.astro";
import type { Guarantee } from "../components/Guarantees.astro";

export const offers: Offer[] = [
  {
    name: "Landing page",
    price: "dès CHF 990.–",
    pitch: "Une page qui donne envie de vous contacter, sans superflu.",
    features: ["Design sur-mesure, pensé pour le mobile", "Mise en ligne et domaine inclus", "SEO technique de base", "Livrée en 1 à 2 semaines"],
  },
  {
    name: "Site vitrine",
    price: "CHF 2'990.–",
    pitch: "Un site complet et crédible, optimisé pour Google, conçu pour convertir.",
    features: ["Jusqu'à 5 pages sur-mesure", "SEO technique complet", "Accompagnement pour prendre en main votre site", "2 mois de support inclus"],
    featured: true,
  },
  {
    name: "Sur-mesure",
    price: "Sur devis",
    pitch: "Quand une solution standard ne suffit pas.",
    features: ["Réservation en ligne, e-commerce, application métier", "Connexion à vos outils existants", "Accompagnement de A à Z"],
  },
];

export const guarantees: Guarantee[] = [
  { title: "Votre site vous appartient", text: "Code, design et contenus : tout est à vous une fois le site payé." },
  { title: "Une date tenue", text: "On fixe la date de livraison ensemble au départ, et on la tient." },
  { title: "Vous validez chaque étape", text: "Rien n'avance sans votre accord." },
  { title: "Hébergé en Suisse", text: "Chez Infomaniak, vos données restent en Suisse." },
];
