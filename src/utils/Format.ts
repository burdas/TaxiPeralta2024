const formater = new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR'})

export const numToEur = (n: number) => formater.format(n)

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const secToTimeFormat = (seconds: number): string => {
    const arr = new Date(seconds * 1000).toISOString().slice(11, 19).split(':')
    return (arr[0] === '00' ? '' : `${arr[0]}hr `) + (arr[1] === '00' ? '' : `${arr[1]}m `) + (arr[2] === '00' ? '' : `${arr[2]}s`)
};