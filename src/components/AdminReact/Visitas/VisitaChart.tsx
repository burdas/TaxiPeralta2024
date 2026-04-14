"use client"

import * as React from "react"
import {CartesianGrid, Line, LineChart, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import type {JSX} from "react"

interface Props {
    chartData: {date: string; pagina: number}[]
    title: string
}

const chartConfig = {
    views: {
        label: "Visitas",
    },
    pagina: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function VisitaChart({chartData, title}: Props): JSX.Element {
    const total = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.pagina, 0),
        [chartData]
    )

    return (
        <Card className="pt-0 pb-4">
            <CardHeader className="flex items-stretch border-b !p-0">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:pb-0">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        Resultados totales
                    </CardDescription>
                </div>
                <div className="flex">
                    <div
                        className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l border-t-0 border-l px-8 py-6"
                    >
                        <span className="text-lg leading-none font-bold sm:text-3xl">
                            {total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-8 h-[300px]">
                <ChartContainer
                    config={chartConfig}
                    className="size-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("es-ES", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("es-ES", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey="pagina"
                            type="monotone"
                            stroke={`var(--color-pagina)`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
