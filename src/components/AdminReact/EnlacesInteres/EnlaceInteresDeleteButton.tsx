"use client";

import {Button} from "@/components/ui/button.tsx";
import Trash from "@/components/Icons/svg/trash.svg?react";
import {ConfirmDialog} from "@/components/AdminReact/Shared/ConfirmDialog.tsx";
import {showDangerToast, showOkToast} from "@/utils/Toast.ts";
import {useRef} from "react";


interface Props {
    id: number,
    fetchEnlacesFromApi: () => void
}

export default function EnlaceInteresDeleteButton({ id, fetchEnlacesFromApi }: Props) {
    const deleteForm = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/enlaces-interes/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(''),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al eliminar un enlace");
            }
            showOkToast("Enlace eliminado correctamente");
            fetchEnlacesFromApi();
        } catch (err) {
            showDangerToast("Error al eliminar el enlace");
        }
    }

    return (
        <form onSubmit={handleSubmit} ref={deleteForm}>
            <ConfirmDialog title="¿Estás seguro de que quieres borrar este enlace?"
                           description="Recuerda que no podras recuperarlo una vez este eliminado"
                            onAccept={() => deleteForm.current?.requestSubmit()}>
                <Button
                    variant="destructive"
                    size="icon">
                    <Trash/>
                </Button>
            </ConfirmDialog>
        </form>
    );
}