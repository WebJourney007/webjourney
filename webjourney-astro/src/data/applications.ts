// Contenu de la page `/applications-sur-mesure` (B-009). Textes tirés des études
// de cas (Cyclo Gordo, Astral Motorclub, Charly's Bike Store) et de la home :
// aucun prix, délai ni chiffre qui n'existe pas déjà ailleurs sur le site.
import type { FaqItem } from "../components/Faq.astro";
import type { Point } from "../components/PointList.astro";
import { SITE } from "../lib/site";
import { testimonials } from "./home";

const PAGE_URL = `${SITE.url}/applications-sur-mesure`;

// Repris de la home, où seuls les titres restent affichés. L'IA n'a pas encore
// de projet livré : c'est le seul point sans étude de cas derrière.
export const appIncluded: Point[] = [
  {
    title: "Réservation et rendez-vous en ligne",
    text: "Vos clients choisissent un créneau et reçoivent une confirmation automatique, jour et nuit. Fini les rendez-vous notés au téléphone.",
  },
  {
    title: "Planning, location, suivi de stock",
    text: "Une interface simple pour gérer vos disponibilités, vos tarifs et vos réservations en autonomie, comme l'équipe d'Astral Motorclub.",
  },
  {
    title: "Connexion à vos outils",
    text: "On se branche sur votre logiciel de gestion sans le remplacer : disponibilités à jour en temps réel, sans double saisie.",
  },
  {
    title: "L'IA, là où elle fait gagner du temps",
    text: "Tri des demandes, réponses aux questions fréquentes, premiers brouillons : l'intelligence artificielle s'ajoute là où elle vous libère du temps.",
  },
];

export const appReview = testimonials.find((review) => review.name === "Alan Lepart");

export const appFaq: FaqItem[] = [
  {
    question: "Combien coûte une application sur mesure ?",
    answer:
      "Chaque outil dépend de votre activité, c'est pourquoi il est sur devis. Vous recevez un prix fixe après un premier échange, gratuit et sans engagement.",
  },
  {
    question: "Pouvez-vous vous connecter au logiciel que j'utilise déjà ?",
    answer:
      "C'est ce que nous avons fait pour Charly's Bike Store : leur module de réservation est relié au logiciel de gestion du magasin. Les disponibilités sont synchronisées en temps réel et chaque réservation arrive directement dans l'outil de l'équipe, sans double saisie.",
  },
  {
    question: "Pourrai-je gérer mes disponibilités moi-même ?",
    answer:
      "Oui. Chez Cyclo Gordo, l'atelier gère seul ses créneaux depuis une interface simple ; chez Astral Motorclub, l'équipe gère ses tarifs, ses disponibilités et ses réservations en autonomie.",
  },
  {
    question: "Mes clients peuvent-ils réserver quand je suis fermé ?",
    answer:
      "Oui, c'est tout l'intérêt. Chez Charly's Bike Store, des rendez-vous ont été pris en ligne dès les premiers jours, y compris le soir et le week-end, quand le magasin est fermé.",
  },
];

export const appStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Applications web sur mesure",
      description:
        "Réservation en ligne, planning, application de location et connexion à votre logiciel de gestion, pour les PME du Valais et de Suisse romande.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "City", name: "Sion" },
        { "@type": "Country", name: "Suisse" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Applications sur mesure", item: PAGE_URL },
      ],
    },
  ],
};
