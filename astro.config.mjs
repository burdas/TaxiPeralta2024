import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://taxiperalta.com',
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});