// Réalisations de la page `/nos-sites-internet`. Textes repris de l'ancienne page,
// raccourcis et corrigés ; aucun résultat ajouté qui ne soit pas mesuré.
import type { CaseItem } from "../components/CaseCard.astro";
import type { Shot } from "../components/HeroCenter.astro";
import { SITE } from "../lib/site";
import { siteShot } from "./home";

const IMG = "/assets/images";

export const caseFilters = [
  { value: "all", label: "Tous" },
  { value: "site", label: "Sites internet" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "app", label: "Applications" },
  { value: "identite", label: "Identité visuelle" },
];

export const cases: CaseItem[] = [
  {
    href: "/astral-motorclub",
    name: "Astral Motorclub",
    tags: ["Site web", "Application", "SEO"],
    text: "Site et application web pour la location de voitures de luxe à Genève. Les équipes gèrent seules la tarification et les réservations.",
    image: `${IMG}/astral-motorclub--webjourney.webp`,
    width: 850,
    height: 531,
    types: ["site", "app"],
  },
  {
    href: "/cirque-de-noel",
    name: "Cirque de Noël",
    tags: ["Refonte", "Webdesign", "Identité visuelle"],
    text: "Une image actuelle pour l'événement : une information claire et une mise en scène animée qui garde l'ambiance festive du cirque.",
    image: `${IMG}/cirque-de-noel--webjourney.webp`,
    width: 850,
    height: 585,
    types: ["site", "identite"],
  },
  {
    href: "/varela-brothers",
    name: "Varela Brothers",
    tags: ["Identité visuelle", "Site web", "Print"],
    text: "Un univers haut de gamme pour une conciergerie de luxe, décliné du print au digital, avec un site en plusieurs langues.",
    image: `${IMG}/varela-brothers--webjourney.webp`,
    width: 850,
    height: 476,
    types: ["site", "identite"],
  },
  {
    href: "/cyclo-gordo",
    name: "Cyclo Gordo",
    tags: ["E-commerce", "Réservation en ligne", "Planning"],
    text: "Une vitrine claire pour un magasin de vélos, avec un module de réservation en ligne relié à un planning conçu pour l'atelier.",
    image: `${IMG}/cyclo-gordo--webjourney.webp`,
    width: 850,
    height: 637,
    types: ["site", "app", "ecommerce"],
  },
  {
    href: "/charlys-bike-store",
    name: "Charly's Bike Store",
    tags: ["Application", "Réservation en ligne"],
    text: "Un module de prise de rendez-vous relié au logiciel de gestion du magasin : les disponibilités sont toujours à jour.",
    image: `${IMG}/charlys-bike-store--webjourney.webp`,
    width: 850,
    height: 566,
    types: ["app"],
  },
  {
    href: "/victor-rossi",
    name: "Victor Rossi",
    tags: ["Refonte", "Webdesign"],
    text: "Refonte complète du site d'un clown et comédien, pour mieux montrer son univers artistique et son travail sur scène.",
    image: `${IMG}/victor-rossi--webjourney.webp`,
    width: 850,
    height: 566,
    types: ["site"],
  },
  {
    href: "/dinoworld",
    name: "DinoWorld",
    tags: ["Site web", "Loisirs"],
    text: "Une exposition de dinosaures : un univers ludique, et des écoles qui organisent leur sortie scolaire en quelques clics.",
    image: `${IMG}/dinoworld--webjourney.webp`,
    width: 850,
    height: 425,
    types: ["site"],
  },
  {
    href: "/insectopia",
    name: "Insectopia",
    tags: ["Site web", "Loisirs"],
    text: "Une exposition immersive sur les insectes : un univers qui parle aux familles, et les infos pratiques trouvées tout de suite.",
    image: `${IMG}/insectopia--webjourney--web.webp`,
    width: 850,
    height: 409,
    types: ["site"],
  },
  {
    href: "/pirates-aventure",
    name: "Pirates Aventure",
    tags: ["Site web", "Loisirs"],
    text: "Une exposition au Signal de Bougy : un design d'aventure pour toute la famille, et une sortie organisée en quelques clics.",
    image: `${IMG}/pirates-aventure--webjourney--web.webp`,
    width: 850,
    height: 409,
    types: ["site"],
  },
  {
    href: "/la-meltingpote",
    name: "La Meltingpote",
    tags: ["Site web", "E-commerce"],
    text: "Un brasseur genevois : ses bières présentées clairement, et une boutique en ligne sans complexité inutile.",
    image: `${IMG}/la-meltingpote--webjourney--web.webp`,
    width: 850,
    height: 422,
    types: ["site", "ecommerce"],
  },
];

// Sites livrés sans étude de cas : la preuve des « 30+ ».
export const moreSites: Shot[] = [
  siteShot("audition-sante", "Audition Santé", 436),
  siteShot("fanny-masson", "Fanny Masson", 436),
  siteShot("wapi", "WAPI", 428),
  siteShot("geneva-velo", "Geneva Velo", 433),
  siteShot("g7", "G7"),
  siteShot("aleiko", "Aleiko", 407),
  siteShot("ara-concept", "Araconcept", 564),
  siteShot("creatiz", "Créatiz", 435),
];

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE.url}/nos-sites-internet#page`,
      name: "Nos réalisations — sites internet créés en Valais",
      url: `${SITE.url}/nos-sites-internet`,
      publisher: { "@id": `${SITE.url}/#business` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: cases.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `${SITE.url}${item.href}`,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Réalisations", item: `${SITE.url}/nos-sites-internet` },
      ],
    },
  ],
};
