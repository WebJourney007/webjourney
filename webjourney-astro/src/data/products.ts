// Sections produit de la home : un produit = une promesse, ce qui est livré, sa
// preuve et son prix. Suivi : todo/20261021-strategie-vente-seo.md.
import type { Shot } from "../components/HeroCenter.astro";
import type { Point } from "../components/PointList.astro";
import type { Stat } from "../components/Stats.astro";
import { PROJECT_CTA } from "../lib/site";
import { siteShot } from "./home";
import { offers } from "./offers";

export interface ProductProject {
  name: string;
  tags: string;
  href: string;
  shot: Shot;
}

export interface ProductAction {
  label: string;
  href: string;
}

export interface Product {
  title: string;
  accent: string;
  pitch: string;
  deliverables: string[];
  price: string;
  priceNote: string;
  href: string;
  /** Boutons sous le prix : le premier est l'action principale. */
  actions: ProductAction[];
  /** Boucle muette jouée dans un cadre de navigateur, avec son image fixe. */
  media: { video: string; poster: string; width: number; height: number; label: string };
  /** Utilisés par les directions du labo seulement. */
  stats?: Stat[];
  outcomes?: { title: string; text: string }[];
  projects?: ProductProject[];
}

const [landing, vitrine] = offers;
// Produits sur devis : l'action principale du site, puis le formulaire de devis.
const CONTACT: ProductAction[] = [
  { label: PROJECT_CTA.label, href: PROJECT_CTA.href },
  { label: "Demander un devis", href: "/demander-un-devis" },
];

// Ce que comprend chaque site : section à part sur la home, juste après la
// section produit (demande de Max du 2026-10-25, pour aérer). Textes repris des
// offres et de la FAQ, rien de neuf promis.
export const siteIncluded: Point[] = [
  {
    title: "Un design sur mesure",
    text: "Pas de modèle recyclé : votre site est dessiné pour votre activité, et d'abord pour le téléphone, d'où arrivent la plupart de vos visiteurs.",
  },
  {
    title: "Visible sur Google et par les IA",
    text: "Structure, balises, données structurées et vitesse : Google et les IA comme ChatGPT comprennent qui vous êtes et ce que vous proposez.",
  },
  {
    title: "Hébergé en Suisse, et à vous",
    text: "Chez Infomaniak, avec une maintenance sans engagement. Code, design et contenus : tout est à vous une fois le site payé.",
  },
  {
    title: "Prise en main incluse",
    text: "On vous accompagne pour prendre en main votre site. Si vous changez souvent textes et images, on intègre un outil simple qui évite de toucher au code.",
  },
];

export const siteProduct: Product = {
  title: "Création de site internet,",
  accent: "pensée pour vendre",
  pitch:
    "Site vitrine, landing page ou boutique en ligne : un design sur-mesure, rapide, pensé pour Google et pour les IA comme ChatGPT, et pour transformer vos visiteurs en demandes.",
  deliverables: siteIncluded.map(({ title }) => title),
  price: landing?.price ?? "",
  priceNote: `${vitrine?.name} complet : ${vitrine?.price}`,
  href: "/creation-site-internet",
  actions: [
    { label: "Voir les formules", href: "/creation-site-internet" },
    { label: "Voir nos réalisations", href: "/nos-sites-internet" },
  ],
  media: {
    // 8 s de `videos/astral-motorclub.mp4` (fournie par Max), à partir de 4 s :
    // le héro, puis le défilement jusqu'à la liste des véhicules.
    video: "/assets/videos/product--astral.mp4",
    poster: "/assets/images/product--astral.webp",
    width: 1280,
    height: 614,
    label: "Astral Motorclub",
  },
  outcomes: [
    {
      title: "Être trouvé",
      text: "SEO technique, vitesse, données structurées : Google et les IA comprennent qui vous êtes et où vous êtes.",
    },
    { title: "Être choisi", text: "Un design à la hauteur de votre travail, qui rassure dès la première seconde." },
    {
      title: "Être contacté",
      text: "Appel, WhatsApp, formulaire ou réservation : chaque page mène à une prise de contact.",
    },
  ],
  projects: [
    {
      name: "Varela Brothers",
      tags: "Identité visuelle · Site web",
      href: "/varela-brothers",
      shot: siteShot("varela-brothers", "Varela Brothers"),
    },
    {
      name: "Cirque de Noël",
      tags: "Refonte · Webdesign · Identité visuelle",
      href: "/cirque-de-noel",
      shot: siteShot("cirque-de-noel", "Cirque de Noël"),
    },
    {
      name: "Victor Rossi",
      tags: "Refonte · Webdesign",
      href: "/victor-rossi",
      shot: siteShot("victor-rossi", "Victor Rossi"),
    },
  ],
};

// Pas de page dédiée tant que l'export Keyword Planner n'a pas tranché : l'action
// principale est l'appel. Les médias sont ceux des anciens rangs de services.
// Ce que les applications peuvent faire : section à part sur la home, après la
// section produit (demande de Max du 2026-10-25). Textes tirés des études de cas
// (Cyclo Gordo, Astral Motorclub, Charly's Bike Store), sauf l'IA, sans projet livré.
export const appCapabilities: Point[] = [
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

export const appProduct: Product = {
  title: "Applications sur-mesure,",
  accent: "qui vous font gagner du temps",
  pitch:
    "Réservation en ligne, planning, application de location, connexion à votre logiciel de gestion : nous créons les outils qui vous font gagner des heures chaque semaine.",
  deliverables: appCapabilities.map(({ title }) => title),
  price: "Sur devis",
  priceNote: "Un prix fixe, annoncé après un premier échange",
  href: PROJECT_CTA.href,
  actions: CONTACT,
  media: {
    video: "/assets/videos/service--applications.mp4",
    poster: "/assets/images/service--applications.webp",
    width: 900,
    height: 464,
    label: "Charly's Bike Store",
  },
};

// Ce que comprend une identité visuelle, illustré par Varela Brothers : section
// à part sur la home (demande de Max du 2026-10-25). Faits tirés de leur charte
// et de leur étude de cas.
export const designIncluded: Point[] = [
  {
    title: "Logo et ses déclinaisons",
    text: "Un logo pensé pour durer, avec ses versions horizontale, symbole seul, claire et foncée, comme les clés croisées de Varela Brothers.",
  },
  {
    title: "Charte graphique",
    text: "Couleurs, typographies, illustrations et règles d'usage. Celle de Varela Brothers marie rouge sang de bœuf, ivoire et gravures.",
  },
  {
    title: "Cartes de visite, flyers, brochures",
    text: "Vos supports imprimés, prêts pour l'imprimeur. Pour Varela Brothers : cartes de visite, papier à lettres, enveloppes et chemise.",
  },
  {
    title: "Du web au papier",
    text: "La même image partout : Varela Brothers a reçu son identité, puis un site en trois langues qui la prolonge.",
  },
];

export const designProduct: Product = {
  title: "Identité visuelle et graphisme,",
  accent: "à la hauteur de votre travail",
  pitch:
    "Logo, charte graphique, cartes de visite, flyers, brochures : une image cohérente qui rassure dès le premier contact, du site jusqu'au papier.",
  deliverables: designIncluded.map(({ title }) => title),
  price: "Sur devis",
  priceNote: "Un prix fixe, annoncé après un premier échange",
  href: PROJECT_CTA.href,
  actions: CONTACT,
  // 6 s du showreel (25,4 → 31,4 s) : couverture de la charte Varela Brothers,
  // puis sa grille logo, palette, gravures, papeterie.
  media: {
    video: "/assets/videos/product--identite-varela.mp4",
    poster: "/assets/images/product--identite-varela.webp",
    width: 1280,
    height: 720,
    label: "Charte graphique de Varela Brothers",
  },
};
