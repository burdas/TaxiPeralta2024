export enum TipoTarifa {
    Diurna = "Diurna",
    Nocturna = "Nocturna",
}

export interface DatosFactura {
    fecha: string;
    descripcion: string;
    origen: string;
    destino: string;
    tarifa: TipoTarifa;
    kilometros: number;
    horas: number;
    importe: number;
}

export interface Entidad {
    nombre: string;
    direccion: string;
    codigo: string;
}

export interface TarifasFacturacion {
    kmDia: number;
    kmNoche: number;
    horaDia: number;
    horaNoche: number;
}

export const IVA = 0.1;

export const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export const COSTE_DIARIO_DEFECTO = 59.99;

export const DATOS_EMISOR = {
    nombre: "Jose Antonio Burdaspar Casado",
    web: "https://taxiperalta.com",
    direccion: "Avda. La Paz nº 74, 31350 Peralta (Navarra)",
    telefonos: "948750185 - 619461076",
    email: "taxi1peralta@gmail.com",
    nif: "15809048-K",
    cuenta: "Caja Rural ES9730080028873445439825",
};

export const DESTINATARIO_EDUCACION = {
    nombre: "DEPARTAMENTO DE EDUCACIÓN",
    servicio: "SERVICIO DE INFRAESTRUCTURAS EDUCATIVAS",
    negociado: "NEGOCIADO DE SERVICIOS COMPLEMENTARIOS",
    direccion: "31001 Cuesta de Santo Domingo, Pamplona",
    nif: "S-3100007-H",
    numeroRuta: "9382",
};
