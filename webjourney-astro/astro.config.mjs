import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.webjourney.ch',
  // Un fichier .html par page (contact.html, blog/mon-article.html), comme l'ancien
  // site : le .htaccess existant continue de servir /contact sans extension, et
  // aucune des URLs indexées ne change.
  build: { format: 'file' },
  trailingSlash: 'never',
  // Précharge la page visée dès le survol d'un lien interne.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      // Pages internes (design system, labo) et outil d'audit (retiré du site en
      // attendant de le valider), hors index.
      filter: (page) =>
        !page.includes('/design-system') && !page.includes('/labo/') && !page.endsWith('/audit'),
    }),
  ],
});
