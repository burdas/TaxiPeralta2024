const numFormatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const cantidadFormatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatNumero = (n: number): string => numFormatter.format(n);

export const formatCantidad = (n: number): string => cantidadFormatter.format(n);

export function formatFechaCorta(fecha: string): string {
    if (!fecha) return "";
    const date = new Date(`${fecha}T00:00:00`);
    if (Number.isNaN(date.getTime())) return fecha;
    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export function toFechaInput(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
