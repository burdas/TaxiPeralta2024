"use client";

import { useRef } from "react";
import logo from "@/assets/logo.jpg";
import LogoutIcon from "@/components/Icons/svg/logout.svg?react";
import { ConfirmDialog } from "@/components/AdminReact/Shared/ConfirmDialog.tsx";
import { ThemeToggle } from "@/components/AdminReact/ThemeToggle.tsx";
import { ADMIN_NAV } from "@/components/AdminReact/AdminNav.tsx";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar.tsx";

interface Props {
    activePath: string;
}

export default function AdminSidebar({ activePath }: Props) {
    const { setOpenMobile } = useSidebar();
    const logoutForm = useRef<HTMLFormElement>(null);

    const handleNavigation = () => setOpenMobile(false);
    const handleLogout = () => logoutForm.current?.requestSubmit();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-1">
                    <SidebarMenu className="flex-1 group-data-[collapsible=icon]:hidden">
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild tooltip="Ir a la web">
                                <a href="/" onClick={handleNavigation}>
                                    <img
                                        src={logo.src}
                                        alt="Logo de Taxi Peralta"
                                        className="size-8 shrink-0 rounded-lg object-contain"
                                    />
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Taxi Peralta</span>
                                        <span className="truncate text-xs">Panel de administración</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarTrigger className="size-8 shrink-0 group-data-[collapsible=icon]:mx-auto" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
                                <SidebarMenuItem key={href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={href === activePath}
                                        tooltip={label}
                                        onClick={handleNavigation}
                                    >
                                        <a href={href}>
                                            <Icon />
                                            <span>{label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ThemeToggle />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <form action="/api/logout" method="post" className="w-full" ref={logoutForm}>
                            <ConfirmDialog title="¿Deseas cerrar la sesión?" onAccept={handleLogout}>
                                <SidebarMenuButton asChild tooltip="Cerrar sesión">
                                    <button type="button" className="w-full">
                                        <LogoutIcon />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </SidebarMenuButton>
                            </ConfirmDialog>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
