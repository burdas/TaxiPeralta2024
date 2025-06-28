"use client";

import {useState, useEffect} from 'react';
import Mas from '@/components/Icons/svg/Mas.svg?react';
import {showDangerToast} from "@/utils/Toast.ts";
import EnlaceInteres from "@/components/AdminReact/EnlacesInteres/EnlaceInteres.tsx";
import {EnlaceInteresNuevo} from "@/components/AdminReact/EnlacesInteres/EnlaceInteresNuevo.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";


interface EnlaceInteres {
    id: number;
    texto: string;
    url: string;
    ultimaActualizacion: string;
}

export default function EnlacesInteres() {
    const [enlaces, setEnlaces] = useState<EnlaceInteres[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchEnlacesFromApi = async () => {
        try {
            const response = await fetch('/api/enlaces-interes');
            if (!response.ok) {
                throw new Error('Error al cargar los enlaces de interés');
            }
            const data = await response.json();
            setEnlaces(data);
        } catch (err) {
            showDangerToast("Error al cargar los enlaces de interés");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEnlacesFromApi();
    }, []);

    if (loading) {
        return (
            <section className="w-full mt-16">
                <h2 className="text-2xl font-bold my-6">Enlaces de interés</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(() => (
                        <Skeleton className="w-full h-[150px]" />
                    ))}
                </div>
            </section>
        );
    }


    return (
        <section className="w-full mt-16 pb-8">
            <h2 className="text-2xl font-bold my-6">Enlaces de interés</h2>
            {
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {enlaces.map((enlace) => (
                        <EnlaceInteres id={enlace.id}
                                       url={enlace.url}
                                       key={enlace.id}
                                       texto={enlace.texto}
                                       ultimaActualizacion={enlace.ultimaActualizacion}
                                       fetchEnlacesFromApi={fetchEnlacesFromApi}/>
                    ))}
                    <EnlaceInteresNuevo fetchEnlacesFromApi={fetchEnlacesFromApi}/>
                </div>}
        </section>
    );
}