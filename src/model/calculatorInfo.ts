export interface Registro {
    id: number;
    ip: string;
    origen: string;
    origen_lat: number;
    origen_lon: number;
    destino: string;
    destino_lat: number;
    destino_lon: number;
    fecha: string;
}

export const infoItems = [
    "El precio que muestra la calculadora es orientativo.",
    "No están incluidos peajes, aparcamiento ni otros costes.",
    "Si la distancia entre origen y destino es larga, puede experimentar un retardo al calcular la ruta.",
    "Se pueden poner solo nombres de poblaciones (Ej: Peralta, Pamplona, etc).",
    "Se pueden poner direciones de la siguiente manera: Avda/calle, número y población.",
  ];