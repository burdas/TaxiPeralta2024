"use client";

import ExternalLink from "@/components/Icons/svg/externalLink.svg?react";
import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDate} from "@/utils/Format";
import EnlaceInteresDeleteButton from "@/components/AdminReact/EnlacesInteres/EnlaceInteresDeleteButton.tsx";
import {Button} from "@/components/ui/button.tsx";
import Edit from "@/components/Icons/svg/edit.svg?react"
import {useState} from "react";
import {EnlaceInteresEditable} from "@/components/AdminReact/EnlacesInteres/EnlaceInteresEditable.tsx";


interface Props {
    id: number;
    texto: string;
    url: string;
    ultimaActualizacion: string;
    fetchEnlacesFromApi: () => void;
}

export default function EnlaceInteres({id, texto, url, ultimaActualizacion, fetchEnlacesFromApi}: Props) {
    const [isVisibleEditableLink, setIsVisibleEditableLink] = useState(false);

    return !isVisibleEditableLink ? (

        <a
            href={url}
            target="_blank"
            className="animate-fade-in"
        >
            <Card
                className="flex flex-row items-center gap-2 md:gap-4 !px-2 md:!px-6 py-4 h-full group hover:hover:bg-accent/50 transition-all duration-200 hover:shadow-lg">
                <div
                    className="p-2 sm:p-4 bg-muted rounded-md sm:rounded-lg flex place-items-center flex-none group-hover:scale-105">
                    <ExternalLink/>
                </div>
                <div className="flex flex-col place-content-center grow min-w-0">
                    <h3 className="text-md sm:text-lg font-semibold truncate">{texto}</h3>
                    <p className="text-sm sm:text-md text-muted-foreground truncate">{url}</p>
                    <Badge className="mt-1">{formatDate(new Date(ultimaActualizacion))}</Badge>
                </div>
                <div
                    className="flex-row items-center gap-2 flex md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}>
                    <Button type="button"
                            variant="secondary"
                            size="icon"
                            onClick={() => setIsVisibleEditableLink(true)}>
                        <Edit/>
                    </Button>
                    <EnlaceInteresDeleteButton fetchEnlacesFromApi={fetchEnlacesFromApi} id={id}/>
                </div>
            </Card>
        </a>
    ) : (
        <EnlaceInteresEditable failureMessage="Error al actualizar el enlace"
                               fetchUrl={`/api/enlaces-interes/${id}`}
                               method="PUT"
                               successMessage="Enlace modificado correctamente"
                               onSuccess={() => {
                                   fetchEnlacesFromApi();
                                   setIsVisibleEditableLink(false)
                               }}
                               onCancel={() => {
                                   setIsVisibleEditableLink(false);
                               }}
                               text={texto}
                               url={url}/>
    )
}