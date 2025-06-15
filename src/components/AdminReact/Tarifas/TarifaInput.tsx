import {Label} from "@/components/ui/label";
import InputNumeric from "@/components/AdminReact/Tarifas/InputNumeric.tsx";

type TarifasInputProps = {
    tipo: "diurna" | "nocturna";
    campo: "kmRecorrido" | "horaEspera" | "minimoPercepcion";
    label: string;
    value: number;
    onChange: (value: number, tipo: string, campo: string) => void;
};

export default function TarifasInput({
                                         tipo,
                                         campo,
                                         label,
                                         value,
                                         onChange,
                                     }: TarifasInputProps) {
    const id = `${tipo}.${campo}`;

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-lg">{label}</Label>
            <InputNumeric
                id={id}
                name={id}
                value={value}
                onChange={(value: number) => onChange(value, tipo, campo)}
                step={0.01}
                min={0.0}
                max={100.0}
            />
        </div>
    );
}
