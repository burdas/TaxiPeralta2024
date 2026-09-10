"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { AutocompleteInput } from "@/components/AdminReact/Facturacion/AutocompleteInput.tsx";
import { DatePicker } from "@/components/AdminReact/Facturacion/DatePicker.tsx";
import FacturaPreview from "@/components/AdminReact/Facturacion/FacturaPreview.tsx";
import { showDangerToast, showOkToast } from "@/utils/Toast.ts";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { COSTE_DIARIO_DEFECTO, MESES } from "@/lib/facturacion/types.ts";
import {
    getCodigosAsignacion,
    getTrayectos,
    saveCodigosAsignacion,
    saveTrayectos,
} from "@/lib/facturacion/storage.ts";
import { formatFechaCorta, formatNumero, toFechaInput } from "@/lib/facturacion/format.ts";
import { calcularImporteEducacion, generarHtmlFacturaEducacion } from "@/lib/facturacion/generarFactura.ts";
import { abrirFactura, getLogoDataUri } from "@/lib/facturacion/browser.ts";
import { generarPdf } from "@/lib/facturacion/pdf.ts";
import { useLogoDataUri } from "@/components/AdminReact/Facturacion/useFacturaLogo.ts";

const NUMERIC_CLASS =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function parseNumero(valor: string): number {
    const n = parseFloat(valor.replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
}

function Seccion({ titulo, acciones, children }: { titulo: string; acciones?: ReactNode; children: ReactNode }) {
    return (
        <section className="pb-6 last:pb-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{titulo}</h3>
                {acciones}
            </div>
            {children}
        </section>
    );
}

function Campo({
    label,
    htmlFor,
    className,
    children,
}: {
    label: string;
    htmlFor?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
                {label}
            </Label>
            {children}
        </div>
    );
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
    const [descargandoPdf, setDescargandoPdf] = useState(false);

    const logoUri = useLogoDataUri();

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

    const htmlPreview = useMemo(() => {
        const c = parseNumero(costeDiario);
        const d = Math.trunc(parseNumero(dias));
        return generarHtmlFacturaEducacion(
            {
                numeroFactura: numeroFactura.trim(),
                fechaCorta: formatFechaCorta(fecha),
                codigoAsignacion: codigoAsignacion.trim(),
                mes,
                trayecto: trayecto.trim(),
                costeDiario: c,
                dias: d,
                totales: { base: parseNumero(base), iva: parseNumero(iva), total: parseNumero(total) },
            },
            logoUri,
        );
    }, [numeroFactura, fecha, codigoAsignacion, mes, trayecto, costeDiario, dias, base, iva, total, logoUri]);

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

            const logo = logoUri || (await getLogoDataUri().catch(() => ""));
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

    const handleDescargarPdf = async () => {
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

        setDescargandoPdf(true);
        try {
            const logo = logoUri || (await getLogoDataUri().catch(() => ""));
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
            const nombre = `factura_educacion_${numeroFactura.trim()}.pdf`;
            await generarPdf(html, nombre);
            showOkToast("PDF descargado correctamente");
        } catch (err) {
            console.error(err);
            showDangerToast("Error al generar el PDF");
        } finally {
            setDescargandoPdf(false);
        }
    };

    return (
        <section className="w-full px-4 pt-6 pb-12 md:px-6 md:pt-8 xl:px-0">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-evenly xl:gap-0">
                <div className="w-full min-w-0 shrink-0 xl:w-[700px]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Factura Educación</h2>
                        <p className="text-sm text-muted-foreground">
                            Rellena los datos y comprueba el resultado en vivo en el folio.
                        </p>
                    </div>
                    <form>
                        <div className="space-y-8">
                        <Seccion titulo="General">
                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Número de factura" htmlFor="educacionNumeroFactura">
                                    <Input
                                        id="educacionNumeroFactura"
                                        size="sm"
                                        value={numeroFactura}
                                        onChange={(e) => setNumeroFactura(e.target.value)}
                                        placeholder="Nº de factura"
                                    />
                                </Campo>
                                <Campo label="Fecha factura" htmlFor="educacionFecha">
                                    <DatePicker id="educacionFecha" value={fecha} onChange={setFecha} />
                                </Campo>
                                <Campo label="Código de asignación" htmlFor="codigoAsignacion" className="col-span-2">
                                    <AutocompleteInput
                                        id="codigoAsignacion"
                                        size="sm"
                                        value={codigoAsignacion}
                                        onValueChange={setCodigoAsignacion}
                                        opciones={codigosAsignacion}
                                        placeholder="Código de asignación"
                                    />
                                </Campo>
                            </div>
                        </Seccion>

                        <Seccion titulo="Datos de la factura">
                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Trayecto" htmlFor="trayecto" className="col-span-2">
                                    <AutocompleteInput
                                        id="trayecto"
                                        size="sm"
                                        value={trayecto}
                                        onValueChange={setTrayecto}
                                        opciones={trayectos}
                                        placeholder="Trayecto"
                                    />
                                </Campo>
                                <Campo label="Coste diario" htmlFor="costeDiario">
                                    <Input
                                        id="costeDiario"
                                        size="sm"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={costeDiario}
                                        onChange={(e) => {
                                            setCosteDiario(e.target.value);
                                            aplicarCosteDias(dias, e.target.value);
                                        }}
                                        className={NUMERIC_CLASS}
                                    />
                                </Campo>
                                <Campo label="Días" htmlFor="dias">
                                    <Input
                                        id="dias"
                                        size="sm"
                                        type="number"
                                        min={0}
                                        max={100000}
                                        step={1}
                                        value={dias}
                                        onChange={(e) => {
                                            setDias(e.target.value);
                                            aplicarCosteDias(e.target.value, costeDiario);
                                        }}
                                        className={NUMERIC_CLASS}
                                    />
                                </Campo>
                                <Campo label="Mes" htmlFor="mes" className="col-span-2">
                                    <Select value={mes || undefined} onValueChange={setMes}>
                                        <SelectTrigger id="mes" size="sm" className="w-full">
                                            <SelectValue placeholder="Selecciona un mes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MESES.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Campo>
                            </div>
                        </Seccion>

                        <Seccion titulo="Totales">
                            <div className="ml-auto mt-3 w-full max-w-[260px] space-y-1">
                                <div className="flex items-center justify-between gap-4 px-3 py-1.5 text-sm">
                                    <span className="text-muted-foreground">BASE</span>
                                    <span className="font-semibold tabular-nums">{formatNumero(parseNumero(base))}€</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-3 py-1.5 text-sm">
                                    <span className="text-muted-foreground">IVA 10%</span>
                                    <span className="font-semibold tabular-nums">{formatNumero(parseNumero(iva))}€</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-md bg-primary/10 px-3 py-1.5">
                                    <span className="font-bold">TOTAL</span>
                                    <span className="font-bold tabular-nums">{formatNumero(parseNumero(total))}€</span>
                                </div>
                            </div>
                            <p className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                                Destinatario fijo: <span className="font-medium">DEPARTAMENTO DE EDUCACIÓN</span> ·
                                Número de expediente <span className="font-medium">514TEE</span>
                            </p>
                        </Seccion>
                    </div>
                    </form>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            disabled={descargandoPdf}
                            onClick={handleDescargarPdf}
                            variant="outline"
                            size="lg"
                        >
                            <Download className="size-4" />
                            {descargandoPdf ? "Generando…" : "Descargar PDF"}
                        </Button>
                        <Button
                            type="button"
                            disabled={generando}
                            onClick={generar}
                            size="lg"
                        >
                            {generando ? "Generando…" : "Vista previa"}
                        </Button>
                    </div>
                </div>

                <div className="w-full min-w-0 xl:grow-0 xl:shrink xl:basis-[794px]">
                    <FacturaPreview html={htmlPreview} className="w-full" />
                </div>
            </div>
        </section>
    );
}
