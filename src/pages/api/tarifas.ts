const ENDPOINT = "https://api.notion.com/v1/databases/DATABASE_ID/query"
const DATABASE_ID = "1a3cbe5d534d801886eede2d78bdd3b5";

interface NotionSelect {
    name: string;
}

interface NotionTitle {
    text: { content: string };
}

interface NotionNumber {
    number: number;
}

interface NotionProperties {
    Tipo: { select: NotionSelect };
    Nombre: { title: NotionTitle[] };
    "Precio (€)": NotionNumber;
}

interface NotionResult {
    properties: NotionProperties;
}

interface TarifaRaw {
    tipo: string;
    nombre: string;
    precio: number;
}

interface TipoDeTarifa {
    kmRecorrido: number,
    horaEspera: number,
    minimoPercepcion: number
}

interface Tarifa {
    diurna: TipoDeTarifa,
    nocturna: TipoDeTarifa
}

export async function GET() {
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

    const responseJson: { results: NotionResult[] } = await response.json()

    const tarifas: TarifaRaw[] = responseJson.results.map((item): TarifaRaw => ({
        tipo: item.properties["Tipo"]?.select?.name,
        nombre: item.properties.Nombre?.title?.[0]?.text.content,
        precio: item.properties["Precio (€)"]?.number
    }));

    return new Response(JSON.stringify(transformarDatos(tarifas)), {
        headers: { "Content-Type": "application/json" },
      });
}

const transformarDatos = (datos: TarifaRaw[]) => {
    const resultado: Tarifa = {
        diurna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 },
        nocturna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 }
    };;

    datos.forEach(({ tipo, nombre, precio }) => {
        console.log(tipo, nombre, precio);
        if (tipo === 'Diurna') {
            if (nombre === 'Km Recorrido') resultado.diurna.kmRecorrido = precio;
            if (nombre === 'Hora de espera') resultado.diurna.horaEspera = precio;
            if (nombre === 'Mínimo de percepción') resultado.diurna.minimoPercepcion = precio;
        } else {
            if (nombre === 'Km Recorrido') resultado.nocturna.kmRecorrido = precio;
            if (nombre === 'Hora de espera') resultado.nocturna.horaEspera = precio;
            if (nombre === 'Mínimo de percepción') resultado.nocturna.minimoPercepcion = precio;
        }
    });

    return resultado;
};