// Logos du bandeau clients. Les dimensions sont celles d'affichage de l'ancien site.
import type { Logo } from "../components/LogoMarquee.astro";

const DIR = "/images/logos";
const ASSETS = "/assets/images";

/** Capture d'accueil d'un site livré, montrée au survol de son logo. */
const shot = (slug: string) => `${ASSETS}/${slug}--webjourney--web.webp`;

// Les logos de `DIR` sont fournis en blanc et inversés par le bandeau. Ceux qui
// arrivent en couleur précisent leur propre filtre pour sortir en noir eux aussi.
const SILHOUETTE = "brightness(0)";
/** Garde les blancs du logo (la croix d'Audition Santé), noircit le reste. */
const DARKEN = "grayscale(1) contrast(3)";

// Sans `preview`, le survol du logo n'affiche rien.
// L'ordre est voulu. Le bandeau défile vers la gauche : les trois premiers logos
// ouvrent la marche et sortent vite, pour que les projets à mettre en avant
// (les deux clients de Sion, puis Astral, DinoWorld, Cirque de Noël) soient au
// centre de l'écran quand le visiteur pose les yeux sur le bandeau.
export const CLIENT_LOGOS: Logo[] = [
  {
    src: `${DIR}/logo-insectopia.png`,
    name: "Insectopia",
    width: 120,
    height: 33,
    preview: shot("insectopia"),
  },
  {
    src: `${DIR}/logo-pirates-adventures.png`,
    name: "Pirates Adventures",
    width: 107,
    height: 47,
    preview: shot("pirates-aventure"),
  },
  {
    src: `${ASSETS}/creatiz--webjourney--logo.svg`,
    name: "Créatiz",
    width: 88,
    height: 50,
    filter: SILHOUETTE,
    preview: shot("creatiz"),
  },
  {
    src: `${ASSETS}/audition-sante--webjourney--logo.svg`,
    name: "Audition Santé",
    width: 154,
    height: 30,
    filter: DARKEN,
    preview: shot("audition-sante"),
  },
  {
    src: `${ASSETS}/fanny-masson--webjourney--logo.png`,
    name: "Fanny Masson",
    width: 161,
    height: 32,
    filter: SILHOUETTE,
    preview: shot("fanny-masson"),
  },
  {
    src: `${DIR}/Astral_Logotype_WhiteIce 1.png`,
    name: "Astral Motorclub",
    width: 218,
    height: 10,
    preview: shot("astral-motorclub"),
  },
  {
    src: `${DIR}/Webclip-dinoworld 1.png`,
    name: "DinoWorld",
    width: 113,
    height: 32,
    preview: shot("dinoworld"),
  },
  {
    src: `${DIR}/Logo CirqueDeNoël 1.png`,
    name: "Cirque de Noël",
    width: 150,
    height: 41,
    preview: shot("cirque-de-noel"),
  },
  {
    src: `${DIR}/logo--victor-rossi.png`,
    name: "Victor Rossi",
    width: 40,
    height: 40,
    preview: shot("victor-rossi"),
  },
  {
    src: `${DIR}/logo-araconcept.png`,
    name: "Araconcept",
    width: 76,
    height: 27,
    preview: shot("ara-concept"),
  },
  { src: `${DIR}/Logo-G7-détouré-blanc 1.png`, name: "G7", width: 82, height: 56, preview: shot("g7") },
  {
    src: `${DIR}/varela-brothers-full-logo-light 1.png`,
    name: "Varela Brothers",
    width: 100,
    height: 53,
    preview: shot("varela-brothers"),
  },
  { src: `${DIR}/logo-wapi.png`, name: "WAPI", width: 88, height: 34, preview: shot("wapi") },
  {
    src: `${DIR}/logo-meltingpote.png`,
    name: "La Meltingpote",
    width: 47,
    height: 40,
    preview: shot("la-meltingpote"),
  },
  { src: `${DIR}/aleiko--logo.png`, name: "Aleiko", width: 42, height: 64, preview: shot("aleiko") },
  {
    src: `${DIR}/logo-geneva-velo.png`,
    name: "Geneva Velo",
    width: 57,
    height: 57,
    preview: shot("geneva-velo"),
  },
  {
    src: `${DIR}/logo-charlysbikestore.png`,
    name: "Charly's Bike Store",
    width: 99,
    height: 51,
    preview: shot("charlys-bike-store"),
  },
  {
    src: `${DIR}/logo--cyclo-gordo-wbg 1.png`,
    name: "Cyclo Gordo",
    width: 142,
    height: 37,
    preview: shot("cyclo-gordo"),
  },
];
