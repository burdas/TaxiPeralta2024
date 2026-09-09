"use client";

import { useState } from "react";
import { ChevronDown, GraduationCap, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card.tsx";
import FacturaGeneral from "@/components/AdminReact/Facturacion/FacturaGeneral.tsx";
import FacturaEducacion from "@/components/AdminReact/Facturacion/FacturaEducacion.tsx";

type TipoFactura = "general" | "educacion";

export default function Facturacion() {
    const [abierta, setAbierta] = useState<TipoFactura | null>(null);

    const toggle = (tipo: TipoFactura) => {
        setAbierta((actual) => (actual === tipo ? null : tipo));
    };

    return (
        <section className="w-full mt-16 pb-8">
            <h2 className="text-2xl font-bold my-6">Facturación</h2>
            <div className="space-y-4">
                <Card>
                    <button
                        type="button"
                        onClick={() => toggle("general")}
                        aria-expanded={abierta === "general"}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-primary flex size-11 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
                                <ReceiptText className="size-6" />
                            </div>
                            <div>
                                <CardTitle>Factura General</CardTitle>
                                <CardDescription className="mt-1">
                                    Entidades, tarifas, líneas y totales con IVA.
                                </CardDescription>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                                abierta === "general" && "rotate-180",
                            )}
                        />
                    </button>
                    {abierta === "general" && (
                        <CardContent className="border-t pt-6">
                            <FacturaGeneral />
                        </CardContent>
                    )}
                </Card>

                <Card>
                    <button
                        type="button"
                        onClick={() => toggle("educacion")}
                        aria-expanded={abierta === "educacion"}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-primary flex size-11 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
                                <GraduationCap className="size-6" />
                            </div>
                            <div>
                                <CardTitle>Factura Educación</CardTitle>
                                <CardDescription className="mt-1">
                                    Trayectos escolares con destinatario fijo.
                                </CardDescription>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                                abierta === "educacion" && "rotate-180",
                            )}
                        />
                    </button>
                    {abierta === "educacion" && (
                        <CardContent className="border-t pt-6">
                            <FacturaEducacion />
                        </CardContent>
                    )}
                </Card>
            </div>
        </section>
    );
}
