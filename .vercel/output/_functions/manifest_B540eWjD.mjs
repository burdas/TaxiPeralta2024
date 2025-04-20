import 'kleur/colors';
import { e as decodeKey } from './chunks/astro/server_DhIpauCS.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DMiGm6W1.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Proyectos/TaxiPeralta2024/","cacheDir":"file:///D:/Proyectos/TaxiPeralta2024/node_modules/.astro/","outDir":"file:///D:/Proyectos/TaxiPeralta2024/dist/","srcDir":"file:///D:/Proyectos/TaxiPeralta2024/src/","publicDir":"file:///D:/Proyectos/TaxiPeralta2024/public/","buildClientDir":"file:///D:/Proyectos/TaxiPeralta2024/dist/client/","buildServerDir":"file:///D:/Proyectos/TaxiPeralta2024/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"calculadora_viajes/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/calculadora_viajes","isIndex":false,"type":"page","pattern":"^\\/calculadora_viajes\\/?$","segments":[[{"content":"calculadora_viajes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/calculadora_viajes.astro","pathname":"/calculadora_viajes","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"fiestas_peralta/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/fiestas_peralta","isIndex":false,"type":"page","pattern":"^\\/fiestas_peralta\\/?$","segments":[[{"content":"fiestas_peralta","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/fiestas_peralta.astro","pathname":"/fiestas_peralta","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"politica_privacidad/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/politica_privacidad","isIndex":false,"type":"page","pattern":"^\\/politica_privacidad\\/?$","segments":[[{"content":"politica_privacidad","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/politica_privacidad.astro","pathname":"/politica_privacidad","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}}],"site":"https://taxiperalta.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Proyectos/TaxiPeralta2024/src/pages/404.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos/TaxiPeralta2024/src/pages/calculadora_viajes.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos/TaxiPeralta2024/src/pages/fiestas_peralta.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos/TaxiPeralta2024/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Proyectos/TaxiPeralta2024/src/pages/politica_privacidad.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/calculadora_viajes@_@astro":"pages/calculadora_viajes.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/politica_privacidad@_@astro":"pages/politica_privacidad.astro.mjs","\u0000@astro-page:src/pages/fiestas_peralta@_@astro":"pages/fiestas_peralta.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","D:/Proyectos/TaxiPeralta2024/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_COxHP-JT.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/01.avif":"chunks/01_u8ielSR1.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/02.avif":"chunks/02_BmJsfWM3.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/03.avif":"chunks/03_Cl1GhnPy.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/04.avif":"chunks/04_BE1jzmrE.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/05.avif":"chunks/05_homivCZ2.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/06.avif":"chunks/06_NRSgDMnW.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/07.avif":"chunks/07_BRFa5ixx.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/08.avif":"chunks/08_CZ5G4H6n.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/09.avif":"chunks/09_DZpN29Jv.mjs","D:/Proyectos/TaxiPeralta2024/src/assets/galery/10.avif":"chunks/10_nJ0tN_Ie.mjs","\u0000@astrojs-manifest":"manifest_B540eWjD.mjs","D:/Proyectos/TaxiPeralta2024/src/components/Tarifas.astro":"chunks/Tarifas_BVyVi_Cm.mjs","D:/Proyectos/TaxiPeralta2024/src/components/MapReact/MapDisplay":"_astro/MapDisplay.ChB3U5E6.js","@astrojs/react/client.js":"_astro/client.DyS41jpO.js","D:/Proyectos/TaxiPeralta2024/src/components/NavBar.astro?astro&type=script&index=0&lang.ts":"_astro/NavBar.astro_astro_type_script_index_0_lang.D8diIUH3.js","D:/Proyectos/TaxiPeralta2024/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.C-Vh0W8d.js","D:/Proyectos/TaxiPeralta2024/src/components/PeraltaFiestas.astro?astro&type=script&index=0&lang.ts":"_astro/PeraltaFiestas.astro_astro_type_script_index_0_lang.CV4_x5s-.js","D:/Proyectos/TaxiPeralta2024/src/components/Galeria.astro?astro&type=script&index=0&lang.ts":"_astro/Galeria.astro_astro_type_script_index_0_lang.DdZhMaAx.js","D:/Proyectos/TaxiPeralta2024/src/components/CalculadoraTarifa.astro?astro&type=script&index=0&lang.ts":"_astro/CalculadoraTarifa.astro_astro_type_script_index_0_lang.C2U2a1Li.js","D:/Proyectos/TaxiPeralta2024/src/components/ContactForm.astro?astro&type=script&index=0&lang.ts":"_astro/ContactForm.astro_astro_type_script_index_0_lang.CHm-OHnY.js","D:/Proyectos/TaxiPeralta2024/src/components/ContactLink.astro?astro&type=script&index=0&lang.ts":"_astro/ContactLink.astro_astro_type_script_index_0_lang.Ckp9ZKy1.js","D:/Proyectos/TaxiPeralta2024/src/components/ThemeButton.astro?astro&type=script&index=0&lang.ts":"_astro/ThemeButton.astro_astro_type_script_index_0_lang.CP61lirM.js","D:/Proyectos/TaxiPeralta2024/src/components/DialogMenu.astro?astro&type=script&index=0&lang.ts":"_astro/DialogMenu.astro_astro_type_script_index_0_lang.ed43Y_M4.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/Proyectos/TaxiPeralta2024/src/components/NavBar.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"dialogTrigger\"),s=document.getElementById(\"dialogMenu\");l.addEventListener(\"click\",()=>{document.body.style.overflow=\"hidden\",s.showModal()});const d=()=>{const e=document.querySelector(\"header\");window.scrollY>parseInt(e.dataset.scroll)?(e.classList.add(\"bg-white\"),e.classList.add(\"dark:bg-black\")):(e.classList.remove(\"bg-white\"),e.classList.remove(\"dark:bg-black\"))};d();window.addEventListener(\"scroll\",d);"],["D:/Proyectos/TaxiPeralta2024/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","window.dataLayer=window.dataLayer||[];function a(){dataLayer.push(arguments)}a(\"js\",new Date);a(\"config\",\"G-RR6JVP116W\");"],["D:/Proyectos/TaxiPeralta2024/src/components/PeraltaFiestas.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"countdownContainer\"),l=document.getElementById(\"days\"),m=document.getElementById(\"hours\"),u=document.getElementById(\"minutes\"),D=document.getElementById(\"seconds\"),o=new Date().getFullYear(),g=new Date(o,8,1),y=(7-g.getDay())%7,n=new Date(o,8,y,13),s=new Date().getFullYear()+1,f=new Date(s,8,1),w=(7-f.getDay())%7,L=new Date(s,8,w,13),h=n>new Date?n:L;setInterval(()=>{const a=new Date().getTime(),e=h.getTime()-a,c=Math.floor(e/(1e3*60*60*24)),r=Math.floor(e%(1e3*60*60*24)/(1e3*60*60)),d=Math.floor(e%(1e3*60*60)/(1e3*60)),i=Math.floor(e%(1e3*60)/1e3);l.innerHTML=c.toString(),m.innerHTML=r.toString(),u.innerHTML=d.toString(),D.innerHTML=i.toString(),t.classList.contains(\"hidden\")&&(t.classList.remove(\"hidden\"),t.classList.add(\"flex\"))},1e3);"],["D:/Proyectos/TaxiPeralta2024/src/components/Galeria.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".animate-pulse\").forEach(e=>e.classList.remove(\"animate-pulse\"));const t=document.getElementById(\"dialogImage\"),o=document.getElementById(\"imageExtendida\");document.getElementById(\"dialogDiv\");t.addEventListener(\"click\",()=>{document.body.style.overflow=\"auto\",o.src=\"\",t.close()});const c=e=>{document.body.style.overflow=\"hidden\",o.src=e??\"\",t.showModal()},l=document.querySelectorAll(\".imgButton\");l.forEach(e=>{const d=e.getAttribute(\"data-src\");e.addEventListener(\"click\",()=>c(d))});document.getElementById(\"imgDialogClose\").addEventListener(\"click\",()=>{document.body.style.overflow=\"auto\",o.src=\"\",t.close()});"],["D:/Proyectos/TaxiPeralta2024/src/components/ThemeButton.astro?astro&type=script&index=0&lang.ts","const t=()=>{document.documentElement.classList.toggle(\"dark\"),localStorage.theme=localStorage.theme===\"dark\"?\"light\":\"dark\"};document.querySelectorAll(\".toggleBtn\").forEach(e=>e.addEventListener(\"click\",t));"],["D:/Proyectos/TaxiPeralta2024/src/components/DialogMenu.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"dialogMenu\"),t=document.getElementById(\"dialogClose\");t.addEventListener(\"click\",()=>{e.close(),document.body.style.overflow=\"auto\"});const l=document.querySelectorAll(\".nav-link\");l.forEach(o=>o.addEventListener(\"click\",()=>{e.close(),document.body.style.overflow=\"auto\"}));"]],"assets":["/_astro/hero.DhJW_mp3.webp","/_astro/logo.BUnPG1cI.jpg","/_astro/taxiPeraltaBanner.DmvoiUY2.jpg","/_astro/fiestas_peralta.Cw4HD_KJ.avif","/_astro/03.Cbb0L-WQ.avif","/_astro/02.j8tN-Gu6.avif","/_astro/04.DdC9grRB.avif","/_astro/05.BpTZzHBx.avif","/_astro/01.ChQU_9Jj.avif","/_astro/07.devHxJjV.avif","/_astro/06.wHu7S_dM.avif","/_astro/08.BMvDLRgS.avif","/_astro/09.lkB5msoy.avif","/_astro/10.C46Kq5Xa.avif","/_astro/calculadora_viajes.jJ7oGUwR.css","/favicon.svg","/_astro/CalculadoraTarifa.astro_astro_type_script_index_0_lang.C2U2a1Li.js","/_astro/client.DyS41jpO.js","/_astro/ContactForm.astro_astro_type_script_index_0_lang.CHm-OHnY.js","/_astro/ContactLink.astro_astro_type_script_index_0_lang.Ckp9ZKy1.js","/_astro/Format.Dpv-TzxK.js","/_astro/index.BVOCwoKb.js","/_astro/MapDisplay.ChB3U5E6.js","/_astro/Toast.DpiaCWEv.js","/404.html","/calculadora_viajes/index.html","/fiestas_peralta/index.html","/politica_privacidad/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[["D:/Proyectos/TaxiPeralta2024/src/components/Tarifas.astro","Tarifas"]],"key":"73C8t7qafAgrp27GdU4NkWvjcLYRE6nMaUS9lHM20Is="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
