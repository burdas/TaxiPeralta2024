"use client";

import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { showDangerToast } from "@/utils/Toast.ts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import RegistroDetalleDialog from "./RegistroDetalleDialog.tsx";

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

const ITEMS_PER_PAGE = 20;

export default function CalculadoraRegistros() {
    const [isLoading, setIsLoading] = useState(true);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const res = await fetch("/api/registro-calculadora");
                if (!res.ok) throw new Error("Error al cargar los registros");
                const data = await res.json();
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

    const filteredRegistros = useMemo(() => {
        return registros.filter(reg => {
            const matchesSearch = reg.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.destino.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesDate = true;
            if (dateRange?.from) {
                const regDate = parseISO(reg.fecha);
                const start = startOfDay(dateRange.from);
                const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
                matchesDate = isWithinInterval(regDate, { start, end });
            }

            return matchesSearch && matchesDate;
        });
    }, [registros, searchTerm, dateRange]);

    const totalPages = Math.ceil(filteredRegistros.length / ITEMS_PER_PAGE);
    
    const paginatedRegistros = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRegistros.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRegistros, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateRange]);

    if (isLoading) {
        return (
            <section className="w-full mt-16 pb-8">
                <h2 className="text-2xl font-bold my-6 dark:text-white">Calculadora de rutas</h2>
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
            <h2 className="text-2xl font-bold my-6 dark:text-white">Calculadora de rutas</h2>
            
            <div className="flex flex-col md:flex-row gap-4 py-4 items-end md:items-center">
                <div className="w-full md:max-w-sm">
                    <Input
                        placeholder="Filtrar por origen o destino..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                            {format(dateRange.to, "LLL dd, y", { locale: es })}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y", { locale: es })
                                    )
                                ) : (
                                    <span>Seleccionar intervalo de fechas</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                    {dateRange && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDateRange(undefined)}
                            title="Limpiar filtro de fecha"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="w-[200px]">Fecha</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead>Destino</TableHead>
                            <TableHead className="w-[100px] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRegistros.length > 0 ? (
                            paginatedRegistros.map((reg, index) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium text-muted-foreground">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(reg.fecha).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell>{reg.origen}</TableCell>
                                    <TableCell>{reg.destino}</TableCell>
                                    <TableCell className="text-right">
                                        <RegistroDetalleDialog registro={reg} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="py-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                />
                            </PaginationItem>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                className="cursor-pointer"
                                                isActive={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext 
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </section>
    );
}
