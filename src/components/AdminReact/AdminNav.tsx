import { type FC, type SVGProps } from "react";
import TarifasIcon from "@/components/Icons/svg/tarifasIcon.svg?react";
import EnlacesDeInteresIcon from "@/components/Icons/svg/enlacesDeInteres.svg?react";
import ChartIcon from "@/components/Icons/svg/chart.svg?react";
import CalculadoraIcon from "@/components/Icons/svg/calculadora.svg?react";
import FacturaIcon from "@/components/Icons/svg/factura.svg?react";

export type AdminIcon = FC<SVGProps<SVGSVGElement>>;

export type AdminNavChild = {
    href: string;
    label: string;
};

export type AdminNavItem = {
    href: string;
    label: string;
    icon: AdminIcon;
    children?: AdminNavChild[];
};

export const ADMIN_NAV: AdminNavItem[] = [
    { href: "/admin/tarifas", label: "Tarifas", icon: TarifasIcon },
    { href: "/admin/enlaces", label: "Enlaces de interés", icon: EnlacesDeInteresIcon },
    { href: "/admin/visitas", label: "Visitas", icon: ChartIcon },
    { href: "/admin/calculadora", label: "Calculadora de rutas", icon: CalculadoraIcon },
    {
        href: "/admin/facturacion",
        label: "Facturación",
        icon: FacturaIcon,
        children: [
            { href: "/admin/facturacion/general", label: "Factura General" },
            { href: "/admin/facturacion/educacion", label: "Factura Educación" },
        ],
    },
];

export function esItemActivo(item: AdminNavItem, activePath: string): boolean {
    if (item.href === activePath) return true;
    return item.children?.some((hijo) => hijo.href === activePath) ?? false;
}
