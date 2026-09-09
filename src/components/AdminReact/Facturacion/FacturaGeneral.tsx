"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { ConfirmDialog } from "@/components/AdminReact/Shared/ConfirmDialog.tsx";
import { AutocompleteInput } from "@/components/AdminReact/Facturacion/AutocompleteInput.tsx";
import { DatePicker } from "@/components/AdminReact/Facturacion/DatePicker.tsx";
import FacturaPreview from "@/components/AdminReact/Facturacion/FacturaPreview.tsx";
import { showDangerToast, showOkToast } from "@/utils/Toast.ts";
import Trash from "@/components/Icons/svg/trash.svg?react";
import { cn } from "@/lib/utils.ts";
import {
    TipoTarifa,
    type DatosFactura,
    type Entidad,
    type TarifasFacturacion,
} from "@/lib/facturacion/types.ts";
import {
    getEntidades,
    saveEntidades,
    TARIFAS_POR_DEFECTO,
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
import { useLogoDataUri } from "@/components/AdminReact/Facturacion/useFacturaLogo.ts";

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

function aTarifasFacturacion(datos: {
    diurna?: { kmRecorrido?: number; horaEspera?: number };
    nocturna?: { kmRecorrido?: number; horaEspera?: number };
}): TarifasFacturacion {
    return {
        kmDia: datos.diurna?.kmRecorrido ?? TARIFAS_POR_DEFECTO.kmDia,
        kmNoche: datos.nocturna?.kmRecorrido ?? TARIFAS_POR_DEFECTO.kmNoche,
        horaDia: datos.diurna?.horaEspera ?? TARIFAS_POR_DEFECTO.horaDia,
        horaNoche: datos.nocturna?.horaEspera ?? TARIFAS_POR_DEFECTO.horaNoche,
    };
}

export default function FacturaGeneral() {
    const [entidades, setEntidades] = useState<Entidad[]>(() => getEntidades());
    const [entidad, setEntidad] = useState<Entidad>({ nombre: "", direccion: "", codigo: "" });
    const [tarifas, setTarifas] = useState<TarifasFacturacion>(TARIFAS_POR_DEFECTO);
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

    const logoUri = useLogoDataUri();

    useEffect(() => {
        let activo = true;
        fetch("/api/tarifas")
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar las tarifas");
                return res.json();
            })
            .then((datos) => {
                if (activo) setTarifas(aTarifasFacturacion(datos));
            })
            .catch((err) => console.error(err));
        return () => {
            activo = false;
        };
    }, []);

    useEffect(() => {
        setLineas((prev) => recalcularImportes(prev, tarifas));
    }, [tarifas]);

    const totales = useMemo(() => calcularTotales(lineas), [lineas]);

    const htmlPreview = useMemo(
        () =>
            generarHtmlFacturaGeneral(
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
                logoUri,
            ),
        [entidad, numeroFactura, fecha, tarifas, mostrarKilometros, mostrarHoras, lineas, logoUri],
    );

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
            const logo = logoUri || (await getLogoDataUri().catch(() => ""));
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
        <section className="w-full px-4 pt-6 pb-12 md:px-6 md:pt-8 xl:px-0">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-evenly xl:gap-0">
                <div className="w-full min-w-0 shrink-0 xl:w-[700px]">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Factura General</h2>
                            <p className="text-sm text-muted-foreground">
                                Rellena los datos y comprueba el resultado en vivo en el folio.
                            </p>
                        </div>
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
                    <form>
                        <div className="space-y-8">
                        <Seccion
                            titulo="Empresa o entidad"
                            acciones={
                                <Button type="button" variant="outline" size="sm" onClick={guardarEntidad}>
                                    Guardar entidad
                                </Button>
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Nombre" htmlFor="nombreEntidad" className="col-span-2">
                                    <AutocompleteInput
                                        id="nombreEntidad"
                                        size="sm"
                                        value={entidad.nombre}
                                        onValueChange={(valor) => setEntidad((prev) => ({ ...prev, nombre: valor }))}
                                        onSelect={rellenarDesdeEntidad}
                                        opciones={nombresEntidades}
                                        placeholder="Nombre de la entidad"
                                    />
                                </Campo>
                                <Campo label="Dirección" htmlFor="direccionEntidad" className="col-span-2">
                                    <Input
                                        id="direccionEntidad"
                                        size="sm"
                                        value={entidad.direccion}
                                        onChange={(e) => setEntidad((prev) => ({ ...prev, direccion: e.target.value }))}
                                        placeholder="Dirección de la entidad"
                                    />
                                </Campo>
                                <Campo label="Código" htmlFor="codigoEntidad">
                                    <Input
                                        id="codigoEntidad"
                                        size="sm"
                                        value={entidad.codigo}
                                        onChange={(e) => setEntidad((prev) => ({ ...prev, codigo: e.target.value }))}
                                        placeholder="Código"
                                    />
                                </Campo>
                            </div>
                        </Seccion>

                        <Seccion
                            titulo="Nueva línea"
                            acciones={
                                <Button type="button" size="sm" onClick={anadirLinea}>
                                    Añadir línea
                                </Button>
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Fecha" htmlFor="fechaLinea">
                                    <DatePicker
                                        id="fechaLinea"
                                        value={linea.fecha}
                                        onChange={(valor) => setLinea((prev) => ({ ...prev, fecha: valor }))}
                                    />
                                </Campo>
                                <Campo label="Descripción" htmlFor="descripcionLinea">
                                    <Input
                                        id="descripcionLinea"
                                        size="sm"
                                        value={linea.descripcion}
                                        onChange={(e) => setLinea((prev) => ({ ...prev, descripcion: e.target.value }))}
                                        placeholder="Descripción"
                                    />
                                </Campo>
                                <Campo label="Origen" htmlFor="origenLinea">
                                    <Input
                                        id="origenLinea"
                                        size="sm"
                                        value={linea.origen}
                                        onChange={(e) => setLinea((prev) => ({ ...prev, origen: e.target.value }))}
                                        placeholder="Origen"
                                    />
                                </Campo>
                                <Campo label="Destino" htmlFor="destinoLinea">
                                    <Input
                                        id="destinoLinea"
                                        size="sm"
                                        value={linea.destino}
                                        onChange={(e) => setLinea((prev) => ({ ...prev, destino: e.target.value }))}
                                        placeholder="Destino"
                                    />
                                </Campo>
                                <Campo label="Kilómetros" htmlFor="kmLinea">
                                    <Input
                                        id="kmLinea"
                                        size="sm"
                                        type="number"
                                        min={0}
                                        max={10000}
                                        step={1}
                                        value={linea.kilometros}
                                        onChange={(e) => setLinea((prev) => ({ ...prev, kilometros: e.target.value }))}
                                        placeholder="0"
                                        className={NUMERIC_CLASS}
                                    />
                                </Campo>
                                <Campo label="Horas" htmlFor="horasLinea">
                                    <Input
                                        id="horasLinea"
                                        size="sm"
                                        type="number"
                                        min={0}
                                        max={10000}
                                        step="0.1"
                                        value={linea.horas}
                                        onChange={(e) => setLinea((prev) => ({ ...prev, horas: e.target.value }))}
                                        placeholder="0"
                                        className={NUMERIC_CLASS}
                                    />
                                </Campo>
                            </div>
                            <RadioGroup
                                value={tarifaLinea}
                                onValueChange={(valor) => setTarifaLinea(valor as TipoTarifa)}
                                className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2"
                            >
                                <Label className="text-xs font-medium text-muted-foreground">Tarifa a aplicar</Label>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value={TipoTarifa.Diurna} id="tarifaDiurna" />
                                    <Label htmlFor="tarifaDiurna" className="text-sm font-normal">
                                        Diurna
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value={TipoTarifa.Nocturna} id="tarifaNocturna" />
                                    <Label htmlFor="tarifaNocturna" className="text-sm font-normal">
                                        Nocturna
                                    </Label>
                                </div>
                            </RadioGroup>
                        </Seccion>

                        <Seccion titulo="Líneas de la factura">
                            <div className="-mx-1 overflow-x-auto px-1">
                                <Table className="min-w-[640px]">
                                    <TableHeader>
                                        <TableRow className="bg-muted/60 hover:bg-muted/60">
                                            <TableHead className="h-9 px-2 py-2 font-semibold text-foreground">
                                                Fecha
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 font-semibold text-foreground">
                                                Descripción
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 font-semibold text-foreground">
                                                Origen
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 font-semibold text-foreground">
                                                Destino
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 font-semibold text-foreground">
                                                Tarifa
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 text-right font-semibold text-foreground">
                                                Km
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 text-right font-semibold text-foreground">
                                                Horas
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2 text-right font-semibold text-foreground">
                                                Importe
                                            </TableHead>
                                            <TableHead className="h-9 px-2 py-2"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lineas.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={9} className="p-4 text-center text-muted-foreground">
                                                    No hay líneas añadidas.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {lineas.map((l, i) => (
                                            <TableRow key={i} className="odd:bg-muted/30">
                                                <TableCell className="px-2 py-1.5 whitespace-nowrap">{l.fecha}</TableCell>
                                                <TableCell className="px-2 py-1.5">{l.descripcion}</TableCell>
                                                <TableCell className="px-2 py-1.5">{l.origen}</TableCell>
                                                <TableCell className="px-2 py-1.5">{l.destino}</TableCell>
                                                <TableCell className="px-2 py-1.5">
                                                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {l.tarifa}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-2 py-1.5">
                                                    <Input
                                                        type="number"
                                                        size="sm"
                                                        min={0}
                                                        max={10000}
                                                        step={1}
                                                        value={l.kilometros}
                                                        onChange={(e) => editarLinea(i, "kilometros", parseKm(e.target.value))}
                                                        className={`w-16 text-right ${NUMERIC_CLASS}`}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-2 py-1.5">
                                                    <Input
                                                        type="number"
                                                        size="sm"
                                                        min={0}
                                                        max={10000}
                                                        step="0.1"
                                                        value={l.horas}
                                                        onChange={(e) => editarLinea(i, "horas", parseHoras(e.target.value))}
                                                        className={`w-16 text-right ${NUMERIC_CLASS}`}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-2 py-1.5 text-right font-semibold whitespace-nowrap tabular-nums">
                                                    {formatNumero(l.importe)}€
                                                </TableCell>
                                                <TableCell className="px-2 py-1.5 text-right">
                                                    <ConfirmDialog
                                                        title="¿Estás seguro de que quieres eliminar esta línea?"
                                                        onAccept={() => eliminarLinea(i)}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-destructive"
                                                        >
                                                            <Trash className="size-4" />
                                                        </Button>
                                                    </ConfirmDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="ml-auto mt-3 w-full max-w-[260px] space-y-1">
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">BASE</span>
                                    <span className="font-semibold tabular-nums">{formatNumero(totales.base)}€</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">IVA 10%</span>
                                    <span className="font-semibold tabular-nums">{formatNumero(totales.iva)}€</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-md bg-primary/10 px-3 py-1.5">
                                    <span className="font-bold">TOTAL</span>
                                    <span className="font-bold tabular-nums">{formatNumero(totales.total)}€</span>
                                </div>
                            </div>
                        </Seccion>

                        <Seccion titulo="Configuración">
                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Número de factura" htmlFor="numeroFactura">
                                    <Input
                                        id="numeroFactura"
                                        size="sm"
                                        value={numeroFactura}
                                        onChange={(e) => setNumeroFactura(e.target.value)}
                                        placeholder="Nº de factura"
                                    />
                                </Campo>
                                <Campo label="Fecha de factura" htmlFor="fechaFactura">
                                    <DatePicker id="fechaFactura" value={fecha} onChange={setFecha} />
                                </Campo>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="mostrarKm"
                                        checked={mostrarKilometros}
                                        onCheckedChange={(valor) => setMostrarKilometros(valor === true)}
                                    />
                                    <Label htmlFor="mostrarKm" className="text-sm font-normal">
                                        Mostrar kilómetros
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="mostrarHoras"
                                        checked={mostrarHoras}
                                        onCheckedChange={(valor) => setMostrarHoras(valor === true)}
                                    />
                                    <Label htmlFor="mostrarHoras" className="text-sm font-normal">
                                        Mostrar horas
                                    </Label>
                                </div>
                            </div>
                        </Seccion>
                    </div>
                    </form>
                </div>

                <div className="w-full min-w-0 xl:grow-0 xl:shrink xl:basis-[794px]">
                    <FacturaPreview html={htmlPreview} className="w-full" />
                </div>
            </div>
        </section>
    );
}
