import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BAOuY9zI.mjs';
import { manifest } from './manifest_HpQcw5W6.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/tarifas.astro.mjs');
const _page3 = () => import('./pages/calculadora_viajes.astro.mjs');
const _page4 = () => import('./pages/fiestas_peralta.astro.mjs');
const _page5 = () => import('./pages/politica_privacidad.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/tarifas.ts", _page2],
    ["src/pages/calculadora_viajes.astro", _page3],
    ["src/pages/fiestas_peralta.astro", _page4],
    ["src/pages/politica_privacidad.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "adcdc8c3-ea84-4e04-9dc1-d6f9b20d75e8",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
