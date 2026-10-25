// Études de cas, une page par réalisation (`pages/[slug].astro`). Textes repris
// des anciennes pages `public/<slug>.html`, raccourcis ; aucun résultat ajouté.
// Nom, prestations, capture et résultat chiffré viennent de `cases` (projects.ts).
// Boucles vidéo : 8 s tirées de `use-case--video--<slug>_h264.mp4` (suivi :
// todo/20261021-strategie-vente-seo.md, phase 8).
import type { Stat } from "../components/Stats.astro";

export interface CaseStudy {
  slug: string;
  /** Début du H1 ; le nom du client suit, en mots d'accent. */
  headline: string;
  title: string;
  description: string;
  site: string;
  intro: string;
  context: string;
  challenge: string;
  work: string;
  services: string[];
  /** Résultat mesuré, ou constat de l'ancienne page. Section absente sinon. */
  outcome?: { stats?: Stat[]; text?: string };
  /** Avis du client, quand il existe. */
  review?: { quote: string; name: string; role: string };
  media: { video?: string; poster: string; width: number; height: number };
}

const V = "/assets/videos";
const I = "/assets/images";
const loop = (slug: string, height: number) => ({
  video: `${V}/case--${slug}.mp4`,
  poster: `${I}/case--${slug}.webp`,
  width: 1280,
  height,
});
const exhibitionServices = [
  "Webdesign immersif et familial",
  "Architecture de l'information",
  "Activités, infos pratiques et billetterie",
  "Contenus modifiables par l'équipe",
  "SEO exposition et famille",
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "astral-motorclub",
    headline: "Site et application de réservation pour",
    title: "Astral Motorclub, site et app de location de luxe | Web journey",
    description:
      "Site et application de réservation sur mesure pour Astral Motorclub, location de voitures de luxe à Genève : tarifs, disponibilités, +240 % de clics Google.",
    site: "https://www.astral-motorclub.ch/",
    intro: "Location de voitures de luxe à Genève : un site vitrine haut de gamme et une application de réservation sur-mesure.",
    context:
      "Astral Motorclub loue des sportives, des berlines de prestige et des SUV de luxe à Genève. Leur présence en ligne devait être à la hauteur de la flotte, et leurs clients devaient pouvoir consulter les disponibilités et réserver en quelques étapes.",
    challenge:
      "Concevoir deux produits complémentaires : un site vitrine qui attire et convainc, et une application qui gère les réservations et les tarifs. Dans le luxe, aucun compromis n'est possible sur la qualité perçue ni sur la fluidité.",
    work: "Un design épuré qui met chaque véhicule en valeur, et une application construite autour des contraintes de la location de luxe : tarifs flexibles, gestion des créneaux, confirmation rapide. L'équipe d'Astral gère tout en autonomie.",
    services: [
      "Webdesign UI/UX haut de gamme",
      "Site vitrine sur-mesure",
      "Application web de réservation",
      "Gestion des tarifs et interface d'administration",
      "Disponibilités en temps réel",
      "SEO et performance",
    ],
    outcome: {
      stats: [
        { value: "+240 %", label: "de clics depuis Google" },
        { value: "3,8×", label: "plus d'impressions dans Google" },
      ],
    },
    review: {
      quote:
        "\"Le site et l'application développés ont clairement structuré notre activité. C'est un véritable outil business, pensé pour évoluer avec notre entreprise.\"",
      name: "Alan Lepart",
      role: "Astral Motorclub",
    },
    media: loop("astral-motorclub", 610),
  },
  {
    slug: "cirque-de-noel",
    headline: "Refonte du site du",
    title: "Cirque de Noël Genève — Refonte site web | Web journey",
    description:
      "Refonte du site du Cirque de Noël de Genève par Web journey : webdesign événementiel animé, navigation pensée pour la billetterie et optimisation SEO.",
    site: "https://www.cirque-de-noel.ch/",
    intro: "Un spectacle incontournable de l'hiver genevois : un site qui retrouve la magie du cirque, et la billetterie à portée de clic.",
    context:
      "Le Cirque de Noël anime Genève chaque hiver. Son ancien site ne reflétait plus la qualité du spectacle : navigation confuse, image datée, et un parcours qui freinait la vente de billets.",
    challenge:
      "Faire ressentir l'esprit festif du cirque dès l'arrivée, sans perdre la clarté des informations pratiques (dates, horaires, tarifs, billets), et rester rapide sur mobile, où se trouvent la plupart des visiteurs.",
    work: "Une expérience visuelle immersive et animée, une navigation réorganisée autour des dates et de la billetterie, et des contenus optimisés pour Google.",
    services: [
      "Audit de l'existant",
      "Webdesign événementiel",
      "Animations et micro-interactions",
      "Billetterie en ligne intégrée",
      "Performance et SEO",
    ],
    outcome: {
      text: "Après la refonte : une fréquentation en hausse, davantage de billets vendus et une meilleure visibilité sur Google.",
    },
    media: loop("cirque-de-noel", 612),
  },
  {
    slug: "varela-brothers",
    headline: "Identité visuelle et site pour",
    title: "Varela Brothers, branding et site de conciergerie | Web journey",
    description:
      "Identité visuelle et site multilingue (FR, EN, ZH) pour Varela Brothers, conciergerie de luxe en Suisse : logo, charte graphique, print et site web.",
    site: "https://www.varelabrothers.ch/",
    intro: "Une conciergerie de luxe en Suisse : une marque créée de A à Z, du logo jusqu'au site en trois langues.",
    context:
      "À leur lancement, Varela Brothers n'avait ni identité visuelle ni présence en ligne. Il fallait créer tout l'univers de la marque, puis le traduire en site pour une clientèle internationale exigeante.",
    challenge:
      "Une identité intemporelle et moderne, dans un secteur aux codes visuels forts, qui garde son impact en français, en anglais et en chinois.",
    work: "Une identité minimaliste et élégante, faite de contrastes forts et d'une typographie soignée, déclinée sur tous les supports. Le site, pensé d'abord pour le mobile, reste lisible dans les trois langues et mène vers le contact et la prise de rendez-vous.",
    services: [
      "Logo et identité visuelle",
      "Charte graphique",
      "Cartes de visite et papeterie",
      "Webdesign haut de gamme",
      "Site multilingue (FR, EN, ZH)",
      "SEO multilingue",
    ],
    media: {
      video: `${V}/product--sites.mp4`,
      poster: `${I}/product--sites.webp`,
      width: 1280,
      height: 606,
    },
  },
  {
    slug: "cyclo-gordo",
    headline: "Site et réservation en ligne pour",
    title: "Cyclo Gordo, site et réservation atelier vélo | Web journey",
    description:
      "Site vitrine, réservation en ligne et boutique pour Cyclo Gordo, atelier vélo à Genève : planning géré par l'équipe et confirmation automatique.",
    site: "https://www.cyclogordo.ch/",
    intro: "Un atelier vélo à Genève : une vitrine claire, une réservation reliée à un planning conçu pour l'atelier, puis une boutique.",
    context:
      "Cyclo Gordo entretient, répare et vend des vélos à Genève. Les réservations se faisaient par téléphone, et l'atelier y perdait un temps précieux. Dans un second temps, une boutique est venue mettre en avant les vélos et les accessoires disponibles en magasin.",
    challenge:
      "Un outil simple pour les clients, autonome pour l'atelier, qui s'intègre à l'organisation existante sans longue prise en main.",
    work: "Un système de réservation sur-mesure avec un planning géré par l'équipe. Les clients choisissent un créneau et reçoivent une confirmation automatique ; l'atelier gère ses disponibilités seul, depuis une interface simple.",
    services: [
      "Webdesign du site vitrine",
      "Module de réservation en ligne",
      "Planning et gestion des créneaux",
      "Boutique de produits",
      "SEO local à Genève",
    ],
    media: loop("cyclo-gordo", 612),
  },
  {
    slug: "charlys-bike-store",
    headline: "Prise de rendez-vous en ligne pour",
    title: "Charly's Bike Store, réservation atelier vélo | Web journey",
    description:
      "Prise de rendez-vous en ligne pour Charly's Bike Store, atelier vélo à Genève, connectée à son logiciel de gestion : disponibilités synchronisées en temps réel.",
    site: "https://www.charlys-bike-store.ch/",
    intro: "Un atelier vélo primé à Genève : un module de réservation relié au logiciel de gestion du magasin, sans double saisie.",
    context:
      "Charly's Bike Store est un atelier et magasin de vélos à Genève, lauréat des EU Business Awards (Best eBike Retailer) en 2023, 2024 et 2025. Ses clients devaient pouvoir prendre rendez-vous en ligne, et l'équipe recevoir chaque réservation dans son outil habituel.",
    challenge:
      "L'atelier avait déjà un logiciel de gestion performant pour son planning. Il fallait s'y connecter sans le remplacer, et sans ajouter de travail à l'équipe.",
    work: "Une application web reliée à l'API du logiciel existant : les disponibilités sont synchronisées en temps réel, le client choisit sa prestation et son créneau, et la réservation arrive directement dans l'outil de l'équipe, avec une confirmation par e-mail.",
    services: [
      "Intégration à l'API du logiciel de gestion",
      "Application web de réservation",
      "Choix de la prestation et du créneau",
      "Synchronisation en temps réel",
      "Confirmation automatique par e-mail",
    ],
    outcome: {
      text: "Des rendez-vous pris en ligne dès les premiers jours, y compris le soir et le week-end, quand le magasin est fermé.",
    },
    media: { video: `${V}/service--applications.mp4`, poster: `${I}/service--applications.webp`, width: 900, height: 464 },
  },
  {
    slug: "victor-rossi",
    headline: "Refonte du site de",
    title: "Victor Rossi, site portfolio de clown et comédien | Web journey",
    description:
      "Refonte du site de Victor Rossi, clown et comédien suisse : un portfolio créatif avec vidéos et galerie, pensé pour les organisateurs de spectacles.",
    site: "https://rossivictor.com/",
    intro: "Clown et comédien suisse : un site-portfolio qui a la même énergie que ses spectacles.",
    context:
      "Victor Rossi mêle technique de cirque et théâtre contemporain. Son ancien site ne montrait ni la richesse ni la modernité de son répertoire. Le nouveau devait parler à la fois aux organisateurs de spectacles, aux festivals et au grand public.",
    challenge:
      "Traduire un univers artistique vivant sans le dénaturer : donner envie de voir Victor sur scène, et donner confiance aux organisateurs.",
    work: "Une mise en page dynamique construite à partir de ses photos et vidéos ; typographie, animations et transitions amplifient son énergie de scène. La navigation mène les professionnels droit aux informations clés.",
    services: [
      "Refonte du design",
      "Direction artistique",
      "Vidéos et galerie photos",
      "Site responsive",
      "SEO spectacle vivant",
    ],
    media: loop("victor-rossi", 610),
  },
  {
    slug: "dinoworld",
    headline: "Le site de l'exposition",
    title: "DinoWorld, site d'exposition et réservations | Web journey",
    description:
      "Site de DinoWorld, exposition de dinosaures grandeur nature en Suisse : design ludique pour les familles et réservation en ligne pour les écoles.",
    site: "https://dino-world.ch/",
    intro: "Une exposition de dinosaures grandeur nature : un univers qui fait rêver les enfants, et une sortie scolaire organisée en quelques clics.",
    context:
      "DinoWorld présente des dinosaures animatroniques grandeur nature et des activités pédagogiques, pour les familles et les groupes scolaires. Le site devait être une vitrine attractive pour les familles et un outil pratique pour les enseignants, simple à mettre à jour pour l'équipe.",
    challenge:
      "Parler à deux publics à la fois : les enfants, attirés par les dinosaures, et les adultes (parents, enseignants) qui ont besoin d'informations claires et d'une réservation simple.",
    work: "Une hiérarchie visuelle forte : l'univers coloré en premier plan pour capter l'attention, puis des informations pratiques faciles à trouver. Le formulaire des écoles a été simplifié au maximum.",
    services: [
      "Webdesign ludique et familial",
      "Architecture de l'information",
      "Page dédiée aux écoles",
      "Formulaire de réservation de groupe",
      "SEO exposition et famille",
    ],
    media: loop("dinoworld", 668),
  },
  {
    slug: "insectopia",
    headline: "Le site de l'exposition",
    title: "Insectopia, site d'exposition et billetterie | Web journey",
    description:
      "Site d'Insectopia, exposition immersive sur les insectes en Suisse : univers ludique pour les familles, infos pratiques et billetterie en quelques secondes.",
    site: "https://insectopia.ch/",
    intro: "Une exposition immersive sur les insectes : un univers qui parle aux familles, et les infos pratiques trouvées tout de suite.",
    context:
      "À Insectopia, les visiteurs suivent un parcours où ils aident le Professeur à sauver le monde des insectes en résolvant des énigmes. Le site reprend le modèle des autres expositions du groupe, adapté à l'identité d'Insectopia.",
    challenge:
      "Faire ressentir en ligne une expérience physique et sensorielle, tout en laissant les parents trouver vite les horaires, les tarifs et l'accès.",
    work: "Un univers visuel fort, fidèle à l'exposition, et une information progressive : l'émotion d'abord, les infos pratiques à quelques secondes.",
    services: exhibitionServices,
    media: loop("insectopia", 668),
  },
  {
    slug: "pirates-aventure",
    headline: "Le site de l'exposition",
    title: "Pirates Aventure, site d'exposition familiale | Web journey",
    description:
      "Site de Pirates Aventure, exposition immersive au Signal de Bougy : design d'aventure pour les familles, infos pratiques et billetterie en quelques secondes.",
    site: "https://www.pirates-aventure.ch/",
    intro: "Une exposition au Signal de Bougy : un design d'aventure pour toute la famille, et une sortie organisée en quelques clics.",
    context:
      "Pirates Aventure plonge les familles et les groupes scolaires dans l'univers des pirates : décors grandeur nature, créatures légendaires, objets à manipuler. Le site reprend le modèle des autres expositions du groupe, adapté à son identité.",
    challenge:
      "Donner l'impression d'entrer chez les pirates dès la première seconde, tout en restant simple pour les familles qui cherchent l'accès, les horaires et les tarifs.",
    work: "Une identité visuelle forte, fidèle à l'univers pirate, et une page construite pour que les informations clés restent à quelques secondes, sans sacrifier l'immersion.",
    services: exhibitionServices,
    media: loop("pirates-aventure", 668),
  },
  {
    slug: "la-meltingpote",
    headline: "Site et boutique en ligne pour",
    title: "La Meltingpote, e-commerce de bière artisanale | Web journey",
    description:
      "Site et boutique en ligne pour La Meltingpote, brasserie artisanale genevoise : catalogue, paiement sécurisé et gestion des commandes, sans complexité.",
    site: "https://lameltingpote.ch/",
    intro: "Une brasserie artisanale genevoise : ses bières présentées avec caractère, et une boutique en ligne sans complexité inutile.",
    context:
      "La Meltingpote brasse des bières de caractère à Genève et les vend en direct, à l'atelier et en ligne. Le site devait raconter leur démarche artisanale et permettre aux amateurs de commander simplement.",
    challenge:
      "Un e-commerce qui ne ressemble pas à un e-commerce générique : transmettre l'histoire du produit, tout en gardant une commande naturelle, sans friction.",
    work: "Un site chaleureux et direct, construit autour des codes artisanaux : typographies, textures, produits mis en avant. La boutique va à l'essentiel : choisir ses bières, les ajouter au panier, payer.",
    services: [
      "Webdesign et site vitrine",
      "Boutique en ligne et catalogue",
      "Paiement en ligne sécurisé",
      "Gestion des stocks et des commandes",
      "SEO bière artisanale à Genève",
    ],
    media: { poster: `${I}/la-meltingpote--webjourney--web.webp`, width: 850, height: 422 },
  },
];
