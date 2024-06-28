const formater = new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'EUR'})

export const numToEur = (n: number) => formater.format(n)