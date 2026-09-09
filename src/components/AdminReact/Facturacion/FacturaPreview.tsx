"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const A4_ANCHO = 794;
const A4_ALTO = 1123;

interface Props {
    html: string;
    className?: string;
}

export default function FacturaPreview({ html, className }: Props) {
    const contenedorRef = useRef<HTMLDivElement>(null);
    const [escala, setEscala] = useState(0);

    useEffect(() => {
        const contenedor = contenedorRef.current;
        if (!contenedor) return;

        const actualizar = () => {
            const ancho = contenedor.clientWidth;
            if (ancho > 0) {
                setEscala(Math.min(ancho / A4_ANCHO, 1));
            }
        };

        actualizar();
        const observador = new ResizeObserver(actualizar);
        observador.observe(contenedor);
        return () => observador.disconnect();
    }, []);

    const hojaVisible = escala > 0;

    return (
        <div ref={contenedorRef} className={cn("w-full", className)}>
            {hojaVisible && (
                <div
                    className="relative"
                    style={{ width: A4_ANCHO * escala, height: A4_ALTO * escala }}
                >
                    <iframe
                        srcDoc={html}
                        title="Vista previa de la factura"
                        sandbox=""
                        scrolling="no"
                        className="absolute top-0 left-0 border-0 bg-white"
                        style={{
                            width: A4_ANCHO,
                            height: A4_ALTO,
                            transform: `scale(${escala})`,
                            transformOrigin: "top left",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
