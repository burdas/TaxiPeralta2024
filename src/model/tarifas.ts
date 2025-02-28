const ENDPOINT = "https://api.notion.com/v1/databases/DATABASE_ID/query";
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

interface TarifasProps {
    kmRecorrido: number;
    horaEspera: number;
    minimoPercepcion: number;
}

interface TarifasHorariasProps {
    diurna: TarifasProps;
    nocturna: TarifasProps;
}

const tarifa: TarifasHorariasProps = {
    diurna: {
        kmRecorrido: 0.70,
        horaEspera: 19.38,
        minimoPercepcion: 3.78
    },
    nocturna: {
        kmRecorrido: 0.88,
        horaEspera: 28.83,
        minimoPercepcion: 5.63
    }
}

export {
    ENDPOINT,
    DATABASE_ID,
    tarifa
};

export type {
    NotionResult,
    TarifasHorariasProps
};
