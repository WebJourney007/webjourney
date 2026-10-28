// Articles du blog : métadonnées partagées par la liste `/blog` et chaque article.
// Corps des articles repris des anciennes pages `public/blog/*.html`. Renommage SEO
// de l'article sur les prix décidé le 2026-10-07 (todo/20261007-refonte-webjourney.md) :
// « site internet » à la place de « site web » dans title, H1, descriptions et fil
// d'Ariane ; URL inchangée.
import type { FaqItem } from "../components/Faq.astro";
import { SITE } from "../lib/site";
import { offers } from "./offers";

export interface Post {
  slug: string;
  /** Balise title et titre de la carte sur `/blog`. */
  title: string;
  /** H1 : début, puis mots d'accent, puis fin. */
  h1: [string, string, string];
  lead: string;
  description: string;
  category: string;
  /** Date ISO de publication. */
  date: string;
  readingMinutes: number;
  faq?: FaqItem[];
}

const vitrinePrice = offers.find((offer) => offer.name === "Site vitrine")?.price ?? "";

export const posts: Post[] = [
  {
    slug: "7-erreurs-site-web-pme",
    title: "7 erreurs qui font fuir les clients de votre site",
    h1: ["Les ", "7 erreurs", " qui font fuir vos clients sur votre site web"],
    lead: "La plupart des visiteurs quittent un site sans rien faire. Voici pourquoi, et ce que vous pouvez corriger dès aujourd'hui.",
    description:
      "Votre site a du trafic mais peu de contacts ? Les 7 erreurs les plus fréquentes sur les sites de PME en Suisse, et comment les corriger vite.",
    category: "Audit et conseils",
    date: "2026-04-03",
    readingMinutes: 7,
  },
  {
    slug: "combien-coute-un-site-web-en-suisse-2026",
    title: "Prix d'un site internet en Suisse en 2026",
    h1: ["Prix d'un site internet ", "en Suisse", " en 2026"],
    lead: "De CHF 500 à plus de CHF 100'000 : pourquoi une telle fourchette, ce qui influence vraiment le prix, et comment faire le bon choix.",
    description:
      "Vitrine, e-commerce, application sur mesure : les vrais prix d'un site internet en Suisse en 2026, ce qui fait varier le tarif et comment bien choisir.",
    category: "Guide",
    date: "2026-03-15",
    readingMinutes: 8,
    // Questions des données structurées de l'ancienne page, désormais affichées :
    // l'ancienne FAQ visible ne correspondait pas à son JSON-LD.
    faq: [
      {
        question: "Quel est le prix moyen d'un site vitrine en Suisse en 2026 ?",
        answer: `Un site vitrine professionnel réalisé par une agence suisse coûte en moyenne entre CHF 3'000 et CHF 8'000. Les projets sur mesure ou avec des fonctionnalités avancées peuvent dépasser CHF 10'000. Chez Web journey, le site vitrine coûte ${vitrinePrice}`,
      },
      {
        question: "Pourquoi un site web coûte-t-il si cher en Suisse ?",
        answer:
          "Les prix suisses reflètent les coûts locaux : salaires, charges, qualité d'exécution et niveau de service. Un site fait en Suisse offre une communication directe, un droit suisse applicable, un hébergement local possible et un prestataire disponible sur le long terme.",
      },
      {
        question: "Vaut-il mieux créer son site soi-même ou passer par une agence ?",
        answer:
          "Pour une activité professionnelle, une agence est presque toujours un meilleur investissement. Un site fait soi-même sur Wix ou Squarespace coûte peu en argent mais beaucoup en temps, et le résultat est rarement à la hauteur d'un site conçu sur mesure.",
      },
      {
        question: "Combien coûte une boutique en ligne en Suisse ?",
        answer:
          "Une boutique en ligne professionnelle coûte entre CHF 5'000 et CHF 15'000 pour un projet standard (jusqu'à 100 produits). Avec des intégrations spécifiques (ERP, logistique, plusieurs devises), elle peut atteindre CHF 30'000 et plus.",
      },
      {
        question: "Quels sont les frais récurrents après la création d'un site web ?",
        answer:
          "L'hébergement (CHF 100 à 300 par an), le nom de domaine (CHF 15 à 40 par an) et, en option, une maintenance technique (CHF 99 à 199 par mois). Des plateformes comme Shopify ajoutent un abonnement et des frais sur les ventes, ce qui n'est pas le cas d'un site sur mesure.",
      },
    ],
  },
];

/** « 15 mars 2026 » */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function postStructuredData(post: Post) {
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        url,
        datePublished: post.date,
        dateModified: post.date,
        // Pas de couverture propre aux articles : l'image de partage de la page.
        image: `${SITE.url}${SITE.ogImage}`,
        inLanguage: "fr-CH",
        author: { "@id": `${SITE.url}/#business` },
        publisher: { "@id": `${SITE.url}/#business` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
