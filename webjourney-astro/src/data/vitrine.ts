// Contenu de la page `/creation-site-vitrine`. Repris de l'ancienne page ; le prix
// vient de `offers.ts` (CHF 2'990.–, l'ancienne page affichait 2'999.–).
// Volontairement différente de `/creation-site-internet` : ici un seul produit,
// expliqué en profondeur (définition, périmètre exact, exemples).
import type { Explain } from "../components/ExplainList.astro";
import type { FaqItem } from "../components/Faq.astro";
import { SITE } from "../lib/site";
import { offers } from "./offers";

const PAGE_URL = `${SITE.url}/creation-site-vitrine`;
const vitrine = offers.find((offer) => offer.name === "Site vitrine");

export const vitrinePrice = vitrine?.price ?? "";

export const vitrineBasics: Explain[] = [
  {
    title: "Qu'est-ce qu'un site vitrine ?",
    text: "C'est la version en ligne de votre carte de visite, en mieux : il présente votre activité, vos services et vos valeurs à vos futurs clients, jour et nuit. C'est souvent leur premier contact avec votre entreprise.",
  },
  {
    title: "Pour qui ?",
    text: "Artisans, professions libérales, PME, commerces, associations, startups : tous ceux qui veulent exister en ligne et recevoir des demandes, sans forcément vendre sur internet.",
  },
  {
    title: "Pourquoi sur-mesure plutôt qu'un modèle ?",
    text: "Un site fait sur Wix ou Squarespace ressemble à des milliers d'autres. Un site sur-mesure est unique, plus rapide, mieux compris par Google et construit autour de vos objectifs.",
  },
  {
    title: "Qu'est-ce que ça change pour vous ?",
    text: "Votre activité paraît plus crédible, des prospects vous trouvent sur Google, et le site répond à leurs questions avant même le premier appel.",
  },
];

export const vitrineIncluded = [
  "Design sur-mesure, à votre image",
  "Jusqu'à 5 pages, pensées d'abord pour le mobile",
  "Code propre et rapide, sans empilement d'extensions",
  "SEO technique complet : balises, données structurées, sitemap",
  "Formulaire de contact protégé contre le spam",
  "Google Analytics 4 et Google Tag Manager",
  "Mise en ligne et configuration du domaine",
  "Accompagnement pour prendre en main votre site",
  "2 mois de support",
];

export const vitrineExcluded = [
  "Modifications après la livraison (abonnement en option)",
  "Pages au-delà de celles prévues au départ",
  "Vente en ligne : voir la boutique en ligne",
  "SEO avancé et stratégie de contenu",
  "Rédaction des textes",
];

// Réalisations montrées : des sites vitrines avec étude de cas.
export const vitrineExamples = ["/victor-rossi", "/varela-brothers", "/cirque-de-noel", "/dinoworld"];

export const vitrineFaq: FaqItem[] = [
  {
    question: "Combien de pages comprend un site vitrine ?",
    answer:
      "En général : une page d'accueil, une page services, une page à propos et une page contact. Selon votre activité, on ajoute une page réalisations, une FAQ ou une page par service. La structure est définie ensemble au départ.",
  },
  {
    question: "En combien de temps le site est-il livré ?",
    answer:
      "Comptez 3 à 6 semaines. Le délai dépend surtout de la complexité du design et de la vitesse à laquelle les contenus nous parviennent. On fixe une date ensemble au départ, et on la tient.",
  },
  {
    question: "Puis-je modifier le site moi-même après la livraison ?",
    answer:
      "Oui. Le site vitrine inclut un accompagnement pour prendre en main votre site. Si vous changez souvent vos textes et vos images, nous intégrons un outil simple qui évite de toucher au code : on en parle au cadrage.",
  },
  {
    question: "Est-ce que je dois fournir les textes et les images ?",
    answer:
      "Idéalement oui, vous connaissez votre activité mieux que quiconque. Nous pouvons aussi rédiger vos textes et proposer des visuels libres de droits : c'est une option du devis.",
  },
  {
    question: "Proposez-vous un suivi après la mise en ligne ?",
    answer:
      "Oui. Après les 2 mois de support inclus, l'abonnement Maintenance et sécurité (CHF 99.– / mois, sans engagement) couvre les mises à jour, la surveillance, les sauvegardes et le support. Les évolutions du site se font sur devis.",
  },
];

export const vitrineStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Création de site vitrine professionnel",
      description:
        "Conception et développement de sites vitrines sur-mesure pour PME, indépendants et entrepreneurs en Valais et à Sion : design sur-mesure, site rapide, SEO technique complet.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "City", name: "Sion" },
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "Country", name: "Suisse" },
      ],
      offers: { "@type": "Offer", price: Number(vitrinePrice.replace(/\D/g, "")), priceCurrency: "CHF" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Création de site internet", item: `${SITE.url}/creation-site-internet` },
        { "@type": "ListItem", position: 3, name: "Site vitrine", item: PAGE_URL },
      ],
    },
  ],
};
