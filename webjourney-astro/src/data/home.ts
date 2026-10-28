// Contenu de la page d'accueil, réécrit le 2026-10-18 pour la conversion
// (suivi : todo/20261018-home-conversion.md).
import type { Feature } from "../components/FeatureList.astro";
import type { Shot } from "../components/HeroCenter.astro";
import { SITE } from "../lib/site";

// Chaque service est illustré par un travail livré. Les boucles vidéo sont des
// passages de vidéos (début du passage, durée) : Victor Rossi 1,2 s sur 6 s, dans
// sa vidéo d'étude de cas ; Charly's Bike Store 0,5 s sur 14 s, en vitesse double
// et recadré sur la fenêtre de réservation, dans `charlysbikestore.mp4` ; charte
// graphique d'Astral 0,2 s sur 2,8 s, ralenti à 0,6 et recadré sur le plan de
// travail de Figma, dans `charte-graphique--astral.mp4`. Ces deux dernières
// vidéos sont fournies par Max et restent hors du projet. Le print est fondu dans
// l'identité visuelle : trois services, un par besoin du client.
export const services: Feature[] = [
  {
    title: "Un site qui vous amène des demandes",
    text: "Site vitrine ou e-commerce : un design qui inspire confiance, pensé pour le mobile et pour Google, avec un seul objectif : que vos visiteurs vous contactent ou achètent.",
    media: {
      image: "/assets/images/service--sites.webp",
      alt: "Page d'accueil du site de Victor Rossi, clown et comédien",
      video: "/assets/videos/service--sites.mp4",
    },
  },
  {
    title: "Un site qui prend les réservations à votre place",
    text: "Réservation en ligne, planning, application de location, connexion à votre logiciel de gestion : nous créons les outils qui vous font gagner des heures chaque semaine.",
    media: {
      image: "/assets/images/service--applications.webp",
      alt: "Réservation d'un rendez-vous atelier sur le site de Charly's Bike Store : date choisie, formulaire en cours de saisie",
      video: "/assets/videos/service--applications.mp4",
    },
  },
  {
    title: "Une image à la hauteur de votre travail",
    text: "Logo, charte graphique, cartes de visite, flyers, brochures : une identité cohérente, du site jusqu'au papier.",
    media: {
      image: "/assets/images/service--identite.webp",
      alt: "Charte graphique d'Astral Motorclub : logo primaire et secondaire, couleurs, cartes de visite",
      video: "/assets/videos/service--identite.mp4",
    },
  },
];

export const caseStudyStats = [
  { value: "240%", label: "augmentation des clics Google" },
  { value: "3,8×", label: "nombre d'impressions" },
  { value: "App", label: "application web sur-mesure" },
  { value: "Évolutif", label: "accompagnement régulier" },
];

export const testimonials = [
  {
    quote:
      "\"Le site et l'application développés ont clairement structuré notre activité. C'est un véritable outil business, pensé pour évoluer avec notre entreprise.\"",
    name: "Alan Lepart",
    role: "Astral Motorclub",
  },
  {
    quote:
      "\"Faire confiance à Max pour son site c'est toujours la bonne idée. Accompagnement de A à Z et satisfaction à la clé.\"",
    name: "Stéphane Bachmann",
    role: "Geneva Velo",
  },
  {
    quote:
      "\"Maxime m'a créé un site fonctionnel de qualité professionnelle rapidement. Très pro, je recommande vivement ses services !\"",
    name: "Alex Fogal",
    role: "Homesecure",
  },
];

// Vidéo filmée en portrait (480 × 848 une fois tournée). Le poster est son image à 1 s.
export const videoReview = {
  src: "/assets/videos/review--wapi-aline.mp4",
  poster: "/assets/images/review--wapi-aline.webp",
  width: 480,
  height: 848,
  name: "Aline",
  role: "Wapi",
};

// Chiffres clés, entre la méthode et la sensibilisation. Sites livrés donnés
// par Max, le reste tiré des projets. Les +240 % sont dans l'étude de cas Astral.
export const keyFigures = [
  { value: "30+", label: "sites livrés" },
  { value: "4", label: "outils de réservation en ligne livrés" },
  { value: "3", label: "identités visuelles complètes" },
];

// Méthode, valable pour les trois services (site, application, identité) : le
// visiteur n'est pas forcément venu pour un site (demande de Max du 2026-10-25).
export const methodSteps = [
  {
    title: "On cadre votre projet",
    text: "On part de votre message pour comprendre votre activité, vos clients et ce que le projet doit vous apporter. Vous recevez ensuite un devis fixe.",
  },
  {
    title: "On le construit avec vous",
    text: "Site, application ou identité visuelle : nous avançons par étapes, et vous validez chacune d'elles.",
  },
  {
    title: "Et c'est parti !",
    text: "Mise en ligne de votre site ou de votre outil, ou remise des fichiers de votre marque. Ensuite, nous restons disponibles pour le faire évoluer avec votre activité.",
  },
];

const IMG = "/assets/images";

/** Capture d'accueil d'un site livré (`<slug>--webjourney--web.webp`). */
export function siteShot(slug: string, name: string, height = 438): Shot {
  return { src: `${IMG}/${slug}--webjourney--web.webp`, name, width: 850, height };
}

// Premier écran. Le grand cadre joue le showreel des services (49,5 s, 16:9),
// composé sur /labo/showreel et exporté en version web allégée (suivi :
// todo/20261025-showreel.md). Son image d'ouverture est le mot-symbole, déjà
// affiché à 2 s du showreel : la vidéo s'y superpose sans saut d'image et donne
// au cadre son format 16:9. Sans vidéo (mobile, animations réduites), les
// captures se succèdent dans le cadre. Les pastilles de preuve sont des logos
// blancs choisis parce qu'ils restent lisibles à 44 px.
export const hero = {
  shots: [
    {
      src: "/assets/images/hero-showreel.webp",
      name: "Web journey",
      alt: "Showreel Web journey : sites internet, réservations en ligne et identité visuelle",
      width: 1600,
      height: 900,
    },
    siteShot("victor-rossi", "Victor Rossi"),
    siteShot("audition-sante", "Audition Santé", 436),
    siteShot("cyclo-gordo", "Cyclo Gordo"),
    siteShot("la-meltingpote", "La Meltingpote", 422),
    siteShot("wapi", "Wapi", 428),
  ],
  video: "/assets/videos/hero-showreel.mp4",
  // 960 × 540, 1,4 Mo : le même showreel pour les petits écrans.
  mobileVideo: "/assets/videos/hero-showreel--mobile.mp4",
  proofLogos: [
    { src: "/images/logos/logo-meltingpote.png", name: "La Meltingpote" },
    { src: "/images/logos/logo-geneva-velo.png", name: "Geneva Velo" },
    { src: "/images/logos/aleiko--logo.png", name: "Aleiko" },
  ],
};

export const featuredProjects = [
  {
    href: "/cirque-de-noel",
    name: "Cirque de Noël",
    categories: ["Refonte", "Webdesign", "Identité visuelle"],
    image: `${IMG}/cirque-de-noel--webjourney.webp`,
    alt: "Site web Cirque de Noël Genève",
    width: 850,
    height: 585,
  },
  {
    href: "/astral-motorclub",
    name: "Astral Motorclub",
    categories: ["Site web", "Application", "SEO"],
    image: `${IMG}/astral-motorclub--webjourney.webp`,
    alt: "Site web Astral Motorclub",
    width: 850,
    height: 531,
  },
  {
    href: "/varela-brothers",
    name: "Varela Brothers",
    categories: ["Identité visuelle", "Site web", "Supports communication"],
    image: `${IMG}/varela-brothers--webjourney.webp`,
    alt: "Site web Varela Brothers",
    width: 850,
    height: 476,
  },
  {
    href: "/cyclo-gordo",
    name: "Cyclo Gordo",
    categories: ["E-commerce", "Module réservation", "Planning sur-mesure"],
    image: `${IMG}/cyclo-gordo--webjourney.webp`,
    alt: "Site web Cyclo Gordo",
    width: 850,
    height: 637,
  },
  {
    href: "/victor-rossi",
    name: "Victor Rossi",
    categories: ["Refonte", "Webdesign", "Développement"],
    image: `${IMG}/victor-rossi--webjourney.webp`,
    alt: "Site web Victor Rossi",
    width: 850,
    height: 566,
  },
  {
    href: "/dinoworld",
    name: "Dinoworld",
    categories: ["Site web", "Réservation en ligne", "Template"],
    image: `${IMG}/dinoworld--webjourney.webp`,
    alt: "Site web Dinoworld",
    width: 850,
    height: 425,
  },
];

// Données structurées de la home, reprises de l'ancien site. Seule l'image change :
// l'ancienne (scenic-view-mountain-against-sky-compressed.jpg) répondait en 404.
export const structuredData = [
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}/#business`,
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
        description:
          "Agence web en Valais. Création de sites internet sur-mesure, identité visuelle et développement performant pour PME, startups et entrepreneurs.",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.locality,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
        geo: { "@type": "GeoCoordinates", ...SITE.geo },
        areaServed: [
          { "@type": "City", name: "Sion" },
          { "@type": "AdministrativeArea", name: "Valais" },
          { "@type": "City", name: "Genève" },
          { "@type": "Country", name: "Suisse" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services Web journey",
          itemListElement: [
            "Création de sites web sur-mesure",
            "Identité visuelle et branding",
            "E-commerce",
            "Applications web",
            "Motion design",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
        image: `${SITE.url}${SITE.ogImage}`,
        // Google n'accepte pas le format .ico pour le logo : l'icône PNG 256 px.
        logo: { "@type": "ImageObject", url: `${SITE.url}/assets/images/webclip.png` },
        sameAs: [...Object.values(SITE.social), SITE.googleBusiness],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        priceRange: "$$",
        currenciesAccepted: "CHF",
        knowsLanguage: "fr",
        email: SITE.email,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE.phone,
          email: SITE.email,
          contactType: "customer service",
          availableLanguage: "French",
        },
        founder: { "@type": "Person", name: SITE.founder },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "fr",
        publisher: { "@id": `${SITE.url}/#business` },
      },
    ],
  },
];
