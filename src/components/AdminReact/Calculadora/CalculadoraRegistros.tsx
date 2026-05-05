"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { showDangerToast } from "@/utils/Toast.ts";

type Registro = {
    id: number;
    ip: string;
    origen: string;
    origen_lat: number;
    origen_lon: number;
    destino: string;
    destino_lat: number;
    destino_lon: number;
    fecha: string;
};

export default function CalculadoraRegistros() {
    const [isLoading, setIsLoading] = useState(true);
    const [registros, setRegistros] = useState<Registro[]>([]);

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const res = await fetch("/api/registro-calculadora");
                if (!res.ok) throw new Error("Error al cargar los registros");
                const data = await res.json();
                // Ordenar por fecha descendente
                setRegistros(data.sort((a: Registro, b: Registro) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
            } catch (error) {
                console.error(error);
                showDangerToast("Error al cargar los registros");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistros();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full mt-16 pb-8">
                <h2 className="text-2xl font-bold my-6 dark:text-white">Consultas Calculadora</h2>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="w-full h-12" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full mt-16 pb-8">
            <h2 className="text-2xl font-bold my-6 dark:text-white">Consultas Calculadora</h2>
            <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                            <th className="p-4 font-semibold dark:text-white">Fecha</th>
                            <th className="p-4 font-semibold dark:text-white">IP</th>
                            <th className="p-4 font-semibold dark:text-white">Origen</th>
                            <th className="p-4 font-semibold dark:text-white">Destino</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((reg) => (
                            <tr key={reg.id} className="border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4 text-sm whitespace-nowrap dark:text-zinc-300">
                                    {new Date(reg.fecha).toLocaleString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="p-4 text-sm dark:text-zinc-300 font-mono">{reg.ip}</td>
                                <td className="p-4 text-sm dark:text-zinc-300">{reg.origen}</td>
                                <td className="p-4 text-sm dark:text-zinc-300">{reg.destino}</td>
                            </tr>
                        ))}
                        {registros.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
