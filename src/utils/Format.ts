const formater = new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR'})

export const numToEur = (n: number) => formater.format(n)

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const secToTimeFormat = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return (h === 0 ? '' : `${h}h `) + (m === 0 ? '' : `${m}m `) + (s === 0 ? '' : `${s}s`)
};