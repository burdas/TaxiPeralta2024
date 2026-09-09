"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { toFechaInput } from "@/lib/facturacion/format.ts";

interface Props {
    value: string;
    onChange: (value: string) => void;
    id?: string;
}

function parseFecha(valor: string): Date | undefined {
    if (!valor) return undefined;
    const date = new Date(`${valor}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export function DatePicker({ value, onChange, id }: Props) {
    const fecha = parseFecha(value);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-left font-normal"
                >
                    <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className={!fecha ? "text-muted-foreground" : ""}>
                        {fecha ? format(fecha, "dd/MM/yyyy") : "Selecciona una fecha"}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="single"
                    selected={fecha}
                    onSelect={(dia) => onChange(dia ? toFechaInput(dia) : "")}
                />
            </PopoverContent>
        </Popover>
    );
}
