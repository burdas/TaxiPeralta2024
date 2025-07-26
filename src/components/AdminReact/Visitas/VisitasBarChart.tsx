"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

type BarChartData = { month: string; [key: string]: string | number };

interface VisitasBarChartProps {
    data: BarChartData[];
    pages: string[];
}

// Colores predefinidos para las páginas
const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
];

export function VisitasBarChart({ data, pages }: VisitasBarChartProps) {
    const chartConfig: ChartConfig = pages.reduce((config, page, index) => {
        config[page] = {
            label: page,
            color: chartColors[index % chartColors.length],
        };
        return config;
    }, {} as ChartConfig);

    const totalVisitas = data.reduce((total, monthData) => {
        return total + pages.reduce((monthTotal, page) => {
            return monthTotal + (Number(monthData[page]) || 0);
        }, 0);
    }, 0);

    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];

    const currentMonthTotal = currentMonth ? pages.reduce((total, page) => total + (Number(currentMonth[page]) || 0), 0) : 0;
    const previousMonthTotal = previousMonth ? pages.reduce((total, page) => total + (Number(previousMonth[page]) || 0), 0) : 0;

    const growthPercentage = previousMonthTotal > 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
        : "0";

    if (data.length === 0) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Visitas por Mes</CardTitle>
                    <CardDescription>No hay datos disponibles</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Cargando datos...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="xl:col-span-3">
            <CardHeader>
                <CardTitle>Visitas por Mes</CardTitle>
                <CardDescription>
                    {data.length > 0 && `${data[0].month} - ${data[data.length - 1].month}`}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="size-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                // Mostrar solo el mes (sin año) si es muy largo
                                const parts = value.split(' ');
                                return parts[0].slice(0, 3);
                            }}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent className="flex-wrap" payload={undefined} />} />
                        {pages.map((page, index) => (
                            <Bar
                                key={page}
                                dataKey={page}
                                stackId="a"
                                fill={`var(--color-${page})`}
                                radius={index === 0 ? [0, 0, 4, 4] : index === pages.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {Number(growthPercentage) >= 0 ? (
                        <>Crecimiento del {growthPercentage}% este mes <TrendingUp className="h-4 w-4" /></>
                    ) : (
                        <>Descenso del {Math.abs(Number(growthPercentage))}% este mes</>
                    )}
                </div>
                <div className="text-muted-foreground leading-none">
                    Total de {totalVisitas} visitas en {data.length} meses
                </div>
            </CardFooter>
        </Card>
    )
}
