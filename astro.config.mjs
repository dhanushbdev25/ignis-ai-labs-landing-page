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
    ssr: {
      external: ['@sanity/client'],
    },
  },
  
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
