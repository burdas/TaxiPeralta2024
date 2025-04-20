export interface RouteProps {
  href: string;
  label: string;
  icon: string;
}

export const routeList: RouteProps[] = [
  {
    href: "./#Informacion",
    label: "Información",
    icon: "Info"
  },
  {
    href: "./#Tarifas",
    label: "Tarifas",
    icon: "Tarifas"
  },
  {
    href: "./#Galeria",
    label: "Galeria",
    icon: "Galeria"
  },
  {
    href: "./calculadora_viajes",
    label: "Calcula tu viaje",
    icon: "Calculadora"
  },
  {
    href: "./#Enlaces",
    label: "Enlaces",
    icon: "Enlaces"
  },
  {
    href: "./fiestas_peralta",
    label: "Fiestas de Peralta",
    icon: "Fiesta"
  },
  {
    href: "./#Contacto",
    label: "Contacto",
    icon: "Contacto"
  },
];
