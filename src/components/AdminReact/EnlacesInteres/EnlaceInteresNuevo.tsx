"use client";

import {useState} from 'react';
import Mas from '@/components/Icons/svg/Mas.svg?react';
import {EnlaceInteresEditable} from "@/components/AdminReact/EnlacesInteres/EnlaceInteresEditable.tsx";

interface Props {
    fetchEnlacesFromApi: () => void;
}

export function EnlaceInteresNuevo({ fetchEnlacesFromApi }: Props) {
    const [openNewLink, setOpenNewLink] = useState(false)

    return (
        <>
            {!openNewLink ? (
                <button
                    className={`flex flex-row items-center gap-4 p-6 h-full border-dashed dark:border-gray-200 border-gray-600 border-1 rounded-xl group hover:bg-accent/50 transition-all duration-500 hover:shadow-lg animate-fade-in`}
                    onClick={() => setOpenNewLink(true)}>
                    <div
                        className="p-4 bg-primary text-white dark:text-black rounded-lg flex place-items-center flex-none group-hover:scale-105 transition-transform duration-200">
                        <Mas/>
                    </div>
                    <div className="flex flex-col place-content-center">
                        <h3 className="text-lg font-semibold">Crear un nuevo enlace</h3>
                    </div>
                </button>
            ) : (
                <EnlaceInteresEditable
                    onSuccess={() => {
                        fetchEnlacesFromApi();
                        setOpenNewLink(false);
                    }}
                    onCancel={() => {
                        setOpenNewLink(false)
                    }}
                    fetchUrl="/api/enlaces-interes"
                    method="POST"
                    successMessage="Enlace creado correctamente"
                    failureMessage="Error al guardar el nuevo enlace"
                />
            )}
        </>
    );
}