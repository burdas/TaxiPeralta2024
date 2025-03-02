/* empty css                                              */
import { a as createComponent, m as maybeRenderHead, r as renderTemplate } from '../chunks/astro/server_BBGkZF-Y.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$SsrPlaceholder = createComponent(($$result, $$props, $$slots) => {
  const randomNumber = Math.random();
  return renderTemplate`${maybeRenderHead()}<p>SSR enabled ${randomNumber}</p>`;
}, "D:/Proyectos/TaxiPeralta2024/src/pages/ssr-placeholder.astro", void 0);

const $$file = "D:/Proyectos/TaxiPeralta2024/src/pages/ssr-placeholder.astro";
const $$url = "/ssr-placeholder";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$SsrPlaceholder,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
