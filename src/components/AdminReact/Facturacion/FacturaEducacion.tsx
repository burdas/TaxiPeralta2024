"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { AutocompleteInput } from "@/components/AdminReact/Facturacion/AutocompleteInput.tsx";
import { showDangerToast } from "@/utils/Toast.ts";
import { COSTE_DIARIO_DEFECTO, MESES } from "@/lib/facturacion/types.ts";
import {
    getCodigosAsignacion,
    getTrayectos,
    saveCodigosAsignacion,
    saveTrayectos,
} from "@/lib/facturacion/storage.ts";
import { formatFechaCorta, formatNumero, toFechaInput } from "@/lib/facturacion/format.ts";
import { calcularImporteEducacion, generarHtmlFacturaEducacion } from "@/lib/facturacion/generarFactura.ts";
import { abrirFactura, getFaviconDataUri } from "@/lib/facturacion/browser.ts";

function parseNumero(valor: string): number {
    const n = parseFloat(valor.replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
}

export default function FacturaEducacion() {
    const [numeroFactura, setNumeroFactura] = useState("");
    const [fecha, setFecha] = useState(() => toFechaInput(new Date()));
    const [codigoAsignacion, setCodigoAsignacion] = useState("");
    const [codigosAsignacion, setCodigosAsignacion] = useState<string[]>(() => getCodigosAsignacion());
    const [trayecto, setTrayecto] = useState("");
    const [trayectos, setTrayectos] = useState<string[]>(() => getTrayectos());
    const [costeDiario, setCosteDiario] = useState(String(COSTE_DIARIO_DEFECTO));
    const [dias, setDias] = useState("");
    const [mes, setMes] = useState("");
    const [base, setBase] = useState("");
    const [iva, setIva] = useState("");
    const [total, setTotal] = useState("");
    const [generando, setGenerando] = useState(false);

    const aplicarCosteDias = (diasValor: string, costeValor: string) => {
        const d = Math.trunc(parseNumero(diasValor));
        const c = parseNumero(costeValor);
        if (d > 0 && c > 0) {
            const calculado = calcularImporteEducacion(d, c);
            setBase(formatNumero(calculado.base));
            setIva(formatNumero(calculado.iva));
            setTotal(formatNumero(calculado.total));
        }
    };

    const cambiarBase = (valor: string) => {
        setBase(valor);
        const baseN = parseNumero(valor);
        const ivaN = parseNumero(iva);
        if (baseN >= 0) {
            setTotal(formatNumero(baseN + ivaN));
        }
    };

    const cambiarIva = (valor: string) => {
        setIva(valor);
        const ivaN = parseNumero(valor);
        const baseN = parseNumero(base);
        if (ivaN >= 0) {
            setTotal(formatNumero(baseN + ivaN));
        }
    };

    const generar = async () => {
        const d = Math.trunc(parseNumero(dias));
        const c = parseNumero(costeDiario);

        if (numeroFactura.trim() === "") {
            showDangerToast("Falta de introducir el número de la factura.");
            return;
        }
        if (trayecto.trim() === "") {
            showDangerToast("Falta de introducir el trayecto de la factura.");
            return;
        }
        if (d <= 0) {
            showDangerToast("El número de días tiene que ser mayor que cero.");
            return;
        }
        if (c <= 0) {
            showDangerToast("El coste diario tiene que ser mayor que cero.");
            return;
        }
        if (mes === "") {
            showDangerToast("Falta de introducir el mes de la factura.");
            return;
        }

        const baseN = parseNumero(base);
        const ivaN = parseNumero(iva);

        setGenerando(true);
        try {
            if (trayecto.trim() !== "" && !trayectos.includes(trayecto.trim())) {
                const nuevosTrayectos = [...trayectos, trayecto.trim()];
                setTrayectos(nuevosTrayectos);
                saveTrayectos(nuevosTrayectos);
            }
            if (codigoAsignacion.trim() !== "" && !codigosAsignacion.includes(codigoAsignacion.trim())) {
                const nuevosCodigos = [...codigosAsignacion, codigoAsignacion.trim()];
                setCodigosAsignacion(nuevosCodigos);
                saveCodigosAsignacion(nuevosCodigos);
            }

            const logo = await getFaviconDataUri().catch(() => "");
            const html = generarHtmlFacturaEducacion(
                {
                    numeroFactura: numeroFactura.trim(),
                    fechaCorta: formatFechaCorta(fecha),
                    codigoAsignacion: codigoAsignacion.trim(),
                    mes,
                    trayecto: trayecto.trim(),
                    costeDiario: c,
                    dias: d,
                    totales: { base: baseN, iva: ivaN, total: baseN + ivaN },
                },
                logo,
            );
            abrirFactura(html);
        } catch (err) {
            console.error(err);
            showDangerToast("Error al generar la factura");
        } finally {
            setGenerando(false);
        }
    };

    return (
        <section className="w-full pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Factura Educación</h2>
                <Button
                    type="button"
                    disabled={generando}
                    onClick={generar}
                    className="bg-green-600 text-white hover:bg-green-700"
                    size="lg"
                >
                    {generando ? "Generando…" : "Generar factura"}
                </Button>
            </div>

            <div className="mt-6 space-y-6">
                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="educacionNumeroFactura">Número de factura</Label>
                            <Input
                                id="educacionNumeroFactura"
                                value={numeroFactura}
                                onChange={(e) => setNumeroFactura(e.target.value)}
                                placeholder="Nº de factura"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="educacionFecha">Fecha factura</Label>
                            <Input
                                id="educacionFecha"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codigoAsignacion">Código de asignación</Label>
                            <AutocompleteInput
                                id="codigoAsignacion"
                                value={codigoAsignacion}
                                onValueChange={setCodigoAsignacion}
                                opciones={codigosAsignacion}
                                placeholder="Código de asignación"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Datos de la factura</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="trayecto">Trayecto</Label>
                            <AutocompleteInput
                                id="trayecto"
                                value={trayecto}
                                onValueChange={setTrayecto}
                                opciones={trayectos}
                                placeholder="Trayecto"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="costeDiario">Coste Diario</Label>
                            <Input
                                id="costeDiario"
                                type="number"
                                min={0}
                                step="0.01"
                                value={costeDiario}
                                onChange={(e) => {
                                    setCosteDiario(e.target.value);
                                    aplicarCosteDias(dias, e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dias">Días</Label>
                            <Input
                                id="dias"
                                type="number"
                                min={0}
                                max={100000}
                                step={1}
                                value={dias}
                                onChange={(e) => {
                                    setDias(e.target.value);
                                    aplicarCosteDias(e.target.value, costeDiario);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mes">Mes</Label>
                            <select
                                id="mes"
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="border-input dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                            >
                                <option value="" disabled>
                                    Selecciona un mes
                                </option>
                                {MESES.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Totales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="educacionBase">BASE</Label>
                            <Input
                                id="educacionBase"
                                value={base}
                                onChange={(e) => cambiarBase(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="educacionIva">IVA 10%</Label>
                            <Input
                                id="educacionIva"
                                value={iva}
                                onChange={(e) => cambiarIva(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="educacionTotal">TOTAL</Label>
                            <Input id="educacionTotal" value={total} readOnly className="bg-muted" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Destinatario fijo: DEPARTAMENTO DE EDUCACIÓN · Número de expediente 514TEE
                    </p>
                </div>
            </div>
        </section>
    );
}
