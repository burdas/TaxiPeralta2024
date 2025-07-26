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

// const chartData = [
//     {date: "2024-04-01", pagina: 222, mobile: 150},
//     {date: "2024-04-02", pagina: 97, mobile: 180},
//     {date: "2024-04-03", pagina: 167, mobile: 120},
//     {date: "2024-04-04", pagina: 242, mobile: 260},
//     {date: "2024-04-05", pagina: 373, mobile: 290},
//     {date: "2024-04-06", pagina: 301, mobile: 340},
//     {date: "2024-04-07", pagina: 245, mobile: 180},
//     {date: "2024-04-08", pagina: 409, mobile: 320},
//     {date: "2024-04-09", pagina: 59, mobile: 110},
//     {date: "2024-04-10", pagina: 261, mobile: 190},
//     {date: "2024-04-11", pagina: 327, mobile: 350},
//     {date: "2024-04-12", pagina: 292, mobile: 210},
//     {date: "2024-04-13", pagina: 342, mobile: 380},
//     {date: "2024-04-14", pagina: 137, mobile: 220},
//     {date: "2024-04-15", pagina: 120, mobile: 170},
//     {date: "2024-04-16", pagina: 138, mobile: 190},
//     {date: "2024-04-17", pagina: 446, mobile: 360},
//     {date: "2024-04-18", pagina: 364, mobile: 410},
//     {date: "2024-04-19", pagina: 243, mobile: 180},
//     {date: "2024-04-20", pagina: 89, mobile: 150},
//     {date: "2024-04-21", pagina: 137, mobile: 200},
//     {date: "2024-04-22", pagina: 224, mobile: 170},
//     {date: "2024-04-23", pagina: 138, mobile: 230},
//     {date: "2024-04-24", pagina: 387, mobile: 290},
//     {date: "2024-04-25", pagina: 215, mobile: 250},
//     {date: "2024-04-26", pagina: 75, mobile: 130},
//     {date: "2024-04-27", pagina: 383, mobile: 420},
//     {date: "2024-04-28", pagina: 122, mobile: 180},
//     {date: "2024-04-29", pagina: 315, mobile: 240},
//     {date: "2024-04-30", pagina: 454, mobile: 380},
//     {date: "2024-05-01", pagina: 165, mobile: 220},
//     {date: "2024-05-02", pagina: 293, mobile: 310},
//     {date: "2024-05-03", pagina: 247, mobile: 190},
//     {date: "2024-05-04", pagina: 385, mobile: 420},
//     {date: "2024-05-05", pagina: 481, mobile: 390},
//     {date: "2024-05-06", pagina: 498, mobile: 520},
//     {date: "2024-05-07", pagina: 388, mobile: 300},
//     {date: "2024-05-08", pagina: 149, mobile: 210},
//     {date: "2024-05-09", pagina: 227, mobile: 180},
//     {date: "2024-05-10", pagina: 293, mobile: 330},
//     {date: "2024-05-11", pagina: 335, mobile: 270},
//     {date: "2024-05-12", pagina: 197, mobile: 240},
//     {date: "2024-05-13", pagina: 197, mobile: 160},
//     {date: "2024-05-14", pagina: 448, mobile: 490},
//     {date: "2024-05-15", pagina: 473, mobile: 380},
//     {date: "2024-05-16", pagina: 338, mobile: 400},
//     {date: "2024-05-17", pagina: 499, mobile: 420},
//     {date: "2024-05-18", pagina: 315, mobile: 350},
//     {date: "2024-05-19", pagina: 235, mobile: 180},
//     {date: "2024-05-20", pagina: 177, mobile: 230},
//     {date: "2024-05-21", pagina: 82, mobile: 140},
//     {date: "2024-05-22", pagina: 81, mobile: 120},
//     {date: "2024-05-23", pagina: 252, mobile: 290},
//     {date: "2024-05-24", pagina: 294, mobile: 220},
//     {date: "2024-05-25", pagina: 201, mobile: 250},
//     {date: "2024-05-26", pagina: 213, mobile: 170},
//     {date: "2024-05-27", pagina: 420, mobile: 460},
//     {date: "2024-05-28", pagina: 233, mobile: 190},
//     {date: "2024-05-29", pagina: 78, mobile: 130},
//     {date: "2024-05-30", pagina: 340, mobile: 280},
//     {date: "2024-05-31", pagina: 178, mobile: 230},
//     {date: "2024-06-01", pagina: 178, mobile: 200},
//     {date: "2024-06-02", pagina: 470, mobile: 410},
//     {date: "2024-06-03", pagina: 103, mobile: 160},
//     {date: "2024-06-04", pagina: 439, mobile: 380},
//     {date: "2024-06-05", pagina: 88, mobile: 140},
//     {date: "2024-06-06", pagina: 294, mobile: 250},
//     {date: "2024-06-07", pagina: 323, mobile: 370},
//     {date: "2024-06-08", pagina: 385, mobile: 320},
//     {date: "2024-06-09", pagina: 438, mobile: 480},
//     {date: "2024-06-10", pagina: 155, mobile: 200},
//     {date: "2024-06-11", pagina: 92, mobile: 150},
//     {date: "2024-06-12", pagina: 492, mobile: 420},
//     {date: "2024-06-13", pagina: 81, mobile: 130},
//     {date: "2024-06-14", pagina: 426, mobile: 380},
//     {date: "2024-06-15", pagina: 307, mobile: 350},
//     {date: "2024-06-16", pagina: 371, mobile: 310},
//     {date: "2024-06-17", pagina: 475, mobile: 520},
//     {date: "2024-06-18", pagina: 107, mobile: 170},
//     {date: "2024-06-19", pagina: 341, mobile: 290},
//     {date: "2024-06-20", pagina: 408, mobile: 450},
//     {date: "2024-06-21", pagina: 169, mobile: 210},
//     {date: "2024-06-22", pagina: 317, mobile: 270},
//     {date: "2024-06-23", pagina: 480, mobile: 530},
//     {date: "2024-06-24", pagina: 132, mobile: 180},
//     {date: "2024-06-25", pagina: 141, mobile: 190},
//     {date: "2024-06-26", pagina: 434, mobile: 380},
//     {date: "2024-06-27", pagina: 448, mobile: 490},
//     {date: "2024-06-28", pagina: 149, mobile: 200},
//     {date: "2024-06-29", pagina: 103, mobile: 160},
//     {date: "2024-06-30", pagina: 446, mobile: 400},
// ]

// const transformedData = chartData.map(({ date, pagina }) => ({ date, pagina }));

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
        () => (chartData.reduce((acc, curr) => acc + curr.pagina, 0)),
        []
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
