// Coordonnées et navigation : source unique pour la nav, le footer et le JSON-LD.

export const SITE = {
  name: "Web journey",
  url: "https://www.webjourney.ch",
  tagline: "Votre aventure digitale commence ici",
  email: "hello@webjourney.ch",
  phone: "+41768445869",
  phoneDisplay: "+41 76 844 58 69",
  phoneHref: "tel:+41768445869",
  whatsapp: "https://wa.me/41768445869",
  // Délai de réponse promis (validé par Max le 2026-10-21), repris sous les boutons de contact.
  replyPromise: "Réponse sous 24 h",
  founder: "Maxime Berton",
  address: {
    street: "Rue du Stade 13",
    locality: "Sion",
    postalCode: "1950",
    country: "CH",
  },
  // Rue du Stade 13 selon OpenStreetMap (2026-10-28). À caler sur l'épingle de la fiche Google.
  geo: { latitude: 46.2336, longitude: 7.3737 },
  social: {
    instagram: "https://www.instagram.com/webjourney.ch",
    linkedin: "https://www.linkedin.com/company/agence-web-journey/",
  },
  // Image de partage par défaut : la seule des anciennes og:image qui répond en ligne.
  ogImage: "/assets/images/google-product.png",
} as const;

// Action principale du site, sur tous les boutons : un message via le formulaire
// de contact. Max ne prend plus de rendez-vous téléphoniques (2026-10-25).
// « Démarrer » plutôt que « Réserver un appel » : le visiteur n'a pas besoin de
// savoir précisément ce qu'il veut pour écrire.
export const PROJECT_CTA = { label: "Démarrer votre projet", short: "Démarrer", href: "/contact" } as const;

// Les trois services, un par besoin du client : panneau « Services » de la
// barre, menu mobile, pied de page et bloc « Nos autres services » (B-009).
export const SERVICE_LINKS = [
  { label: "Sites internet", href: "/creation-site-internet" },
  { label: "Applications sur mesure", href: "/applications-sur-mesure" },
  { label: "Identité visuelle", href: "/identite-visuelle" },
] as const;

// Liens de la barre de navigation, après le panneau « Services ». Le logo ramène
// à l'accueil et le bouton « Démarrer votre projet » mène au contact : ils n'y
// figurent donc pas.
export const NAV_LINKS = [
  { label: "Réalisations", href: "/nos-sites-internet" },
  { label: "À propos", href: "/a-propos" },
] as const;

// Ressources reste accessible depuis le footer seulement, pour garder le menu centré sur la conversion.
// La page locale, le blog et le compresseur y sont aussi : sans ces liens, l'audit
// SE Ranking du 2026-10-24 les trouvait orphelins ou liés une seule fois.
export const FOOTER_LINKS = [
  ...SERVICE_LINKS.map(({ label, href }) => ({ label, href })),
  ...NAV_LINKS,
  { label: "Agence web à Sion", href: "/agence-web-sion" },
  { label: "Ressources", href: "/ressources" },
  { label: "Blog", href: "/blog" },
  { label: "Compresseur d'images", href: "/compresseur-images" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
] as const;

/** URL absolue d'un chemin du site, pour les canonicals, og:image et JSON-LD. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}
