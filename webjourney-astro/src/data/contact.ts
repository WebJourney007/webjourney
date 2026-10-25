// Contenu des pages `/contact` et `/demander-un-devis`. Les options du devis et
// leurs `value` sont reprises telles quelles de l'ancienne page : `send-email.php`
// les recopie dans l'e-mail reçu par Max.
import type { Step } from "../components/Steps.astro";
import { SITE } from "../lib/site";

// Le suivi d'une demande, tiré de la méthode de la page services (devis fixe,
// date de livraison) et de l'appel découverte.
export const nextSteps: Step[] = [
  {
    title: "On vous recontacte",
    text: "Par téléphone ou par e-mail, pour comprendre votre demande et fixer un premier échange.",
  },
  {
    title: "On en parle 20 minutes",
    text: "Autour d'un café à Sion ou en visio, gratuitement et sans engagement.",
  },
  {
    title: "Vous recevez un devis fixe",
    text: "Avec une date de livraison. Vous décidez ensuite, à votre rythme.",
  },
];

export const quoteBenefits = [
  "Un site sur-mesure, conçu pour votre activité",
  "Un accompagnement local, de la conception à la mise en ligne",
  "Un budget annoncé dès le départ, et une date tenue",
];

export const siteProblems = [
  { value: "aspect_visuel", label: "L'aspect visuel n'est pas satisfaisant" },
  { value: "faible_conversion", label: "Il génère peu de demandes" },
  { value: "trafic_insuffisant", label: "Il a trop peu de visiteurs" },
  { value: "pas_de_site", label: "Je n'ai pas encore de site internet" },
  { value: "problemes_techniques", label: "Problèmes techniques (lent, bugs…)" },
];

// Libellés en euros sur l'ancienne page, gardés tels quels : la devise est à
// trancher par Max (voir le handoff de la nuit du 2026-10-21).
export const revenueRanges = [
  { value: "moins_25k", label: "Moins de 25 000 € / mois" },
  { value: "25k_50k", label: "25 000 – 50 000 € / mois" },
  { value: "50k_100k", label: "50 000 – 100 000 € / mois" },
  { value: "100k_200k", label: "100 000 – 200 000 € / mois" },
  { value: "plus_200k", label: "200 000 € / mois et plus" },
];

// Motif de l'ancien site, élargi de 12 à 13 caractères après le préfixe : il
// refusait « +41 76 543 21 00 », le format de son propre message d'aide. Le contrôle
// qui compte reste celui de `send-email.php` (10 chiffres, ou 11 avec 41).
export const swissPhone = {
  pattern: "(0|\\+41)[0-9\\s]{8,13}",
  title: "Format suisse : 076 543 21 00 ou +41 76 543 21 00",
  placeholder: "076 543 21 00",
};

function breadcrumb(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE.url}${path}` },
    ],
  };
}

export const contactStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE.url}/contact#page`,
      name: "Contact Web journey",
      url: `${SITE.url}/contact`,
      about: { "@id": `${SITE.url}/#business` },
    },
    breadcrumb("Contact", "/contact"),
  ],
};

export const quoteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/demander-un-devis#page`,
      name: "Demander un devis pour un site internet",
      url: `${SITE.url}/demander-un-devis`,
      about: { "@id": `${SITE.url}/#business` },
    },
    breadcrumb("Demander un devis", "/demander-un-devis"),
  ],
};
