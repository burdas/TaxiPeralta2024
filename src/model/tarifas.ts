interface TarifasProps {
    kmRecorrido: number;
    horaEspera: number;
    minimoPercepcion: number;
}

interface TarifasHorariasProps {
    diurna: TarifasProps;
    nocturna: TarifasProps;
}

export const tarifa: TarifasHorariasProps = {
    diurna: {
        kmRecorrido: 0.70,
        horaEspera: 19.38,
        minimoPercepcion: 3.78
    },
    nocturna: {
        kmRecorrido: 0.88,
        horaEspera: 28.83,
        minimoPercepcion: 5.63
    }
}