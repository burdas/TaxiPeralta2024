import { c as createAstro, a as createComponent, m as maybeRenderHead, g as addAttribute, h as renderSlot, r as renderTemplate, b as renderComponent, d as renderScript } from './astro/server_DhIpauCS.mjs';
import 'kleur/colors';
import { $ as $$GetIcon } from './GetIcon_C30C1KSL.mjs';
import 'clsx';
/* empty css                         */

const $$Astro$2 = createAstro("https://taxiperalta.com");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Card;
  const { class: ClassName } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`bg-sky-100/50 dark:bg-sky-900/20 rounded-lg p-8 shadow-md transition-all duration-300
          hover:bg-sky-200/20 hover:scale-105 hover:ring-2 hover:ring-sky-400/50
          dark:hover:bg-sky-600/20 dark:hover:scale-105 dark:hover:ring-2 dark:hover:ring-sky-300/40
          ${ClassName}`, "class")}> ${renderSlot($$result, $$slots["default"])} </article>`;
}, "D:/Proyectos/TaxiPeralta2024/src/components/Card.astro", void 0);

const tarifa = {
  diurna: {
    kmRecorrido: 0.7,
    horaEspera: 19.38,
    minimoPercepcion: 3.78
  },
  nocturna: {
    kmRecorrido: 0.88,
    horaEspera: 28.83,
    minimoPercepcion: 5.63
  }
};

const $$Astro$1 = createAstro("https://taxiperalta.com");
const $$AnimateBadge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AnimateBadge;
  const tipo = Astro2.props.tipo;
  return renderTemplate`${tipo === "diurna" ? renderTemplate`${maybeRenderHead()}<div class="flex items-center"><span class="relative inline-flex overflow-hidden rounded-full p-[2px]"><span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fffbeb_0%,#fbbf24_50%,#fffbeb_100%)]"></span><div class="inline-flex gap-2 items-center justify-center w-full px-3 py-1 text-sm text-amber-800 bg-amber-100 rounded-full dark:bg-amber-900/20 dark:text-white/80 backdrop-blur-3xl whitespace-nowrap font-medium">${renderComponent($$result, "GetIcon", $$GetIcon, { "icon": "Sol" })}${renderSlot($$result, $$slots["default"])}</div></span></div>` : renderTemplate`<div class="flex items-center"><span class="relative inline-flex overflow-hidden rounded-full p-[2px]"><span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c4b5fd_0%,#312e81_50%,#c4b5fd_100%)]"></span><div class="inline-flex gap-2 items-center justify-center w-full px-3 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900/20 dark:text-white/80 backdrop-blur-3xl whitespace-nowrap font-medium">${renderComponent($$result, "GetIcon", $$GetIcon, { "icon": "Luna" })}${renderSlot($$result, $$slots["default"])}</div></span></div>`}`;
}, "D:/Proyectos/TaxiPeralta2024/src/components/AnimateBadge.astro", void 0);

const $$CalculadoraTarifa = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<p class="text-center text-base text-neutral-700/70 dark:text-neutral-200/80 mt-16" data-astro-cid-mrksdoqu>El precio siguiente es <u data-astro-cid-mrksdoqu>orientativo</u>, no se tienen en cuenta otros costes.</p> ${renderComponent($$result, "Card", $$Card, { "class": "max-w-[400px] mx-auto mt-3", "data-astro-cid-mrksdoqu": true }, { "default": ($$result2) => renderTemplate` <form class="space-y-3 px-1 min-[374px]:px-4" data-astro-cid-mrksdoqu> ${renderComponent($$result2, "AnimateBadge", $$AnimateBadge, { "tipo": "diurna", "data-astro-cid-mrksdoqu": true }, { "default": ($$result3) => renderTemplate`Diurna` })} <div class="w-full flex flex-row justify-between items-center" data-astro-cid-mrksdoqu> <label for="#inputKmRecorridoDiurno" class="text-sm font-medium text-black/80 dark:text-neutral-200/80 min-[374px]:ml-8" data-astro-cid-mrksdoqu>
Km Recorrido
</label> <input id="#inputKmRecorridoDiurno" type="number" class="w-[100px] text-right outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" data-astro-cid-mrksdoqu> </div> <div class="w-full flex flex-row justify-between items-center" data-astro-cid-mrksdoqu> <label for="#inputHoraEsperaDiurno" class="text-sm font-medium text-black/80 dark:text-neutral-200/80 min-[374px]:ml-8" data-astro-cid-mrksdoqu>
Hora de espera
</label> <input id="#inputHoraEsperaDiurno" type="number" class="w-[100px] text-right outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" data-astro-cid-mrksdoqu> </div> ${renderComponent($$result2, "AnimateBadge", $$AnimateBadge, { "tipo": "nocturna", "data-astro-cid-mrksdoqu": true }, { "default": ($$result3) => renderTemplate`Nocturna + festivos` })} <div class="w-full flex flex-row justify-between items-center" data-astro-cid-mrksdoqu> <label for="#inputKmRecorridoNocturno" class="text-sm font-medium text-black/80 dark:text-neutral-200/80 min-[374px]:ml-8" data-astro-cid-mrksdoqu>
Km Recorrido
</label> <input id="#inputKmRecorridoNocturno" type="number" class="w-[100px] text-right outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" data-astro-cid-mrksdoqu> </div> <div class="w-full flex flex-row justify-between items-center" data-astro-cid-mrksdoqu> <label for="#inputHoraEsperaNocturno" class="text-sm font-medium text-black/80 dark:text-neutral-200/80 min-[374px]:ml-8" data-astro-cid-mrksdoqu>
Hora de espera
</label> <input id="#inputHoraEsperaNocturno" type="number" class="w-[100px] text-right outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" data-astro-cid-mrksdoqu> </div> </form> <hr class="w-full mt-3 border-black/30 dark:border-neutral-200/50" data-astro-cid-mrksdoqu> <div class="w-full flex flex-row justify-between items-center mt-3 px-1 min-[374px]:px-4" data-astro-cid-mrksdoqu> <label for="#inputTotalTarifas" class="text-sm font-medium text-black/80 dark:text-neutral-200/80 min-[374px]:ml-8" data-astro-cid-mrksdoqu>
Total
</label> <input id="#inputTotalTarifas" type="text" disabled class="w-[100px] text-right outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="0,00 €" data-astro-cid-mrksdoqu> </div> ` })}  ${renderScript($$result, "D:/Proyectos/TaxiPeralta2024/src/components/CalculadoraTarifa.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Proyectos/TaxiPeralta2024/src/components/CalculadoraTarifa.astro", void 0);

const formater = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const numToEur = (n) => formater.format(n);
function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const $$Astro = createAstro("https://taxiperalta.com");
const $$TarifaCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TarifaCard;
  const { cantidad, nombre, tipo } = Astro2.props;
  const dictNombreTitle = {
    kmRecorrido: "Km Recorrido",
    horaEspera: "Hora de espera",
    minimoPercepcion: "M\xEDnimo de percepci\xF3n"
  };
  const title = dictNombreTitle[nombre] ?? "No esta el valor en el diccionario";
  const indiceUltimoEspacio = title.lastIndexOf(" ");
  return renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "w-full space-y-1" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AnimateBadge", $$AnimateBadge, { "tipo": tipo }, { "default": ($$result3) => renderTemplate`${capitalizeFirstLetter(tipo)}` })} ${maybeRenderHead()}<h4 class="text-xl font-semibold text-black dark:text-white"> ${title.slice(0, indiceUltimoEspacio)} <span class="text-sky-500"> ${title.slice(indiceUltimoEspacio + 1)} </span> </h4> <p class="text-lg font-medium text-neutral-700/70 dark:text-neutral-200/80"> ${numToEur(cantidad)} </p> ` })}`;
}, "D:/Proyectos/TaxiPeralta2024/src/components/TarifaCard.astro", void 0);

const prerender = false;
const $$Tarifas = createComponent(async ($$result, $$props, $$slots) => {
  const prueba = await fetch("http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100").then((res) => res.json());
  const diurna = Object.entries(tarifa.diurna);
  const nocturna = Object.entries(tarifa.nocturna);
  return renderTemplate`${maybeRenderHead()}<section id="Tarifas" class="container min-h-[calc(70vh)] pt-24"> <p class="text-center text-base text-neutral-700/70 dark:text-neutral-200/80">${prueba}</p> <h3 class="text-4xl font-bold text-center dark:text-white">Tarifas</h3> <p class="text-center text-base text-neutral-700/70 dark:text-neutral-200/80">
Tarifas de transporte interurbano publicadas por el gobierno de Navarra.
</p> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center"> ${diurna.map((t) => renderTemplate`${renderComponent($$result, "TarifaCard", $$TarifaCard, { "nombre": t[0], "cantidad": t[1], "tipo": "diurna" })}`)} ${nocturna.map((t) => renderTemplate`${renderComponent($$result, "TarifaCard", $$TarifaCard, { "nombre": t[0], "cantidad": t[1], "tipo": "nocturna + festivos" })}`)} </div> ${renderComponent($$result, "CalculadoraTarifa", $$CalculadoraTarifa, {})} <aside class="flex flex-col mt-16 gap-6 p-4 h-56 justify-center items-center rounded-lg bg-gradient-to-r from-blue-500 to-sky-500"> <h3 class="font-bold text-2xl md:text-4xl text-center text-white">
¡Tambien puedes usar la calculadora de viajes!
</h3> <a href="./calculadora_viajes" class="group rounded-md border-white border-2 px-8 py-4 relative"> <div class="absolute h-full top-0 left-0 w-0 group-hover:w-full bg-white transition-all duration-500"></div> <span class="relative text-white group-hover:text-sky-500 text-xl transition-all duration-500 flex flex-row gap-3 justify-center items-center"> ${renderComponent($$result, "GetIcon", $$GetIcon, { "icon": "Calculadora" })}
Ir a la calculadora
</span> </a> </aside> </section>`;
}, "D:/Proyectos/TaxiPeralta2024/src/components/Tarifas.astro", void 0);

const $$file = "D:/Proyectos/TaxiPeralta2024/src/components/Tarifas.astro";
const $$url = undefined;

export { $$Card as $, $$Tarifas as a, $$file as b, $$url as c, prerender as p };
