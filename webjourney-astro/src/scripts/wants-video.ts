/** Vidéo autorisée, quelle que soit la largeur : hors mode économie de données et
    hors « réduire les animations ». */
export function canPlayVideo(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !matchMedia("(prefers-reduced-motion: reduce)").matches && !connection?.saveData;
}

/** La vidéo est réservée aux écrans larges, hors mode économie de données et
    hors « réduire les animations » : ailleurs, l'image fixe reste affichée. */
export function wantsVideo(): boolean {
  return matchMedia("(min-width: 62em)").matches && canPlayVideo();
}
