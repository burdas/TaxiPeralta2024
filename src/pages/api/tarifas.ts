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
    Tipo?: { select?: NotionSelect };
    Nombre?: { title?: NotionTitle[] };
    "Precio (€)"?: NotionNumber;
}

interface NotionResult {
    properties: NotionProperties;
}

interface Tarifa {
    tipo: string | null;
    nombre: string | null;
    precio: number | null;
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

    const tarifas: Tarifa[] = responseJson.results.map((item): Tarifa => ({
        tipo: item.properties["Tipo"]?.select?.name || null,
        nombre: item.properties.Nombre?.title?.[0]?.text.content || null,
        precio: item.properties["Precio (€)"]?.number || null
    }));

    return new Response(JSON.stringify(tarifas), {
        headers: { "Content-Type": "application/json" },
      });
}