import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import svgr from 'vite-plugin-svgr'

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://taxiperalta.com',
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss(), svgr({include: '**/*.svg?react',})]
  },

  adapter: vercel()
});