import {
  ENDPOINT,
  DATABASE_ID,
  type NotionResult,
  type TarifasHorariasProps
} from "../../model/tarifas";

export async function GET(): Promise<Response> {
    const response = await fetch(ENDPOINT.replace("DATABASE_ID", DATABASE_ID), {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.NOTION_API}`,
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

    const responseJson: { results: NotionResult[] } = await response.json();

    const tarifas: TarifasHorariasProps = {
        diurna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 },
        nocturna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 }
    };

    responseJson.results.forEach(({ properties }) => {
        const tipo = properties["Tipo"]?.select?.name;
        const nombre = properties.Nombre?.title?.[0]?.text.content;
        const precio = properties["Precio (€)"]?.number;

        if (tipo && nombre && precio !== undefined) {
            const tarifa = tipo === "Diurna" ? tarifas.diurna : tarifas.nocturna;
            if (nombre === "Km Recorrido") tarifa.kmRecorrido = precio;
            if (nombre === "Hora de espera") tarifa.horaEspera = precio;
            if (nombre === "Mínimo de percepción") tarifa.minimoPercepcion = precio;
        }
    });

    return new Response(JSON.stringify(tarifas), {
        headers: { "Content-Type": "application/json" },
    });
}