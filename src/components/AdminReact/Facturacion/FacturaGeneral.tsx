"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { ConfirmDialog } from "@/components/AdminReact/Shared/ConfirmDialog.tsx";
import { AutocompleteInput } from "@/components/AdminReact/Facturacion/AutocompleteInput.tsx";
import { DatePicker } from "@/components/AdminReact/Facturacion/DatePicker.tsx";
import { showDangerToast, showOkToast } from "@/utils/Toast.ts";
import Trash from "@/components/Icons/svg/trash.svg?react";
import {
    TipoTarifa,
    type DatosFactura,
    type Entidad,
    type TarifasFacturacion,
} from "@/lib/facturacion/types.ts";
import {
    getEntidades,
    getTarifas,
    saveEntidades,
    saveTarifas,
} from "@/lib/facturacion/storage.ts";
import { formatFechaCorta, formatNumero, toFechaInput } from "@/lib/facturacion/format.ts";
import {
    calcularImporteLinea,
    calcularTotales,
    generarHtmlFacturaGeneral,
    recalcularImportes,
    validarLinea,
} from "@/lib/facturacion/generarFactura.ts";
import { abrirFactura, getLogoDataUri } from "@/lib/facturacion/browser.ts";

type LineaForm = {
    fecha: string;
    descripcion: string;
    origen: string;
    destino: string;
    kilometros: string;
    horas: string;
};

const NUMERIC_CLASS =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function parseKm(valor: string): number {
    const n = parseInt(valor, 10);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
}

function parseHoras(valor: string): number {
    const n = parseFloat(valor.replace(",", "."));
    return Number.isNaN(n) ? 0 : Math.max(0, n);
}

function parseImporte(valor: string): number {
    const n = parseFloat(valor);
    return Number.isNaN(n) ? 0 : n;
}

function FilaLabels({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>;
}

function CampoLabel({
    htmlFor,
    children,
}: {
    htmlFor?: string;
    children: React.ReactNode;
}) {
    return <Label htmlFor={htmlFor}>{children}</Label>;
}

export default function FacturaGeneral() {
    const [entidades, setEntidades] = useState<Entidad[]>(() => getEntidades());
    const [entidad, setEntidad] = useState<Entidad>({ nombre: "", direccion: "", codigo: "" });
    const [tarifas, setTarifas] = useState<TarifasFacturacion>(() => getTarifas());
    const [numeroFactura, setNumeroFactura] = useState("");
    const [fecha, setFecha] = useState(() => toFechaInput(new Date()));
    const [mostrarKilometros, setMostrarKilometros] = useState(true);
    const [mostrarHoras, setMostrarHoras] = useState(true);
    const [tarifaLinea, setTarifaLinea] = useState<TipoTarifa>(TipoTarifa.Diurna);
    const [lineas, setLineas] = useState<DatosFactura[]>([]);
    const [linea, setLinea] = useState<LineaForm>({
        fecha: toFechaInput(new Date()),
        descripcion: "",
        origen: "",
        destino: "",
        kilometros: "",
        horas: "",
    });
    const [generando, setGenerando] = useState(false);

    const totales = useMemo(() => calcularTotales(lineas), [lineas]);

    const nombresEntidades = entidades.map((e) => e.nombre).filter((n) => n.trim() !== "");

    const rellenarDesdeEntidad = (nombre: string) => {
        const encontrada = entidades.find((e) => e.nombre === nombre);
        if (encontrada) {
            setEntidad({ nombre, direccion: encontrada.direccion, codigo: encontrada.codigo });
        } else {
            setEntidad((prev) => ({ ...prev, nombre }));
        }
    };

    const guardarEntidad = () => {
        if (entidad.nombre.trim() === "" && entidad.direccion.trim() === "" && entidad.codigo.trim() === "") {
            showDangerToast("Para guardar una entidad debes introducir al menos nombre, dirección o código.");
            return;
        }
        const nuevas = [...entidades, { ...entidad, nombre: entidad.nombre.trim() }];
        setEntidades(nuevas);
        saveEntidades(nuevas);
        setEntidad({ nombre: "", direccion: "", codigo: "" });
        showOkToast("Entidad guardada correctamente");
    };

    const guardarTarifas = () => {
        saveTarifas(tarifas);
        showOkToast("Tarifas guardadas correctamente");
    };

    const cambiarTarifa = (campo: keyof TarifasFacturacion, valor: number) => {
        setTarifas((prev) => ({ ...prev, [campo]: valor }));
    };

    const anadirLinea = () => {
        const kilometros = parseKm(linea.kilometros);
        const horas = parseHoras(linea.horas);
        const error = validarLinea({
            descripcion: linea.descripcion,
            origen: linea.origen,
            destino: linea.destino,
            kilometros,
            horas,
        });
        if (error) {
            showDangerToast(error);
            return;
        }
        const importe = calcularImporteLinea(kilometros, horas, tarifaLinea, tarifas);
        const nuevaLinea: DatosFactura = {
            fecha: formatFechaCorta(linea.fecha),
            descripcion: linea.descripcion.trim(),
            origen: linea.origen.trim(),
            destino: linea.destino.trim(),
            tarifa: tarifaLinea,
            kilometros,
            horas,
            importe,
        };
        setLineas((prev) => [...prev, nuevaLinea]);
        setLinea({
            fecha: toFechaInput(new Date()),
            descripcion: "",
            origen: "",
            destino: "",
            kilometros: "",
            horas: "",
        });
    };

    const editarLinea = (indice: number, campo: "kilometros" | "horas", valor: number) => {
        setLineas((prev) => {
            const siguientes = prev.map((l, i) => (i === indice ? { ...l, [campo]: valor } : l));
            return recalcularImportes(siguientes, tarifas);
        });
    };

    const eliminarLinea = (indice: number) => {
        setLineas((prev) => prev.filter((_, i) => i !== indice));
    };

    const generar = async () => {
        if (lineas.length === 0) {
            showDangerToast("No se puede generar la factura, no existen líneas.");
            return;
        }
        if (entidad.nombre.trim() === "" && entidad.direccion.trim() === "" && entidad.codigo.trim() === "") {
            showDangerToast("No se puede generar la factura, no existen datos de la empresa o entidad.");
            return;
        }
        if (numeroFactura.trim() === "") {
            showDangerToast("No se puede generar la factura, no existe el número de la factura.");
            return;
        }

        setGenerando(true);
        try {
            const logo = await getLogoDataUri().catch(() => "");
            const html = generarHtmlFacturaGeneral(
                {
                    entidad: {
                        nombre: entidad.nombre.trim(),
                        direccion: entidad.direccion.trim(),
                        codigo: entidad.codigo.trim(),
                    },
                    numeroFactura: numeroFactura.trim(),
                    fechaCorta: formatFechaCorta(fecha),
                    tarifas,
                    mostrarKilometros,
                    mostrarHoras,
                    lineas,
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
                <h2 className="text-2xl font-bold">Factura General</h2>
                <Button
                    type="button"
                    disabled={generando}
                    onClick={generar}
                    className="bg-green-600 text-white hover:bg-green-700"
                    size="lg"
                >
                    {generando ? "Generando…" : "Generar Factura"}
                </Button>
            </div>

            <div className="mt-6 space-y-6">
                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Empresa o Entidad</h3>
                    <FilaLabels>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="nombreEntidad">Nombre</CampoLabel>
                            <AutocompleteInput
                                id="nombreEntidad"
                                value={entidad.nombre}
                                onValueChange={(valor) => setEntidad((prev) => ({ ...prev, nombre: valor }))}
                                onSelect={rellenarDesdeEntidad}
                                opciones={nombresEntidades}
                                placeholder="Nombre de la entidad"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="direccionEntidad">Dirección</CampoLabel>
                            <Input
                                id="direccionEntidad"
                                value={entidad.direccion}
                                onChange={(e) => setEntidad((prev) => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Dirección de la entidad"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="codigoEntidad">Código</CampoLabel>
                            <Input
                                id="codigoEntidad"
                                value={entidad.codigo}
                                onChange={(e) => setEntidad((prev) => ({ ...prev, codigo: e.target.value }))}
                                placeholder="Código"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button type="button" variant="outline" onClick={guardarEntidad} className="w-full">
                                Guardar Entidad
                            </Button>
                        </div>
                    </FilaLabels>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">General</h3>
                    <FilaLabels>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="kmDia">Km recorrido (Día)</CampoLabel>
                            <Input
                                id="kmDia"
                                type="number"
                                min={0}
                                step="0.01"
                                value={tarifas.kmDia}
                                onChange={(e) => cambiarTarifa("kmDia", parseImporte(e.target.value))}
                                className={NUMERIC_CLASS}
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="kmNoche">Km recorrido (Noche)</CampoLabel>
                            <Input
                                id="kmNoche"
                                type="number"
                                min={0}
                                step="0.01"
                                value={tarifas.kmNoche}
                                onChange={(e) => cambiarTarifa("kmNoche", parseImporte(e.target.value))}
                                className={NUMERIC_CLASS}
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="horaDia">Hora espera (Día)</CampoLabel>
                            <Input
                                id="horaDia"
                                type="number"
                                min={0}
                                step="0.01"
                                value={tarifas.horaDia}
                                onChange={(e) => cambiarTarifa("horaDia", parseImporte(e.target.value))}
                                className={NUMERIC_CLASS}
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="horaNoche">Hora espera (Noche)</CampoLabel>
                            <Input
                                id="horaNoche"
                                type="number"
                                min={0}
                                step="0.01"
                                value={tarifas.horaNoche}
                                onChange={(e) => cambiarTarifa("horaNoche", parseImporte(e.target.value))}
                                className={NUMERIC_CLASS}
                            />
                        </div>
                    </FilaLabels>
                    <div className="flex justify-end">
                        <Button type="button" variant="outline" onClick={guardarTarifas}>
                            Guardar Tarifas
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Línea de la factura</h3>
                    <FilaLabels>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="fechaLinea">Fecha</CampoLabel>
                            <DatePicker
                                id="fechaLinea"
                                value={linea.fecha}
                                onChange={(valor) => setLinea((prev) => ({ ...prev, fecha: valor }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="descripcionLinea">Descripción</CampoLabel>
                            <Input
                                id="descripcionLinea"
                                value={linea.descripcion}
                                onChange={(e) => setLinea((prev) => ({ ...prev, descripcion: e.target.value }))}
                                placeholder="Descripción"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="origenLinea">Origen</CampoLabel>
                            <Input
                                id="origenLinea"
                                value={linea.origen}
                                onChange={(e) => setLinea((prev) => ({ ...prev, origen: e.target.value }))}
                                placeholder="Origen"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="destinoLinea">Destino</CampoLabel>
                            <Input
                                id="destinoLinea"
                                value={linea.destino}
                                onChange={(e) => setLinea((prev) => ({ ...prev, destino: e.target.value }))}
                                placeholder="Destino"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="kmLinea">Kilómetros</CampoLabel>
                            <Input
                                id="kmLinea"
                                type="number"
                                min={0}
                                max={10000}
                                step={1}
                                value={linea.kilometros}
                                onChange={(e) => setLinea((prev) => ({ ...prev, kilometros: e.target.value }))}
                                placeholder="0"
                                className={NUMERIC_CLASS}
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="horasLinea">Horas</CampoLabel>
                            <Input
                                id="horasLinea"
                                type="number"
                                min={0}
                                max={10000}
                                step="0.1"
                                value={linea.horas}
                                onChange={(e) => setLinea((prev) => ({ ...prev, horas: e.target.value }))}
                                placeholder="0"
                                className={NUMERIC_CLASS}
                            />
                        </div>
                    </FilaLabels>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                            <Label>Tarifa a aplicar</Label>
                            <RadioGroup
                                value={tarifaLinea}
                                onValueChange={(valor) => setTarifaLinea(valor as TipoTarifa)}
                                className="flex items-center gap-6"
                            >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value={TipoTarifa.Diurna} id="tarifaDiurna" />
                                    <Label htmlFor="tarifaDiurna" className="font-normal">
                                        Diurna
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value={TipoTarifa.Nocturna} id="tarifaNocturna" />
                                    <Label htmlFor="tarifaNocturna" className="font-normal">
                                        Nocturna
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button type="button" variant="default" onClick={anadirLinea}>
                            Añadir línea
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Líneas de la factura</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="p-2">Fecha</th>
                                    <th className="p-2">Descripción</th>
                                    <th className="p-2">Origen</th>
                                    <th className="p-2">Destino</th>
                                    <th className="p-2">Tarifa</th>
                                    <th className="p-2">Km</th>
                                    <th className="p-2">Horas</th>
                                    <th className="p-2 text-right">Importe</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineas.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-4 text-center text-muted-foreground">
                                            No hay líneas añadidas.
                                        </td>
                                    </tr>
                                )}
                                {lineas.map((l, i) => (
                                    <tr key={i} className="border-b hover:bg-muted/40">
                                        <td className="p-2 whitespace-nowrap">{l.fecha}</td>
                                        <td className="p-2">{l.descripcion}</td>
                                        <td className="p-2">{l.origen}</td>
                                        <td className="p-2">{l.destino}</td>
                                        <td className="p-2">{l.tarifa}</td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                max={10000}
                                                step={1}
                                                value={l.kilometros}
                                                onChange={(e) => editarLinea(i, "kilometros", parseKm(e.target.value))}
                                                className={`h-8 w-24 ${NUMERIC_CLASS}`}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                max={10000}
                                                step="0.1"
                                                value={l.horas}
                                                onChange={(e) => editarLinea(i, "horas", parseHoras(e.target.value))}
                                                className={`h-8 w-24 ${NUMERIC_CLASS}`}
                                            />
                                        </td>
                                        <td className="p-2 text-right whitespace-nowrap">{formatNumero(l.importe)}€</td>
                                        <td className="p-2 text-right">
                                            <ConfirmDialog
                                                title="¿Estás seguro de que quieres eliminar esta línea?"
                                                onAccept={() => eliminarLinea(i)}
                                            >
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive">
                                                    <Trash className="size-4" />
                                                </Button>
                                            </ConfirmDialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col items-end gap-1 pt-4 text-base">
                        <div className="flex items-center gap-6">
                            <span className="w-24 text-right text-muted-foreground">BASE</span>
                            <span className="w-28 text-right font-semibold">{formatNumero(totales.base)}€</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="w-24 text-right text-muted-foreground">IVA 10%</span>
                            <span className="w-28 text-right font-semibold">{formatNumero(totales.iva)}€</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="w-24 text-right text-muted-foreground">TOTAL</span>
                            <span className="w-28 text-right font-bold">{formatNumero(totales.total)}€</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Configuración de la factura</h3>
                    <FilaLabels>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="numeroFactura">Número factura</CampoLabel>
                            <Input
                                id="numeroFactura"
                                value={numeroFactura}
                                onChange={(e) => setNumeroFactura(e.target.value)}
                                placeholder="Nº de factura"
                            />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="fechaFactura">Fecha factura</CampoLabel>
                            <DatePicker id="fechaFactura" value={fecha} onChange={setFecha} />
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="mostrarKm">Mostrar kilómetros en la factura</CampoLabel>
                            <div className="flex h-9 items-center">
                                <Checkbox
                                    id="mostrarKm"
                                    checked={mostrarKilometros}
                                    onCheckedChange={(valor) => setMostrarKilometros(valor === true)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CampoLabel htmlFor="mostrarHoras">Mostrar horas en la factura</CampoLabel>
                            <div className="flex h-9 items-center">
                                <Checkbox
                                    id="mostrarHoras"
                                    checked={mostrarHoras}
                                    onCheckedChange={(valor) => setMostrarHoras(valor === true)}
                                />
                            </div>
                        </div>
                    </FilaLabels>
                </div>
            </div>
        </section>
    );
}
