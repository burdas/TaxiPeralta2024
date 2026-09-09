import { type FC, type SVGProps } from "react";
import TarifasIcon from "@/components/Icons/svg/tarifasIcon.svg?react";
import EnlacesDeInteresIcon from "@/components/Icons/svg/enlacesDeInteres.svg?react";
import ChartIcon from "@/components/Icons/svg/chart.svg?react";
import CalculadoraIcon from "@/components/Icons/svg/calculadora.svg?react";
import FacturaIcon from "@/components/Icons/svg/factura.svg?react";

export type AdminIcon = FC<SVGProps<SVGSVGElement>>;

export type AdminNavItem = {
    href: string;
    label: string;
    icon: AdminIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
    { href: "/tarifas", label: "Tarifas", icon: TarifasIcon },
    { href: "/enlaces", label: "Enlaces de interés", icon: EnlacesDeInteresIcon },
    { href: "/visitas", label: "Visitas", icon: ChartIcon },
    { href: "/calculadora", label: "Calculadora de rutas", icon: CalculadoraIcon },
    { href: "/facturacion", label: "Facturación", icon: FacturaIcon },
];
