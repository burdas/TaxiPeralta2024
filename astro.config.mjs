import {defineConfig} from 'astro/config';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
    output: "server",
    site: 'https://taxiperalta.com',
    integrations: [react(), sitemap()],
    build: {
        assetsInlineLimit: 0
    },

    vite: {
        plugins: [
            tailwindcss({configFile: './tailwind.config.cjs'}),
            svgr({
                include: '**/*.svg?react',
                exportAsDefault: true
            })],
    },

    adapter: vercel()
});