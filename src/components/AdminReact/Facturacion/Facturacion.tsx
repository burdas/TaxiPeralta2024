"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import FacturaGeneral from "@/components/AdminReact/Facturacion/FacturaGeneral.tsx";
import FacturaEducacion from "@/components/AdminReact/Facturacion/FacturaEducacion.tsx";

type TipoFactura = "general" | "educacion";

export default function Facturacion() {
    const [tipo, setTipo] = useState<TipoFactura>("general");

    return (
        <section className="w-full mt-16 pb-8">
            <h2 className="text-2xl font-bold my-6">Facturación</h2>
            <div className="flex flex-wrap gap-3 mb-8">
                <Button
                    type="button"
                    variant={tipo === "general" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setTipo("general")}
                >
                    Factura General
                </Button>
                <Button
                    type="button"
                    variant={tipo === "educacion" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setTipo("educacion")}
                >
                    Factura Educación
                </Button>
            </div>
            {tipo === "general" ? <FacturaGeneral /> : <FacturaEducacion />}
        </section>
    );
}
