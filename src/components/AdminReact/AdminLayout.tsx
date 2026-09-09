"use client";

import { ADMIN_NAV, type AdminNavItem } from "@/components/AdminReact/AdminNav.tsx";
import AdminSidebar from "@/components/AdminReact/AdminSidebar.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { type ComponentType } from "react";
import TarifasForm from "@/components/AdminReact/Tarifas/TarifasForm.tsx";
import EnlacesInteres from "@/components/AdminReact/EnlacesInteres/EnlacesInteres.tsx";
import Visitas from "@/components/AdminReact/Visitas/Visitas.tsx";
import CalculadoraRegistros from "@/components/AdminReact/Calculadora/CalculadoraRegistros.tsx";
import Facturacion from "@/components/AdminReact/Facturacion/Facturacion.tsx";

const SECTION_COMPONENTS: Record<string, ComponentType> = {
    "/tarifas": TarifasForm,
    "/enlaces": EnlacesInteres,
    "/visitas": Visitas,
    "/calculadora": CalculadoraRegistros,
    "/facturacion": Facturacion,
};

interface Props {
    activePath: string;
}

export default function AdminLayout({ activePath }: Props) {
    const current: AdminNavItem = ADMIN_NAV.find((item) => item.href === activePath) ?? ADMIN_NAV[0];
    const SectionComponent = SECTION_COMPONENTS[current.href];

    return (
        <SidebarProvider>
            <AdminSidebar activePath={current.href} />
            <SidebarInset>
                <div
                    className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <div className="w-full flex-1">
                    <div className="container pb-8">
                        {SectionComponent ? <SectionComponent /> : null}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
