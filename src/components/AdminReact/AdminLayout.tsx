import TarifasForm from "@/components/AdminReact/Tarifas/TarifasForm.tsx";
import EnlacesInteres from "@/components/AdminReact/EnlacesInteres/EnlacesInteres.tsx";
import TarifasIcon from "@/components/Icons/svg/tarifasIcon.svg?react";
import EnlacesDeInteres from "@/components/Icons/svg/EnlacesDeInteres.svg?react";
import {type FC, type SVGProps, useEffect, useState} from "react";
import Sidebar from "@/components/AdminReact/Sidebar.tsx";

type Section = {
    text: string;
    icon: FC<SVGProps<SVGSVGElement>>;
};

const sections: Section[] = [
    { text: "Tarifas", icon: TarifasIcon },
    { text: "Enlaces de interés", icon: EnlacesDeInteres },
]
type ActiveSections = typeof sections[number]['text'];

export default function AdminLayout() {
    const [activeSection, setActiveSection] = useState<ActiveSections>('Tarifas');

    useEffect(() => {
        const storedView = localStorage.getItem("activeSection");
        if (storedView) {
            setActiveSection(storedView);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("activeSection", activeSection);
    }, [activeSection]);

    return (
        <div className="min-h-[calc(100dvh-80px)] flex flex-col lg:flex-row mb-20 lg:mb-0">
            <Sidebar sections={sections} changeSection={setActiveSection} activeSection={activeSection} />
            <main className="flex-1 w-full container">
                <h1 className="text-3xl md:text-5xl font-bold dark:text-white my-4">
                    Panel de administrador
                </h1>
                {activeSection === "Tarifas" && <TarifasForm />}
                {activeSection === "Enlaces de interés" && <EnlacesInteres />}
            </main>
        </div>
    );
}
