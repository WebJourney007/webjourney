// Contenu des aimants à prospects : l'outil `/audit` et le `/guide-gratuit`.
import type { Explain } from "../components/ExplainList.astro";
import { SITE } from "../lib/site";

export const auditChecks: Explain[] = [
  {
    title: "Performance",
    text: "La vitesse d'affichage de votre page, surtout sur mobile. Un site lent fait partir les visiteurs avant qu'ils lisent votre offre.",
  },
  {
    title: "SEO",
    text: "Les bases techniques qui permettent à Google de lire votre page : titre, description, liens, balises.",
  },
  {
    title: "Accessibilité",
    text: "La facilité de lecture et d'utilisation pour tous : contrastes, textes alternatifs des images, navigation au clavier.",
  },
  {
    title: "Bonnes pratiques",
    text: "Sécurité, absence d'erreurs, images au bon format : les signes d'un site bien entretenu.",
  },
];

// Promesses de l'ancienne page. Le nombre de pages du PDF (« 12 pages ») n'est
// pas repris : non vérifié.
export const guidePoints = [
  "7 erreurs concrètes, illustrées par des exemples réels",
  "Des solutions applicables tout de suite, sans développeur",
  "Une checklist pour auditer votre site en 5 minutes",
];

function page(type: string, name: string, path: string, crumb: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${SITE.url}${path}#page`,
        name,
        url: `${SITE.url}${path}`,
        publisher: { "@id": `${SITE.url}/#business` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: crumb, item: `${SITE.url}${path}` },
        ],
      },
    ],
  };
}

export const auditStructuredData = page("WebPage", "Audit gratuit de votre site web", "/audit", "Audit gratuit");
export const guideStructuredData = page(
  "WebPage",
  "Guide gratuit : les 7 erreurs qui font fuir vos clients",
  "/guide-gratuit",
  "Guide gratuit",
);
