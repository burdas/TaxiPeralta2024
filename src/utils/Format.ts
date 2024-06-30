const formater = new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR'})

export const numToEur = (n: number) => formater.format(n)

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}