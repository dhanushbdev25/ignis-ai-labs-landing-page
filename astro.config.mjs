// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ignisailabs.com',
  output: 'server',
  
  integrations: [react()],
  
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
