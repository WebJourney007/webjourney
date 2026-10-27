// Sections produit de la home : un produit = une promesse, ce qui est livré, sa
// preuve et son prix. Suivi : todo/20261021-strategie-vente-seo.md.
import type { Shot } from "../components/HeroCenter.astro";
import type { Stat } from "../components/Stats.astro";
import { PROJECT_CTA } from "../lib/site";
import { appIncluded } from "./applications";
import { siteShot } from "./home";
import { designIncluded } from "./identite";
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
// Un seul bouton par section produit, pour que l'action soit claire. Produits sur
// devis : le formulaire de contact (pas de devis en concurrence sur la home).
const contactAction: ProductAction[] = [{ label: PROJECT_CTA.label, href: PROJECT_CTA.href }];

export const siteProduct: Product = {
  title: "Création de",
  accent: "site internet",
  pitch:
    "Site vitrine, landing page ou boutique en ligne : un design sur-mesure, rapide, pensé pour Google et pour les IA comme ChatGPT, et pour transformer vos visiteurs en demandes.",
  deliverables: [
    "Un design sur mesure",
    "Visible sur Google et par les IA",
    "Hébergé en Suisse, et à vous",
    "Prise en main incluse",
  ],
  price: landing?.price ?? "",
  priceNote: `${vitrine?.name} complet : ${vitrine?.price}`,
  href: "/creation-site-internet",
  actions: [
    { label: "Voir les formules", href: "/creation-site-internet" },
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

// Page dédiée depuis B-009, URL fixée sans export Keyword Planner. Les médias
// sont ceux des anciens rangs de services.
export const appProduct: Product = {
  title: "Applications",
  accent: "sur mesure",
  pitch:
    "Réservation en ligne, planning, application de location, connexion à votre logiciel de gestion : nous créons les outils qui vous font gagner des heures chaque semaine.",
  deliverables: appIncluded.map(({ title }) => title),
  price: "Sur devis",
  priceNote: "Après étude de votre projet",
  href: "/applications-sur-mesure",
  actions: contactAction,
  media: {
    video: "/assets/videos/service--applications.mp4",
    poster: "/assets/images/service--applications.webp",
    width: 900,
    height: 464,
    label: "Charly's Bike Store",
  },
};

export const designProduct: Product = {
  title: "Identité visuelle et",
  accent: "graphisme",
  pitch:
    "Logo, charte graphique, cartes de visite, flyers, brochures : une image cohérente qui rassure dès le premier contact, du site jusqu'au papier.",
  deliverables: designIncluded.map(({ title }) => title),
  price: "Sur devis",
  priceNote: "Après étude de votre projet",
  href: "/identite-visuelle",
  actions: contactAction,
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
