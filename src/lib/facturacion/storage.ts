import type { Entidad, TarifasFacturacion } from "@/lib/facturacion/types.ts";

const KEYS = {
    tarifas: "taxiperalta_facturacion_tarifas",
    entidades: "taxiperalta_facturacion_entidades",
    trayectos: "taxiperalta_facturacion_trayectos",
    codigosAsignacion: "taxiperalta_facturacion_codigosAsignacion",
} as const;

function read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function write(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // almacenamiento no disponible
    }
}

export const TARIFAS_POR_DEFECTO: TarifasFacturacion = {
    kmDia: 0.61,
    kmNoche: 0.76,
    horaDia: 16.86,
    horaNoche: 21.08,
};

export function getTarifas(): TarifasFacturacion {
    return { ...TARIFAS_POR_DEFECTO, ...read<TarifasFacturacion>(KEYS.tarifas, TARIFAS_POR_DEFECTO) };
}

export function saveTarifas(tarifas: TarifasFacturacion): void {
    write(KEYS.tarifas, tarifas);
}

export function getEntidades(): Entidad[] {
    return read<Entidad[]>(KEYS.entidades, []);
}

export function saveEntidades(entidades: Entidad[]): void {
    write(KEYS.entidades, entidades);
}

export function getTrayectos(): string[] {
    return read<string[]>(KEYS.trayectos, []);
}

export function saveTrayectos(trayectos: string[]): void {
    write(KEYS.trayectos, trayectos);
}

export function getCodigosAsignacion(): string[] {
    return read<string[]>(KEYS.codigosAsignacion, []);
}

export function saveCodigosAsignacion(codigos: string[]): void {
    write(KEYS.codigosAsignacion, codigos);
}
