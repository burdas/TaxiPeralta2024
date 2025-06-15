"use client";

import { useEffect, useState } from "react";
import TarifaSkeleton from "./TarifaSkeleton";
import TarifaCard from "./TarifaCard";
import { showDangerToast, showOkToast } from "@/utils/Toast.ts";
import LoadingButton from "@/components/AdminReact/Tarifas/LoadingButton.tsx";

export default function TarifasForm() {
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    const [tarifas, setTarifas] = useState({
        diurna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 },
        nocturna: { kmRecorrido: 0, horaEspera: 0, minimoPercepcion: 0 },
    });

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const res = await fetch("/api/tarifas");
                if (!res.ok) throw new Error("Error al cargar las tarifas");
                const data = await res.json();
                setTarifas(data);
            } catch (error) {
                console.error(error);
                showDangerToast("Error al cargar las tarifas");
            } finally {
                setIsFirstLoading(false);
            }
        };

        fetchTarifas();
    }, []);

    const handleChange = (value: number, tipo: string, campo: string) => {
        setTarifas((prev) => ({
            ...prev,
            [tipo]: {
                ...prev[tipo as keyof typeof prev],
                [campo]: value,
            },
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaveLoading(true);
        try {
            const res = await fetch("/api/tarifas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarifas),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al guardar las tarifas");
            }
            showOkToast("Tarifas guardadas correctamente");
        } catch (err) {
            console.error(err);
            showDangerToast("Error al guardar las tarifas");
        } finally {
            setIsSaveLoading(false);
        }
    };

    if (isFirstLoading) {
        return (
            <div className="w-full mt-16">
                <h2 className="text-2xl font-bold my-6">Configuración de Tarifas</h2>
                <TarifaSkeleton />
            </div>
        );
    }

    return (
        <div className="w-full mt-16">
            <h2 className="text-2xl font-bold my-6">Configuración de Tarifas</h2>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-8">
                    <TarifaCard tipo="diurna" datos={tarifas.diurna} onChange={handleChange} />
                    <TarifaCard tipo="nocturna" datos={tarifas.nocturna} onChange={handleChange} />
                </div>
                <div className="flex flex-col items-end">
                    <LoadingButton isLoading={isSaveLoading} />
                 </div>
            </form>
        </div>
    );
}

