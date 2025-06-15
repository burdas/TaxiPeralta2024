import FooterLogout from "./FooterLogout";
import TarifasForm from "@/components/AdminReact/Tarifas/TarifasForm.tsx";

export default function AdminLayout() {
    return (
        <div className="h-[calc(100dvh-80px)] flex flex-col container">
            <main className="flex-1 w-full">
                <h1 className="text-3xl md:text-5xl font-bold text-center dark:text-white my-4">
                    Panel de administrador
                </h1>
                <TarifasForm />
            </main>
            <FooterLogout />
        </div>
    );
}
