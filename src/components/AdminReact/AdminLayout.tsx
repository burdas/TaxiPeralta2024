"use client";

import { ADMIN_NAV, type AdminNavItem } from "@/components/AdminReact/AdminNav.tsx";
import AdminSidebar from "@/components/AdminReact/AdminSidebar.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { cn } from "@/lib/utils.ts";
import { type ComponentType } from "react";
import TarifasForm from "@/components/AdminReact/Tarifas/TarifasForm.tsx";
import EnlacesInteres from "@/components/AdminReact/EnlacesInteres/EnlacesInteres.tsx";
import Visitas from "@/components/AdminReact/Visitas/Visitas.tsx";
import CalculadoraRegistros from "@/components/AdminReact/Calculadora/CalculadoraRegistros.tsx";
import FacturaGeneral from "@/components/AdminReact/Facturacion/FacturaGeneral.tsx";
import FacturaEducacion from "@/components/AdminReact/Facturacion/FacturaEducacion.tsx";

const SECTION_COMPONENTS: Record<string, ComponentType> = {
    "/admin/tarifas": TarifasForm,
    "/admin/enlaces": EnlacesInteres,
    "/admin/visitas": Visitas,
    "/admin/calculadora": CalculadoraRegistros,
    "/admin/facturacion/general": FacturaGeneral,
    "/admin/facturacion/educacion": FacturaEducacion,
};

interface Props {
    activePath: string;
}

function encontrarItem(items: AdminNavItem[], activePath: string): AdminNavItem {
    for (const item of items) {
        if (item.href === activePath) return item;
        if (item.children?.some((hijo) => hijo.href === activePath)) return item;
    }
    return ADMIN_NAV[0];
}

export default function AdminLayout({ activePath }: Props) {
    const current = encontrarItem(ADMIN_NAV, activePath);
    const SectionComponent = SECTION_COMPONENTS[activePath] ?? SECTION_COMPONENTS[current.href];
    const esFacturacion = activePath.startsWith("/admin/facturacion");

    return (
        <SidebarProvider>
            <AdminSidebar activePath={activePath} />
            <SidebarInset>
                <div
                    className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <div className="w-full flex-1">
                    <div className={cn("pb-8", esFacturacion ? "px-0" : "container")}>
                        {SectionComponent ? <SectionComponent /> : null}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
