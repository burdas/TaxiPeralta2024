import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BAOuY9zI.mjs';
import { manifest } from './manifest_C-dN1Vk2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/tarifas.astro.mjs');
const _page3 = () => import('./pages/calculadora_viajes.astro.mjs');
const _page4 = () => import('./pages/fiestas_peralta.astro.mjs');
const _page5 = () => import('./pages/politica_privacidad.astro.mjs');
const _page6 = () => import('./pages/ssr-placeholder.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/tarifas.ts", _page2],
    ["src/pages/calculadora_viajes.astro", _page3],
    ["src/pages/fiestas_peralta.astro", _page4],
    ["src/pages/politica_privacidad.astro", _page5],
    ["src/pages/ssr-placeholder.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "d9a8a9aa-29c4-426e-abd2-ac3f4045e14c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
