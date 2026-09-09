import { Input } from "@/components/ui/input.tsx";

interface Props {
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    opciones: string[];
    placeholder?: string;
    onSelect?: (valorSeleccionado: string) => void;
    className?: string;
    size?: "default" | "sm";
}

export function AutocompleteInput({ id, value, onValueChange, opciones, placeholder, onSelect, className, size }: Props) {
    const listId = id ? `${id}-list` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevo = e.target.value;
        onValueChange(nuevo);
        const coincide = opciones.find((opcion) => opcion === nuevo);
        if (coincide !== undefined) {
            onSelect?.(coincide);
        }
    };

    return (
        <>
            <Input
                id={id}
                list={listId}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={className}
                size={size}
                autoComplete="off"
            />
            {listId && (
                <datalist id={listId}>
                    {opciones.map((opcion) => (
                        <option key={opcion} value={opcion} />
                    ))}
                </datalist>
            )}
        </>
    );
}
