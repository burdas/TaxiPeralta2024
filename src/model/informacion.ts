export interface InformacionProps {
  estandar: string[];
  vip: { titulo: string; subtitulo: string }[];
}

export const informacion: InformacionProps = {
  estandar: [
    "Asistencia a Mutuas y Aseguradoras",
    "Servicios exclusivos para Empresas",
    "Traslados a Hospitales y Centros Médicos",
    "Transporte Escolar homologado",
    "Mensajería: Valijas, sobres y paquetería urgente",
  ],
  vip: [
    { titulo: "4 Plazas", subtitulo: "Capacidad amplia" },
    { titulo: "Gran Maletero", subtitulo: "Para todo su equipaje" },
    { titulo: "Conectividad", subtitulo: "USB & Corriente" },
    { titulo: "Aire Puro", subtitulo: "Ionizador de aire" },
    { titulo: "Power Bank", subtitulo: "Carga garantizada" },
    { titulo: "GPS Live", subtitulo: "Rutas optimizadas" },
  ],
};
