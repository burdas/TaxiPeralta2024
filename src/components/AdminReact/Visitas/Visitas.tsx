"use client";

import {Skeleton} from "@/components/ui/skeleton.tsx";
import {VisitaChart} from "@/components/AdminReact/Visitas/VisitaChart.tsx";
import {useEffect, useState} from "react";
import {showDangerToast} from "@/utils/Toast.ts";
import {VisitasBarChart} from "@/components/AdminReact/Visitas/VisitasBarChart.tsx";
import {Toggle} from "@/components/ui/toggle.tsx";

type Visita = { date: string; pagina: number };
type BarChartData = { month: string; [key: string]: string | number };

const FAKE_DATA_URL = "/api/fake-visitas";
const REAL_DATA_URL = "/api/visitas";

const transformToMonthlyData = (chartData: Record<string, Visita[]>): BarChartData[] => {
    const monthlyData: Record<string, BarChartData & { sortKey: string }> = {};
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);

    Object.entries(chartData).forEach(([pagina, visitas]) => {
        visitas.forEach(({ date }) => {
            const dateObj = new Date(date);
            if (dateObj < twelveMonthsAgo) return;
            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            const monthName = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthName, sortKey: monthKey };
            }

            monthlyData[monthKey][pagina] = Number(monthlyData[monthKey][pagina] || 0) + 1;
        });
    });

    return Object.values(monthlyData)
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(({ sortKey, ...rest }) => rest as BarChartData);
};

export default function Visitas() {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<Record<string, Visita[]>>({});
    const [originUrl, setOriginUrl] = useState<typeof REAL_DATA_URL | typeof FAKE_DATA_URL>(REAL_DATA_URL);

    useEffect(() => {
        const fetchVisitas = async () => {
            try {
                const res = await fetch(originUrl);
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
                setChartData(resultPorPagina);
            } catch (error) {
                console.error(error);
                showDangerToast("Error al cargar las visitas");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVisitas();

    }, [originUrl])

    const toggleOriginUrl = () => {
        setIsLoading(true);
        setOriginUrl(originUrl === REAL_DATA_URL ? FAKE_DATA_URL : REAL_DATA_URL);
    }

    const barChartData = transformToMonthlyData(chartData);
    const availablePages = Object.keys(chartData);

    const TestModeToggle = () => (
        <Toggle
            aria-label="Modo de prueba"
            size="lg"
            className="p-5 !text-white hover:ring ring-white"
            data-state={originUrl === FAKE_DATA_URL ? "on" : "off"}
            onClick={toggleOriginUrl}
        >
            <span className={`rounded-full size-2 inline-block ${originUrl === FAKE_DATA_URL ? "bg-green-500" : "bg-red-500"}`} />
            Modo de prueba
        </Toggle>
    );

    if (isLoading) {
        return (
            <section className="w-full mt-16 pb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold my-6">Visitas</h2>
                    <TestModeToggle />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <Skeleton key={i} className={`w-full h-[400px] ${i === 1 ? "md:col-span-3" : ""}`} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full mt-16 pb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold my-6">Visitas</h2>
                <TestModeToggle />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                <VisitasBarChart data={barChartData} pages={availablePages} />
                {Object.keys(chartData).map((pagina: string) => (
                    <VisitaChart key={pagina} chartData={chartData[pagina]} title={pagina} />
                ))}
            </div>
        </section>
    );
}