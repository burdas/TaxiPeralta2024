"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible } from "radix-ui";
import logo from "@/assets/logo.jpg";
import LogoutIcon from "@/components/Icons/svg/logout.svg?react";
import { ConfirmDialog } from "@/components/AdminReact/Shared/ConfirmDialog.tsx";
import { ThemeToggle } from "@/components/AdminReact/ThemeToggle.tsx";
import {
    ADMIN_NAV,
    esItemActivo,
    type AdminNavItem,
} from "@/components/AdminReact/AdminNav.tsx";
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar.tsx";

interface Props {
    activePath: string;
}

function NavGrupo({ item, activePath }: { item: AdminNavItem; activePath: string }) {
    const { setOpenMobile } = useSidebar();
    const activo = esItemActivo(item, activePath);
    const abiertoPorDefecto = item.children?.some((hijo) => hijo.href === activePath) ?? false;
    const handleNavigation = () => setOpenMobile(false);

    return (
        <Collapsible.Root
            asChild
            defaultOpen={abiertoPorDefecto}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <Collapsible.Trigger asChild>
                    <SidebarMenuButton tooltip={item.label} isActive={activo}>
                        <item.icon />
                        <span>{item.label}</span>
                        <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <SidebarMenuSub>
                        {item.children?.map((hijo) => (
                            <SidebarMenuSubItem key={hijo.href}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={hijo.href === activePath}
                                    onClick={handleNavigation}
                                >
                                    <a href={hijo.href}>
                                        <span>{hijo.label}</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </Collapsible.Content>
            </SidebarMenuItem>
        </Collapsible.Root>
    );
}

function NavEnlace({ item, activePath }: { item: AdminNavItem; activePath: string }) {
    const { setOpenMobile } = useSidebar();
    const handleNavigation = () => setOpenMobile(false);

    return (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={item.href === activePath}
                tooltip={item.label}
                onClick={handleNavigation}
            >
                <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export default function AdminSidebar({ activePath }: Props) {
    const { state, isMobile, setOpenMobile } = useSidebar();
    const logoutForm = useRef<HTMLFormElement>(null);

    const handleLogout = () => logoutForm.current?.requestSubmit();
    const handleNavigation = () => setOpenMobile(false);
    const colapsado = state === "collapsed" && !isMobile;

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
                            {ADMIN_NAV.map((item) => {
                                if (item.children && item.children.length > 0) {
                                    if (colapsado) {
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={esItemActivo(item, activePath)}
                                                    tooltip={item.label}
                                                >
                                                    <a href={item.children[0].href}>
                                                        <item.icon />
                                                        <span>{item.label}</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    }
                                    return <NavGrupo key={item.href} item={item} activePath={activePath} />;
                                }
                                return <NavEnlace key={item.href} item={item} activePath={activePath} />;
                            })}
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
