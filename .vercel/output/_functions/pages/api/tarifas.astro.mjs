import { E as ENDPOINT, D as DATABASE_ID } from '../../chunks/tarifas_lcugcEoP.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function GET() {
  const response = await fetch(ENDPOINT.replace("DATABASE_ID", DATABASE_ID), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({
      "filter": {
        "property": "Precio (€)",
        "number": {
          "is_not_empty": true
        }
      }
    })
  });
  const responseJson = await response.json();
  const tarifas = {
    diurna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 },
    nocturna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 }
  };
  responseJson.results.forEach(({ properties }) => {
    const tipo = properties["Tipo"]?.select?.name;
    const nombre = properties.Nombre?.title?.[0]?.text.content;
    const precio = properties["Precio (€)"]?.number;
    if (tipo && nombre && precio !== void 0) {
      const tarifa = tipo === "Diurna" ? tarifas.diurna : tarifas.nocturna;
      if (nombre === "Km Recorrido") tarifa.kmRecorrido = precio;
      if (nombre === "Hora de espera") tarifa.horaEspera = precio;
      if (nombre === "Mínimo de percepción") tarifa.minimoPercepcion = precio;
    }
  });
  return new Response(JSON.stringify(tarifas), {
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
