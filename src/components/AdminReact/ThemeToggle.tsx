"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.classList.contains("dark"));
    }, []);

    const toggle = () => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        localStorage.theme = next ? "dark" : "light";
        setDark(next);
    };

    return (
        <SidebarMenuButton
            tooltip="Cambiar tema"
            onClick={toggle}
            aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {dark ? <Sun /> : <Moon />}
            <span>{dark ? "Modo claro" : "Modo oscuro"}</span>
        </SidebarMenuButton>
    );
}
