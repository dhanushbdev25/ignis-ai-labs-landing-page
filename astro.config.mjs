// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ignisailabs.com',
  output: 'server',
  devToolbar: {
    enabled: false,
  },
  
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
    }),
  ],
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // react-dom/server.browser needs MessageChannel, which workerd lacks —
      // use the edge build in production (per Astro Cloudflare adapter docs)
      // eslint-disable-next-line no-undef
      alias: process.env.NODE_ENV === 'production' ? { 'react-dom/server': 'react-dom/server.edge' } : undefined,
    },
  },
  
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
