import { describe, expect, it } from "vitest";
import {
    generarHtmlFacturaEducacion,
    generarHtmlFacturaGeneral,
} from "@/lib/facturacion/generarFactura.ts";
import { TipoTarifa, type DatosFactura, type TarifasFacturacion } from "@/lib/facturacion/types.ts";

const tarifas: TarifasFacturacion = {
    kmDia: 0.61,
    kmNoche: 0.76,
    horaDia: 16.86,
    horaNoche: 21.08,
};

const lineas: DatosFactura[] = [
    {
        fecha: "01/01/2026",
        descripcion: "Servicio aeropuerto",
        origen: "Peralta",
        destino: "Pamplona",
        tarifa: TipoTarifa.Diurna,
        kilometros: 80,
        horas: 0,
        importe: 80 * 0.61,
    },
    {
        fecha: "02/01/2026",
        descripcion: "Servicio nocturno",
        origen: "Pamplona",
        destino: "Peralta",
        tarifa: TipoTarifa.Nocturna,
        kilometros: 80,
        horas: 0.5,
        importe: 80 * 0.76 + 0.5 * 21.08,
    },
];

const base = { nombre: "Ayuntamiento", direccion: "Plaza", codigo: "001" };

describe("generarHtmlFacturaGeneral", () => {
    it("sustituye todos los placeholders y no deja marcadores", () => {
        const html = generarHtmlFacturaGeneral(
            {
                entidad: base,
                numeroFactura: "2026-001",
                fechaCorta: "09/09/2026",
                tarifas,
                mostrarKilometros: true,
                mostrarHoras: true,
                lineas,
            },
            "",
        );
        expect(html).not.toContain("{{");
        expect(html).not.toContain("}}");
        expect(html).toContain("Ayuntamiento");
        expect(html).toContain("2026-001");
        expect(html).toContain("09/09/2026");
        expect(html).toContain("Servicio aeropuerto");
        expect(html).toContain("Servicio nocturno");
        expect(html).toContain("Diurna: 0,61€");
        expect(html).toContain("€");
    });

    it("incluye las columnas de kilómetros y horas cuando están visibles", () => {
        const html = generarHtmlFacturaGeneral(
            {
                entidad: base,
                numeroFactura: "1",
                fechaCorta: "09/09/2026",
                tarifas,
                mostrarKilometros: true,
                mostrarHoras: true,
                lineas,
            },
            "",
        );
        expect(html).toContain("KILOMETROS");
        expect(html).toContain("HORAS");
        expect(html).toContain('colspan="6"');
    });

    it("oculta la columna de kilómetros si está desmarcada", () => {
        const html = generarHtmlFacturaGeneral(
            {
                entidad: base,
                numeroFactura: "1",
                fechaCorta: "09/09/2026",
                tarifas,
                mostrarKilometros: false,
                mostrarHoras: true,
                lineas,
            },
            "",
        );
        expect(html).not.toContain("KILOMETROS");
        expect(html).toContain("HORAS");
        expect(html).toContain('colspan="5"');
    });

    it("oculta la columna de horas si está desmarcada", () => {
        const html = generarHtmlFacturaGeneral(
            {
                entidad: base,
                numeroFactura: "1",
                fechaCorta: "09/09/2026",
                tarifas,
                mostrarKilometros: true,
                mostrarHoras: false,
                lineas,
            },
            "",
        );
        expect(html).not.toContain("HORAS");
        expect(html).toContain("KILOMETROS");
        expect(html).toContain('colspan="5"');
    });

    it("reemplaza la ruta del logo si se proporciona un logo", () => {
        const html = generarHtmlFacturaGeneral(
            {
                entidad: base,
                numeroFactura: "1",
                fechaCorta: "09/09/2026",
                tarifas,
                mostrarKilometros: true,
                mostrarHoras: true,
                lineas,
            },
            "data:image/svg+xml;base64,AAAA",
        );
        expect(html).toContain('src="data:image/svg+xml;base64,AAAA"');
        expect(html).not.toContain("./Resources/favicon.png");
    });
});

describe("generarHtmlFacturaEducacion", () => {
    it("sustituye todos los placeholders y no deja marcadores", () => {
        const html = generarHtmlFacturaEducacion(
            {
                numeroFactura: "EDU-2026-01",
                fechaCorta: "01/03/2026",
                codigoAsignacion: "A-100",
                mes: "Marzo",
                trayecto: "Peralta - IES Valle del Ebro",
                costeDiario: 3.33,
                dias: 10,
                totales: { base: 33.3, iva: 3.33, total: 36.63 },
            },
            "",
        );
        expect(html).not.toContain("{{");
        expect(html).not.toContain("}}");
        expect(html).toContain("EDU-2026-01");
        expect(html).toContain("A-100");
        expect(html).toContain("Marzo");
        expect(html).toContain("Peralta - IES Valle del Ebro");
        expect(html).toContain("3,33");
        expect(html).toContain("33,30");
        expect(html).toContain("36,63");
        expect(html).toContain("514TEE");
        expect(html).toContain("DEPARTAMENTO DE EDUCACIÓN");
    });
});
