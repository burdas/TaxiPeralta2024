import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Sol from "@/components/Icons/svg/Sol.svg?react";
import Luna from "@/components/Icons/svg/Luna.svg?react";
import TarifasInput from "@/components/AdminReact/Tarifas/TarifaInput.tsx";

type Props = {
    tipo: "diurna" | "nocturna";
    datos: {
        kmRecorrido: number;
        horaEspera: number;
        minimoPercepcion: number;
    };
    onChange: (value: number, tipo: string, campo: string) => void;
};

export default function TarifaCard({ tipo, datos, onChange }: Props) {
    const Icon = tipo === "diurna" ? Sol : Luna;
    const titulo = tipo === "diurna" ? "Tarifa Diurna" : "Tarifa Nocturna";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <Icon />
                <CardTitle className="text-xl font-semibold">{titulo}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TarifasInput
                    tipo={tipo}
                    campo="kmRecorrido"
                    label="Precio por kilómetro"
                    value={datos.kmRecorrido}
                    onChange={onChange}
                />
                <TarifasInput
                    tipo={tipo}
                    campo="horaEspera"
                    label="Precio por hora de espera"
                    value={datos.horaEspera}
                    onChange={onChange}
                />
                <TarifasInput
                    tipo={tipo}
                    campo="minimoPercepcion"
                    label="Mínimo de percepción"
                    value={datos.minimoPercepcion}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
}
