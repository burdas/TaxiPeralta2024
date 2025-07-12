"use client";

import {Skeleton} from "@/components/ui/skeleton.tsx";
import {VisitaChart} from "@/components/AdminReact/Visitas/VisitaChart.tsx";
import {useEffect, useState} from "react";
import {showDangerToast} from "@/utils/Toast.ts";
import {VisitasBarChart} from "@/components/AdminReact/Visitas/VisitasBarChart.tsx";

type Visita = { date: string; pagina: number };

export default function Visitas() {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<Record<string, Visita[]>>({});

    useEffect(() => {
        const fetchVisitas = async () => {
            try {
                const res = await fetch("/api/fake-visitas");
                if (!res.ok) throw new Error("Error al cargar las visitas");
                const data = await res.json();
                const resultPorPagina: Record<string, Visita[]> = {};

                const uniquePages: string[] = [...new Set(data.map((item: { pagina: string; }) => item.pagina)) as Set<string>];
                for (const pagina of uniquePages) {
                    resultPorPagina[pagina] = Object.values(
                        data
                            .filter((item: { pagina: string }) => item.pagina === pagina)
                            .reduce((acc: Record<string, { date: string; pagina: number }>, item: {
                                fecha: string
                            }) => {
                                const date = item.fecha.slice(0, 10); // YYYY-MM-DD
                                const key = `${date}`;
                                acc[key] = acc[key] || {date, pagina: 0};
                                acc[key].pagina++;
                                return acc;
                            }, {})
                    );
                }
                console.log(resultPorPagina);
                setChartData(resultPorPagina);
            } catch (error) {
                console.error(error);
                showDangerToast("Error al cargar las visitas");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVisitas();

    }, [])

    if (isLoading) {
        return (
            <section className="w-full mt-16 pb-8">
                <h2 className="text-2xl font-bold my-6">Visitas</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <Skeleton key={i} className="w-full h-[500px]" />
                    ))}
                </div>
            </section>
        );
    }


    return (
        <section className="w-full mt-16 pb-8">
            <h2 className="text-2xl font-bold my-6">Visitas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                <VisitasBarChart />
                {Object.keys(chartData).map((pagina: string) => (
                    <VisitaChart chartData={chartData[pagina]} title={pagina} />
                ))}
            </div>
        </section>
    );
}