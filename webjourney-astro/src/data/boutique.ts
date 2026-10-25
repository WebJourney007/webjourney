// Contenu de la page `/creation-boutique-en-ligne`, repris de l'ancienne page.
// Prix « dès CHF 4'999.– » et maintenance e-commerce à CHF 149.– / mois : ceux de
// l'ancienne page en ligne, absents de `offers.ts` (où l'e-commerce est « sur
// devis »). À confirmer par Max (handoff de la nuit du 2026-10-21).
import type { Explain } from "../components/ExplainList.astro";
import type { FaqItem } from "../components/Faq.astro";
import { SITE } from "../lib/site";

const PAGE_URL = `${SITE.url}/creation-boutique-en-ligne`;

export const shopPrice = "dès CHF 4'999.–";

export const shopReasons: Explain[] = [
  {
    title: "Un canal de vente qui ne ferme jamais",
    text: "Votre boutique vend à toute heure, à vos clients valaisans comme à ceux de toute la Suisse romande, même quand le magasin est fermé.",
  },
  {
    title: "Sur-mesure, sans commission de plateforme",
    text: "Shopify ou Wix facturent un abonnement, souvent des frais sur vos ventes, et limitent le design. Votre boutique sur-mesure vous appartient, sans commission de plateforme sur ce que vous vendez.",
  },
  {
    title: "Les paiements suisses, TWINT compris",
    text: "Carte, TWINT, PayPal ou virement, sur une connexion sécurisée, avec une politique de retour claire : vos clients achètent en confiance.",
  },
  {
    title: "Pensée pour ce que vous vendez",
    text: "Produits du terroir, articles artisanaux, cours ou prestations : la boutique suit votre réalité, pas un modèle générique.",
  },
];

export const shopIncluded = [
  "Design e-commerce sur-mesure",
  "Jusqu'à 50 produits, avec variantes et stocks",
  "Paiement sécurisé : carte, TWINT, PayPal",
  "Boutique rapide, pensée d'abord pour le mobile",
  "SEO e-commerce : balises produits, données structurées, sitemap",
  "Google Analytics 4 avec suivi des ventes",
  "Accompagnement pour prendre en main l'administration",
  "2 mois de support",
];

export const shopExcluded = [
  "Catalogue de plus de 50 produits",
  "Connexion à un ERP ou à un logisticien",
  "Plusieurs devises ou plusieurs langues",
  "Abonnements et ventes récurrentes",
  "SEO avancé et stratégie de contenu",
];

export const shopExamples = ["/la-meltingpote", "/cyclo-gordo"];

export const shopFaq: FaqItem[] = [
  {
    question: "Quelle différence entre une boutique sur-mesure et Shopify ?",
    answer:
      "Shopify est une plateforme avec un abonnement mensuel et, selon la formule, des frais sur les ventes. Une boutique sur-mesure n'a pas de commission de plateforme, vous êtes propriétaire du code et la personnalisation va bien plus loin. Sur le long terme, c'est souvent plus rentable.",
  },
  {
    question: "Puis-je gérer ma boutique moi-même ?",
    answer:
      "Oui. On vous accompagne pour prendre en main l'administration : ajouter des produits, gérer les commandes, modifier les prix, suivre les stocks. Aucune compétence technique n'est nécessaire au quotidien.",
  },
  {
    question: "TWINT est-il disponible comme moyen de paiement ?",
    answer:
      "Oui, avec la carte (Visa, Mastercard), PayPal et le virement, selon vos préférences. L'activation de TWINT demande un contrat avec votre banque ou un prestataire de paiement.",
  },
  {
    question: "En combien de temps ma boutique est-elle livrée ?",
    answer:
      "Une boutique jusqu'à 50 produits est livrée en 4 à 8 semaines, selon les fonctionnalités, le nombre de produits et la vitesse à laquelle les contenus nous parviennent. On fixe une date ensemble au départ.",
  },
  {
    question: "Pouvez-vous reprendre ma boutique existante ?",
    answer:
      "Oui. Nous analysons votre boutique actuelle (vitesse, ventes, référencement, parcours d'achat) et proposons soit des améliorations ciblées, soit une reconstruction complète, selon ce qui vous sert le mieux.",
  },
  {
    question: "Proposez-vous un suivi après la mise en ligne ?",
    answer:
      "Oui. Un abonnement Maintenance et sécurité à CHF 149.– / mois, sans engagement, couvre les mises à jour, la surveillance, les sauvegardes, le suivi des paiements et le support. Les évolutions se font sur devis.",
  },
];

export const shopStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Création de boutique en ligne sur-mesure",
      description:
        "Création de boutiques en ligne sur-mesure en Valais et à Sion : design e-commerce, paiement sécurisé avec TWINT, gestion des produits et des stocks, SEO e-commerce.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "City", name: "Sion" },
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "Country", name: "Suisse" },
      ],
      offers: {
        "@type": "Offer",
        priceSpecification: { "@type": "PriceSpecification", minPrice: 4999, priceCurrency: "CHF" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Création de site internet", item: `${SITE.url}/creation-site-internet` },
        { "@type": "ListItem", position: 3, name: "Boutique en ligne", item: PAGE_URL },
      ],
    },
  ],
};
