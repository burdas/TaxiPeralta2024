const apiUrl = import.meta.env.TAXI_PERALTA_API_URL;
const apiKey = import.meta.env.TAXI_PERALTA_API_KEY;

export interface ITarifas {
    diurna: Record<string, number>;
    nocturna: Record<string, number>;
    date: string | number | Date | null;
    [key: string]: any;
}

export async function getTarifas(): Promise<ITarifas> {
    if (!apiUrl || !apiKey) {
        throw new Error('API URL or API KEY not set in environment variables.');
    }

    const response = await fetch(`${apiUrl}/tarifas`, {
        headers: {
            'X-Api-Key': apiKey,
        }
    });
    if (!response.ok) {
        throw new Error(await response.text());
    }
    const data = await response.json();

    let maxDate: string | number | Date | null = null;
    const output: any = {};
    
    for (const [key, value] of Object.entries(data)) {
        const newInner: Record<string, number> = {};
        for (const [innerKey, innerValue] of Object.entries(value as Record<string, { value: number; date: string }>)) {
            const { value: val, date } = innerValue;
            newInner[innerKey] = val;
            if (!maxDate || new Date(date) > new Date(maxDate)) {
                maxDate = date;
            }
        }
        output[key] = newInner;
    }

    return {
        diurna: output.diurna || {},
        nocturna: output.nocturna || {},
        ...output,
        date: maxDate
    };
}

export interface IEnlace {
    id?: string;
    url: string;
    texto: string;
}

export async function getEnlacesInteres(): Promise<IEnlace[]> {
    if (!apiUrl || !apiKey) {
        throw new Error('API URL or API KEY not set in environment variables.');
    }

    const response = await fetch(`${apiUrl}/enlaces-interes`, {
        headers: {
            'X-Api-Key': apiKey,
        }
    });
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return await response.json();
}
