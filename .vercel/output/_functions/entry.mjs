import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DB2zJW8z.mjs';
import { manifest } from './manifest_CPsW25dg.mjs';

const serverIslandMap = new Map([
	['Tarifas', () => import('./chunks/Tarifas_BVyVi_Cm.mjs')],
]);;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/calculadora_viajes.astro.mjs');
const _page3 = () => import('./pages/fiestas_peralta.astro.mjs');
const _page4 = () => import('./pages/politica_privacidad.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/calculadora_viajes.astro", _page2],
    ["src/pages/fiestas_peralta.astro", _page3],
    ["src/pages/politica_privacidad.astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "e2856b1e-1b25-4ecd-aeb0-fe39b0af81af",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
