import { describe, expect, it } from "vitest";
import {
    calcularImporteEducacion,
    calcularImporteLinea,
    calcularTotales,
    recalcularImportes,
    validarLinea,
} from "@/lib/facturacion/generarFactura.ts";
import { TipoTarifa, type DatosFactura, type TarifasFacturacion } from "@/lib/facturacion/types.ts";

const tarifas: TarifasFacturacion = {
    kmDia: 0.61,
    kmNoche: 0.76,
    horaDia: 16.86,
    horaNoche: 21.08,
};

describe("calcularImporteLinea", () => {
    it("calcula importe diurno con km y horas", () => {
        const importe = calcularImporteLinea(10, 1.5, TipoTarifa.Diurna, tarifas);
        expect(importe).toBeCloseTo(10 * 0.61 + 1.5 * 16.86, 2);
    });

    it("calcula importe nocturno con km y horas", () => {
        const importe = calcularImporteLinea(5, 0, TipoTarifa.Nocturna, tarifas);
        expect(importe).toBeCloseTo(5 * 0.76, 2);
    });
});

describe("calcularTotales", () => {
    it("calcula base, IVA 10% y total", () => {
        const lineas: DatosFactura[] = [
            {
                fecha: "01/01/2026",
                descripcion: "A",
                origen: "X",
                destino: "Y",
                tarifa: TipoTarifa.Diurna,
                kilometros: 10,
                horas: 0,
                importe: 6.1,
            },
            {
                fecha: "02/01/2026",
                descripcion: "B",
                origen: "Y",
                destino: "X",
                tarifa: TipoTarifa.Nocturna,
                kilometros: 10,
                horas: 0,
                importe: 7.6,
            },
        ];
        const totales = calcularTotales(lineas);
        expect(totales.base).toBeCloseTo(13.7, 2);
        expect(totales.iva).toBeCloseTo(1.37, 2);
        expect(totales.total).toBeCloseTo(15.07, 2);
    });
});

describe("recalcularImportes", () => {
    it("recalcula cada línea con su propia tarifa", () => {
        const lineas: DatosFactura[] = [
            {
                fecha: "",
                descripcion: "",
                origen: "",
                destino: "",
                tarifa: TipoTarifa.Diurna,
                kilometros: 100,
                horas: 0,
                importe: 0,
            },
            {
                fecha: "",
                descripcion: "",
                origen: "",
                destino: "",
                tarifa: TipoTarifa.Nocturna,
                kilometros: 100,
                horas: 0,
                importe: 0,
            },
        ];
        const recalculadas = recalcularImportes(lineas, tarifas);
        expect(recalculadas[0].importe).toBeCloseTo(61, 2);
        expect(recalculadas[1].importe).toBeCloseTo(76, 2);
    });
});

describe("calcularImporteEducacion", () => {
    it("redondea base, IVA y total a 2 decimales", () => {
        const resultado = calcularImporteEducacion(20, 59.99);
        expect(resultado.base).toBeCloseTo(1199.8, 2);
        expect(resultado.iva).toBeCloseTo(119.98, 2);
        expect(resultado.total).toBeCloseTo(1319.78, 2);
    });

    it("devuelve ceros si días es 0", () => {
        const resultado = calcularImporteEducacion(0, 59.99);
        expect(resultado.base).toBe(0);
        expect(resultado.iva).toBe(0);
        expect(resultado.total).toBe(0);
    });
});

describe("validarLinea", () => {
    it("rechaza una línea totalmente en blanco", () => {
        const error = validarLinea({ descripcion: "", origen: "", destino: "", kilometros: 0, horas: 0 });
        expect(error).not.toBeNull();
    });

    it("acepta una línea con descripción", () => {
        const error = validarLinea({ descripcion: "Servicio", origen: "", destino: "", kilometros: 0, horas: 0 });
        expect(error).toBeNull();
    });

    it("acepta una línea solo con kilómetros", () => {
        const error = validarLinea({ descripcion: "", origen: "", destino: "", kilometros: 5, horas: 0 });
        expect(error).toBeNull();
    });

    it("acepta una línea solo con horas", () => {
        const error = validarLinea({ descripcion: "", origen: "", destino: "", kilometros: 0, horas: 1 });
        expect(error).toBeNull();
    });
});
