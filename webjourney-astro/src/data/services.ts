// Contenu de la page `/creation-site-internet`, réécrit le 2026-10-18 pour la conversion
// (suivi : todo/20261018-page-services.md). Les formules de création viennent de
// `offers.ts`, partagé avec la home : un seul prix partout.
import type { CompareColumn, CompareRow } from "../components/CompareTable.astro";
import type { FaqItem } from "../components/Faq.astro";
import type { GlanceItem } from "../components/OfferGlance.astro";
import type { Point } from "../components/PointList.astro";
import type { Step } from "../components/Steps.astro";
import { SITE } from "../lib/site";
import { siteShot } from "./home";
import { offers, type Offer } from "./offers";

const PAGE_URL = `${SITE.url}/creation-site-internet`;

export const fitYes = [
  "Vous n'avez pas encore de site, ou le vôtre date de plusieurs années.",
  "Vos clients arrivent surtout par le bouche-à-oreille, et vous voulez une autre source de demandes.",
  "Vous voulez un prix fixe et un interlocuteur joignable, pas une grosse agence.",
  "Vous préférez déléguer la technique pour vous concentrer sur votre métier.",
];

export const fitNo = [
  "Vous cherchez un site à 300 francs, livré demain.",
  "Vous voulez construire votre site vous-même : un outil comme Wix vous conviendra mieux.",
];

// Pour qui et en combien de temps, dans l'ordre de `offers.ts` : partagés par le
// bloc d'un coup d'œil et par le comparatif.
const AUDIENCES = ["Lancer une offre précise", "Présenter toute votre activité", "Réservation, e-commerce, application"];
const DELAYS = ["1 à 2 semaines", "3 à 6 semaines", "Selon le projet"];

export const glance: GlanceItem[] = offers.map(({ name, price, featured }, index) => ({
  name,
  price,
  featured,
  audience: AUDIENCES[index] ?? "",
  delay: `Délai : ${DELAYS[index]?.toLowerCase()}`,
}));

// Comparatif des formules : les colonnes reprennent nom et prix de `offers.ts`.
// Un tiret = absent de la formule telle que l'ancienne page la décrivait.
export const compareColumns: CompareColumn[] = offers.map(({ name, price, featured }) => ({ name, price, featured }));

export const compareRows: CompareRow[] = [
  { label: "Idéal pour", values: AUDIENCES },
  { label: "Pages", values: ["1 page", "Jusqu'à 5 pages", "Selon le projet"] },
  { label: "Design sur-mesure, pensé mobile", values: [true, true, true] },
  { label: "SEO technique", values: ["De base", "Complet", "Selon le projet"] },
  { label: "Accompagnement pour prendre en main votre site", values: [false, true, "Selon le projet"] },
  { label: "Support après la mise en ligne", values: [false, "2 mois inclus", "Accompagnement dédié"] },
  { label: "Délai de livraison", values: DELAYS },
  { label: "Mise en ligne incluse", values: [true, true, true] },
  { label: "Vous êtes propriétaire du site", values: [true, true, true] },
  { label: "Hébergé en Suisse", values: [true, true, true] },
];

// Sites vitrines déjà en ligne, absents de la grille de la home.
export const showcase = [
  siteShot("audition-sante", "Audition Santé", 436),
  siteShot("fanny-masson", "Fanny Masson", 436),
  siteShot("la-meltingpote", "La Meltingpote", 422),
  siteShot("wapi", "Wapi", 428),
  siteShot("geneva-velo", "Geneva Velo", 433),
  siteShot("aleiko", "Aleiko", 407),
];

export const included: Point[] = [
  {
    title: "Un design unique",
    text: "Pas de modèle recyclé : votre site est dessiné pour votre activité et pour vos clients.",
  },
  {
    title: "Parfait sur mobile",
    text: "La plupart de vos visiteurs arrivent depuis leur téléphone. Votre site y est aussi soigné que sur un écran d'ordinateur.",
  },
  {
    title: "Trouvé sur Google et par les IA",
    text: "Structure, balises, données structurées et vitesse : Google et les IA comme ChatGPT comprennent qui vous êtes et ce que vous proposez.",
  },
  {
    title: "Rapide à charger",
    text: "Un site lent fait fuir. Les nôtres sont construits pour s'afficher sans attendre, sans empilement d'extensions.",
  },
  {
    title: "Pensé pour être contacté",
    text: "Appel, WhatsApp, formulaire : chaque page amène le visiteur vers une prise de contact.",
  },
  {
    title: "Pas de textes ? On s'en occupe",
    text: "Rédaction et visuels en option, si vous n'avez ni le temps d'écrire ni de photos professionnelles.",
  },
];

export const serviceSteps: Step[] = [
  {
    title: "Cadrer",
    text: "Un rendez-vous pour comprendre votre activité et vos clients. Vous recevez un devis fixe et une date de livraison.",
  },
  {
    title: "Structurer",
    text: "On organise vos pages et le parcours du visiteur jusqu'à la prise de contact. Vous validez le plan du site.",
  },
  {
    title: "Concevoir",
    text: "Le design et les contenus prennent forme. Vous validez la maquette avant le développement.",
  },
  {
    title: "Mettre en ligne",
    text: "Développement, tests, mise en ligne. On vous accompagne pour prendre en main votre site.",
  },
];

// Questions propres à cette page : celles de la home (prix, délais, propriété,
// modifications, après la mise en ligne, Wix) n'y sont pas répétées.
export const serviceFaq: FaqItem[] = [
  {
    question: "Que comprend exactement l'offre site vitrine ?",
    answer:
      "La conception, un design sur-mesure, une structure claire, le développement, la mise en ligne, un accompagnement pour prendre en main votre site et 2 mois de support. Le site est livré clé en main.",
  },
  {
    question: "Est-ce que je dois fournir les textes et les images ?",
    answer:
      "Idéalement oui, car vous connaissez votre activité mieux que quiconque. Nous pouvons aussi rédiger vos textes et proposer des visuels libres de droits si vous n'avez pas de photos professionnelles : c'est une option du devis.",
  },
  {
    question: "Mon site sera-t-il bien référencé sur Google ?",
    answer:
      "Le SEO technique est inclus dans chaque site : structure, balises, données structurées, vitesse. Pour apparaître en première page sur des recherches disputées, il faut ensuite un travail de contenu et de SEO local dans la durée, que nous proposons séparément.",
  },
  {
    question: "Quelle différence entre un site vitrine et une boutique en ligne ?",
    answer:
      "Un site vitrine présente votre activité et pousse le visiteur à vous contacter. Une boutique en ligne lui permet d'acheter directement. Dans le doute, on vous conseille lors du premier échange.",
  },
  {
    question: "Est-il possible de faire évoluer le site plus tard ?",
    answer: "Oui. Nouvelles pages, fonctionnalités, modules spécifiques : les évolutions sont possibles sur devis, au rythme de votre activité.",
  },
  {
    question: "Travaillez-vous uniquement avec des entreprises valaisannes ?",
    answer:
      "Non. Nous sommes basés à Sion et privilégions les rencontres en personne en Valais, mais nous travaillons aussi avec des clients dans toute la Suisse romande, et à distance pour les projets hors canton.",
  },
];

/** Prix en francs d'une formule (« dès CHF 990.– » donne 990), ou undefined sur devis. */
function priceOf(offer: Offer) {
  const digits = offer.price.match(/[\d']+/)?.[0]?.replace(/'/g, "");
  return digits ? Number(digits) : undefined;
}

export const serviceStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Création de site internet sur-mesure",
      description:
        "Création de sites internet sur-mesure en Valais : landing page, site vitrine et projets sur-mesure.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "City", name: "Sion" },
        { "@type": "Country", name: "Suisse" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Formules de création de site internet",
        itemListElement: offers.map((offer) => {
          const price = priceOf(offer);
          return {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: offer.name, description: offer.pitch },
            ...(price && {
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "CHF",
                ...(offer.price.startsWith("dès") ? { minPrice: price } : { price }),
              },
            }),
          };
        }),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Création de site internet", item: PAGE_URL },
      ],
    },
  ],
};
