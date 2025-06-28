import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react";

interface Props {
    title?: string,
    description?: string,
    onAccept?: () => void,
    children?: React.ReactNode,
}

export function ConfirmDialog({ title, description, onAccept, children }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                { children }
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    { title && (
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    ) }
                    { description && (
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onAccept}>Aceptar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
