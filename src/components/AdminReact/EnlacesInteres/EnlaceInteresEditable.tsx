"use client";

import {useEffect, useState} from 'react';
import ExternalLink from "@/components/Icons/svg/ExternalLink.svg?react";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import Cross from "@/components/icons/svg/cross.svg?react";
import Check from "@/components/icons/svg/check.svg?react";
import {Input} from "@/components/ui/input.tsx";
import {showDangerToast, showOkToast} from "@/utils/Toast.ts";

interface NewLink {
    texto: string;
    url: string;
}

interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
    fetchUrl: string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    successMessage: string;
    failureMessage: string;
    text?: string
    url?: string

}

export function EnlaceInteresEditable({
                                          onSuccess,
                                          fetchUrl,
                                          method,
                                          failureMessage,
                                          successMessage,
                                          onCancel,
                                          text,
                                          url
                                      }: Props) {
    const [newLink, setNewLink] = useState<NewLink>({
        texto: text ?? '',
        url: url ?? ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(fetchUrl, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newLink),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || failureMessage);
            }
            showOkToast(successMessage);
            onSuccess?.()
        } catch (err) {
            showDangerToast(failureMessage);
        }
    }

    return (
        <form onSubmit={handleSubmit}
              className="animate-fade-in">
            <Card className="flex flex-row gap-4 !px-6 py-4 h-full place-items-center">
                <div className="p-4 bg-muted rounded-lg flex place-items-center flex-none h-fit">
                    <ExternalLink/>
                </div>
                <div className="flex flex-col place-content-center gap-1 grow min-w-0">
                    <Input type={"text"}
                           placeholder={"Nombre del enlace"}
                           size={48}
                           className="border-0 w-full"
                           onChange={(e) => setNewLink({
                               ...newLink,
                               texto: e.target.value,
                           })}
                           value={newLink.texto}/>
                    <Input type={"url"}
                           placeholder={"https://enlace.com"}
                           size={48}
                           className="border-0"
                           onChange={(e) => setNewLink({
                               ...newLink,
                               url: e.target.value,
                           })}
                           value={newLink.url}/>
                </div>
                <div className="flex gap-2 items-center">
                    <Button type="button"
                            variant={"secondary"}
                            size={"icon"}
                            onClick={onCancel}>
                        <Cross/>
                    </Button>
                    <Button type="submit" variant={"default"} size={"icon"}><Check/></Button>
                </div>
            </Card>
        </form>
    );
}