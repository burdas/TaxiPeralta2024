"use client";

import { useEffect, useState } from "react";
import { getLogoDataUri } from "@/lib/facturacion/browser.ts";

export function useLogoDataUri(): string {
    const [logo, setLogo] = useState("");

    useEffect(() => {
        let activo = true;
        getLogoDataUri()
            .then((dataUri) => {
                if (activo && dataUri) setLogo(dataUri);
            })
            .catch(() => {});
        return () => {
            activo = false;
        };
    }, []);

    return logo;
}
