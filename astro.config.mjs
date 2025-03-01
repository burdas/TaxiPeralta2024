import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://taxiperalta.com',
  integrations: [tailwind(), react(), sitemap()],
  output: "static",
  adapter: vercel(),
});