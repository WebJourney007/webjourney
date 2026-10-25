// Contenu de la page locale `/agence-web-sion`, repris de l'ancienne page. Le prix
// de la FAQ vient de `offers.ts` (l'ancienne page affichait « €2'999.– »).
import type { Explain } from "../components/ExplainList.astro";
import type { FaqItem } from "../components/Faq.astro";
import type { Point } from "../components/PointList.astro";
import { SITE } from "../lib/site";
import { siteShot } from "./home";
import { offers } from "./offers";

const PAGE_URL = `${SITE.url}/agence-web-sion`;
const [landing, vitrine] = offers;

export const localReasons: Point[] = [
  {
    title: "On se rencontre à Sion",
    text: "Autour d'un café à Sion, ou en visio si vous préférez : votre projet avance avec des échanges clairs, en personne.",
  },
  {
    title: "On connaît le Valais",
    text: "Tourisme, loisirs, commerces, PME, indépendants : chaque site est pensé pour votre secteur et pour votre clientèle.",
  },
  {
    title: "On reste après la mise en ligne",
    text: "Un site n'est pas une livraison unique. Nous le faisons évoluer avec vous, au rythme de votre activité.",
  },
];

export const localServices: Explain[] = [
  {
    title: "Site vitrine",
    text: "Un site professionnel qui présente votre activité, rassure vos prospects et vous amène des demandes.",
    href: "/creation-site-vitrine",
  },
  {
    title: "Boutique en ligne",
    text: "Vendez vos produits jour et nuit, avec TWINT, sur une boutique simple à gérer.",
    href: "/creation-boutique-en-ligne",
  },
  {
    title: "Formules et prix",
    text: "Landing page, site vitrine ou projet sur-mesure, et la maintenance : toutes nos formules, prix compris.",
    href: "/creation-site-internet",
  },
  {
    title: "Applications et réservation en ligne",
    text: "Réservation, planning, connexion à vos outils : des applications qui vous font gagner des heures chaque semaine.",
    href: "/applications-sur-mesure",
  },
  {
    title: "Identité visuelle",
    text: "Logo, charte graphique, cartes de visite, flyers : une image cohérente, du site jusqu'au papier.",
    href: "/identite-visuelle",
  },
];

// Clients en Valais : Audition Santé et Fanny Masson à Sion, Insectopia à Anzère.
export const localShots = [
  siteShot("audition-sante", "Audition Santé", 436),
  siteShot("fanny-masson", "Fanny Masson", 436),
  siteShot("insectopia", "Insectopia", 409),
];

export const areas: Point[] = [
  { title: "Valais central", text: "Sion, Sierre, Conthey, Nendaz, Savièse, Ayent, Grimisuat, Salins." },
  { title: "Bas-Valais", text: "Martigny, Monthey, Saint-Maurice, Collombey-Muraz, Fully, Saxon." },
  { title: "Haut-Valais et stations", text: "Visp, Brig, Verbier, Crans-Montana, Zermatt, Leukerbad, Saas-Fee." },
  { title: "Suisse romande", text: "Lausanne, Genève, Fribourg, Neuchâtel : à distance, en visio." },
];

export const localFaq: FaqItem[] = [
  {
    question: "Pourquoi choisir une agence web à Sion plutôt qu'une agence à distance ?",
    answer:
      "Vous travaillez directement avec l'équipe qui crée votre site : pas de sous-traitance, pas de centre d'appel. On peut se rencontrer à Sion, on connaît le tissu économique valaisan, et on s'investit dans votre projet sur le long terme.",
  },
  {
    question: "Vous déplacez-vous dans tout le Valais ?",
    answer:
      "Oui. Basés à Sion, nous nous déplaçons dans tout le canton : Sierre, Martigny, Monthey, Visp, Verbier, Crans-Montana, Zermatt. Pour les projets hors canton, nous travaillons à distance, en visio.",
  },
  {
    question: "Puis-je vous rencontrer avant de démarrer un projet ?",
    answer:
      "Bien sûr. Le premier échange est gratuit et sans engagement, à Sion ou en visio : on parle de votre projet, de vos objectifs, et on voit si on est les bons partenaires pour vous.",
  },
  {
    question: "Combien coûte un site web pour une PME valaisanne ?",
    answer: `Une landing page démarre ${landing?.price.replace("dès ", "à ")}, un site vitrine complet coûte ${vitrine?.price}. Ce prix comprend la conception, le design, le développement et la mise en ligne. Les boutiques en ligne et les projets sur-mesure font l'objet d'un devis après un premier échange gratuit.`,
  },
  {
    question: "Pouvez-vous reprendre un site existant ?",
    answer:
      "Oui. Que votre site ait été fait sur WordPress, Webflow, Wix ou autre, nous analysons ce qui existe et proposons soit une refonte complète, soit des améliorations ciblées. Un audit gratuit permet de savoir ce qui mérite d'être gardé.",
  },
];

export const localStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Agence web à Sion — création de sites web sur-mesure",
      description:
        "Conception et développement de sites web sur-mesure pour les PME, indépendants et entrepreneurs du Valais : sites vitrines, boutiques en ligne, applications web, identité visuelle.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "City", name: "Sion" },
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "Country", name: "Suisse" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Agence web à Sion", item: PAGE_URL },
      ],
    },
  ],
};
