// Contenu de la page `/a-propos`. Équipe et rôles repris de l'ancienne page ; portraits
// de la série fond sombre + tracé doré (`public/images/*-webjourney.png`), en 800 px.
import type { Member } from "../components/TeamGrid.astro";
import type { Point } from "../components/PointList.astro";
import { SITE } from "../lib/site";

const IMG = "/assets/images";

export const team: Member[] = [
  {
    name: "Maxime Berton",
    role: "Fondateur, stratégie digitale et développement",
    photo: `${IMG}/team--maxime-berton.webp`,
    width: 800,
    height: 800,
  },
  {
    name: "Léonard Veuthey",
    role: "Direction artistique, webdesign et motion design",
    photo: `${IMG}/team--leonard-veuthey.webp`,
    width: 800,
    height: 800,
  },
  {
    name: "Hugo Bel",
    role: "Graphiste, identité visuelle et design de marque",
    photo: `${IMG}/team--hugo-bel.webp`,
    width: 800,
    height: 800,
  },
];

// Ce qui guide chaque projet, tiré du texte « Pensé par des humains, pour des humains ».
export const principles: Point[] = [
  {
    title: "Comprendre avant de construire",
    text: "On commence par votre activité et vos clients. Le site vient ensuite, pour répondre à ce qu'ils cherchent.",
  },
  {
    title: "Proposer ce qui est utile",
    text: "Pas de fonctionnalité pour remplir une case : seulement ce qui sert vraiment votre entreprise.",
  },
  {
    title: "Rester là après la mise en ligne",
    text: "Chaque projet est un parcours. On le fait évoluer avec vous, au rythme de votre activité.",
  },
];

export const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE.url}/a-propos#page`,
      name: "À propos de Web journey",
      url: `${SITE.url}/a-propos`,
      about: { "@id": `${SITE.url}/#business` },
    },
    ...team.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      image: `${SITE.url}${member.photo}`,
      worksFor: { "@id": `${SITE.url}/#business` },
    })),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "À propos", item: `${SITE.url}/a-propos` },
      ],
    },
  ],
};
