// Contenu de la page `/identite-visuelle` (B-009). Faits tirés de la charte et de
// l'étude de cas Varela Brothers : aucun prix, délai ni engagement qui n'existe
// pas déjà ailleurs sur le site. Le print est fondu dans l'identité visuelle.
import type { FaqItem } from "../components/Faq.astro";
import type { Point } from "../components/PointList.astro";
import { SITE } from "../lib/site";

const PAGE_URL = `${SITE.url}/identite-visuelle`;

export interface ProcessImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface ProcessStep {
  title: string;
  text: string;
  /** Une image, ou deux montrées côte à côte (même étape vue sous deux angles). */
  images: ProcessImage[];
}

// La méthode montrée sur un vrai projet : l'identité de WAPI, de la recherche au
// logo final. Déroulé décrit par Max le 2026-10-28 ; textes à valider.
const IMG = "/assets/images";
export const designProcess: ProcessStep[] = [
  {
    title: "La recherche",
    text: "On cherche plusieurs directions, puis on les teste en situation, sur de vraies photos, pour voir laquelle correspond à votre activité.",
    images: [
      {
        src: `${IMG}/identite--wapi-directions.webp`,
        width: 1200,
        height: 886,
        alt: "Six directions de logo WAPI « ride beyond », chacune avec ses couleurs et sa typographie",
      },
      {
        src: `${IMG}/identite--wapi-en-situation.webp`,
        width: 1200,
        height: 1017,
        alt: "Directions de logo WAPI testées sur quatre photos de VTT",
      },
    ],
  },
  {
    title: "Le travail du logo",
    text: "La direction retenue est retravaillée en détail : la forme du W, le sommet, l'équilibre entre les lettres.",
    images: [
      {
        src: `${IMG}/identite--wapi-dessin.webp`,
        width: 1200,
        height: 638,
        alt: "Travail du logo WAPI : variations de la lettre W et du sommet, superposées et annotées",
      },
    ],
  },
  {
    title: "La construction",
    text: "Le logo final est tracé sur une grille, point par point, pour qu'il reste net et juste à toutes les tailles.",
    images: [
      {
        src: `${IMG}/identite--wapi-construction.webp`,
        width: 1200,
        height: 490,
        alt: "Logo WAPI final, tracé sur sa grille de construction avec ses points d'ancrage",
      },
    ],
  },
];

// Repris de la home, où seuls les titres restent affichés.
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

export const designFaq: FaqItem[] = [
  {
    question: "Combien coûte une identité visuelle ?",
    answer:
      "Elle dépend de ce dont vous avez besoin : logo, charte graphique, supports imprimés. On étudie votre projet avec vous, puis on vous envoie un devis détaillé.",
  },
  {
    question: "Que comprend une identité visuelle ?",
    answer:
      "Un logo et ses déclinaisons, une charte graphique (couleurs, typographies, illustrations, règles d'usage) et, si vous en avez besoin, vos supports imprimés : cartes de visite, flyers, brochures, papeterie.",
  },
  {
    question: "Pouvez-vous aussi créer le site qui va avec ?",
    answer:
      "Oui. Varela Brothers a reçu son identité, puis un site en trois langues qui la prolonge : la même image, du logo jusqu'à l'écran.",
  },
];

export const designStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Identité visuelle et graphisme",
      description:
        "Logo, charte graphique, cartes de visite, flyers et brochures : une identité cohérente du site jusqu'au papier, pour les PME du Valais et de Suisse romande.",
      url: PAGE_URL,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Valais" },
        { "@type": "City", name: "Sion" },
        { "@type": "Country", name: "Suisse" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Identité visuelle", item: PAGE_URL },
      ],
    },
  ],
};
