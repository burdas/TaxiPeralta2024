import { IVA, TipoTarifa, type DatosFactura, type Entidad, type TarifasFacturacion } from "@/lib/facturacion/types.ts";
import { formatNumero, formatCantidad } from "@/lib/facturacion/format.ts";
import { plantillaGeneral } from "@/lib/facturacion/plantillaGeneral.ts";
import { plantillaEducacion } from "@/lib/facturacion/plantillaEducacion.ts";

export interface Totales {
    base: number;
    iva: number;
    total: number;
}

export function calcularImporteLinea(
    kilometros: number,
    horas: number,
    tarifa: TipoTarifa,
    tarifas: TarifasFacturacion,
): number {
    const precioKm = tarifa === TipoTarifa.Diurna ? tarifas.kmDia : tarifas.kmNoche;
    const precioHora = tarifa === TipoTarifa.Diurna ? tarifas.horaDia : tarifas.horaNoche;
    return kilometros * precioKm + horas * precioHora;
}

export function calcularTotales(lineas: DatosFactura[]): Totales {
    const base = lineas.reduce((acc, linea) => acc + linea.importe, 0);
    const iva = IVA * base;
    return { base, iva, total: base + iva };
}

/** Recalcula el importe de cada línea usando la tarifa propia de la línea. */
export function recalcularImportes(
    lineas: DatosFactura[],
    tarifas: TarifasFacturacion,
): DatosFactura[] {
    return lineas.map((linea) => ({
        ...linea,
        importe: calcularImporteLinea(linea.kilometros, linea.horas, linea.tarifa, tarifas),
    }));
}

export function calcularImporteEducacion(dias: number, costeDiario: number): Totales {
    const base = Math.round(dias * costeDiario * 100) / 100;
    const iva = Math.round(IVA * base * 100) / 100;
    return { base, iva, total: base + iva };
}

function esLineaEnBlanco(linea: {
    descripcion: string;
    origen: string;
    destino: string;
    kilometros: number;
    horas: number;
}): boolean {
    return (
        linea.descripcion.trim() === "" &&
        linea.origen.trim() === "" &&
        linea.destino.trim() === "" &&
        (linea.kilometros <= 0 || Number.isNaN(linea.kilometros)) &&
        (linea.horas <= 0 || Number.isNaN(linea.horas))
    );
}

export function validarLinea(linea: {
    descripcion: string;
    origen: string;
    destino: string;
    kilometros: number;
    horas: number;
}): string | null {
    if (esLineaEnBlanco(linea)) {
        return "No puedes añadir una línea de la factura en blanco. Introduce al menos un dato (descripción, origen, destino, kilómetros u horas).";
    }
    return null;
}

function aplicarMarcadorCondicional(html: string, marcador: string, visible: boolean): string {
    const trozos = html.split(marcador);
    if (trozos.length === 1) return html;
    if (visible) return trozos.join("");
    return trozos[0] + trozos[2] + trozos[4];
}

function repetirFilasGenerales(html: string, lineas: DatosFactura[]): string {
    const partes = html.split("{{FILA}}");
    if (partes.length < 3) return html;

    const filaTemplate = partes[1];
    const filas = lineas
        .map((linea, index) =>
            filaTemplate
                .split("{{NUMERO_F}}").join(String(index + 1))
                .split("{{FECHA_F}}").join(linea.fecha)
                .split("{{DESCRIPCION_F}}").join(linea.descripcion)
                .split("{{ORIGEN_F}}").join(linea.origen)
                .split("{{DESTINO_F}}").join(linea.destino)
                .split("{{TARIFA_F}}").join(linea.tarifa)
                .split("{{KILOMETROS_F}}").join(String(linea.kilometros))
                .split("{{HORAS_F}}").join(formatCantidad(linea.horas))
                .split("{{IMPORTE_F}}").join(formatNumero(linea.importe)),
        )
        .join("");
    return partes[0] + filas + partes[2];
}

export interface DatosFacturaGeneral {
    entidad: Entidad;
    numeroFactura: string;
    fechaCorta: string;
    tarifas: TarifasFacturacion;
    mostrarOrigen: boolean;
    mostrarDestino: boolean;
    mostrarKilometros: boolean;
    mostrarHoras: boolean;
    lineas: DatosFactura[];
}

export function generarHtmlFacturaGeneral(datos: DatosFacturaGeneral, logoUrl: string): string {
    let html = plantillaGeneral;

    const columnasVisibles = (datos.mostrarOrigen ? 1 : 0) + (datos.mostrarDestino ? 1 : 0) + (datos.mostrarKilometros ? 1 : 0) + (datos.mostrarHoras ? 1 : 0);
    const colSpan = 2 + columnasVisibles;

    html = aplicarMarcadorCondicional(html, "{{VER_ORIGEN}}", datos.mostrarOrigen);
    html = aplicarMarcadorCondicional(html, "{{VER_DESTINO}}", datos.mostrarDestino);
    html = aplicarMarcadorCondicional(html, "{{VER_KILOMTEROS}}", datos.mostrarKilometros);
    html = aplicarMarcadorCondicional(html, "{{VER_HORAS}}", datos.mostrarHoras);

    html = repetirFilasGenerales(html, datos.lineas);

    const { base, iva, total } = calcularTotales(datos.lineas);

    const sustituciones: Record<string, string> = {
        "{{NOMBRE}}": datos.entidad.nombre,
        "{{DIRECCION}}": datos.entidad.direccion,
        "{{CODIGO}}": datos.entidad.codigo,
        "{{NUMERO_FACTURA}}": datos.numeroFactura,
        "{{FECHA}}": datos.fechaCorta,
        "{{KMDIA}}": formatCantidad(datos.tarifas.kmDia),
        "{{KMNOCHE}}": formatCantidad(datos.tarifas.kmNoche),
        "{{HORADIA}}": formatCantidad(datos.tarifas.horaDia),
        "{{HORANOCHE}}": formatCantidad(datos.tarifas.horaNoche),
        "{{PRECIO_SIN}}": `${formatNumero(base)}€`,
        "{{IVA}}": `${formatNumero(iva)}€`,
        "{{PRECIO_CON}}": `${formatNumero(total)}€`,
        "{{COLSPAN}}": String(colSpan),
    };

    for (const [placeholder, valor] of Object.entries(sustituciones)) {
        html = html.split(placeholder).join(valor);
    }

    if (logoUrl) {
        html = html.split("./Resources/favicon.png").join(logoUrl);
    }

    return html;
}

export interface DatosFacturaEducacion {
    numeroFactura: string;
    fechaCorta: string;
    codigoAsignacion: string;
    mes: string;
    trayecto: string;
    costeDiario: number;
    dias: number;
    totales: Totales;
}

export function generarHtmlFacturaEducacion(datos: DatosFacturaEducacion, logoUrl: string): string {
    let html = plantillaEducacion;

    const sustituciones: Record<string, string> = {
        "{{NUMERO_FACTURA}}": datos.numeroFactura,
        "{{FECHA}}": datos.fechaCorta,
        "{{CODIGO_ASIGNACION}}": datos.codigoAsignacion,
        "{{MES_F}}": datos.mes,
        "{{TRAYECTO_F}}": datos.trayecto,
        "{{COSTEDIARIO_F}}": formatCantidad(datos.costeDiario),
        "{{DIAS_F}}": String(datos.dias),
        "{{IMPORTE_F}}": formatNumero(datos.totales.base),
        "{{PRECIO_SIN}}": formatNumero(datos.totales.base),
        "{{IVA}}": formatNumero(datos.totales.iva),
        "{{PRECIO_CON}}": formatNumero(datos.totales.total),
    };

    for (const [placeholder, valor] of Object.entries(sustituciones)) {
        html = html.split(placeholder).join(valor);
    }

    if (logoUrl) {
        html = html.split("./Resources/favicon.png").join(logoUrl);
    }

    return html;
}
