"use client";

import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MapPinned } from "lucide-react";
import { createMap } from "@/utils/Map2";
import { showDangerToast } from "@/utils/Toast";
import type { Registro } from "@/model/calculatorInfo.ts";

interface RegistroDetalleDialogProps {
    registro: Registro;
}

export default function RegistroDetalleDialog({ registro }: RegistroDetalleDialogProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const initMap = async () => {
        if (!mapRef.current) return;
        try {
            const m = await createMap(mapRef.current);

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                map: m,
                suppressMarkers: true,
            });

            const origin = { lat: registro.origen_lat, lng: registro.origen_lon };
            const destination = { lat: registro.destino_lat, lng: registro.destino_lon };

            const result = await directionsService.route({
                origin,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
            });

            directionsRenderer.setDirections(result);

            // Add custom markers
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
            
            const createCustomMarker = (position: google.maps.LatLngLiteral, address: string) => {
                const marker = new AdvancedMarkerElement({
                    map: m,
                    position,
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="text-zinc-800 font-sans p-1">${address}</div>`,
                    headerDisabled: true,
                });

                infoWindow.open(m, marker);
                return marker;
            };

            createCustomMarker(origin, registro.origen);
            createCustomMarker(destination, registro.destino);

            // Ensure the map fits the route bounds and then zoom out one level for better visibility
            if (result.routes && result.routes[0]) {
                m.fitBounds(result.routes[0].bounds);
                const listener = m.addListener("idle", () => {
                    const currentZoom = m.getZoom();
                    if (currentZoom) m.setZoom(currentZoom - 1);
                    google.maps.event.removeListener(listener);
                });
            }

        } catch (error) {
            console.error("Error al inicializar el mapa:", error);
            showDangerToast("Error al cargar el mapa");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) {
                // Give some time for the dialog to animate and the ref to be available
                // This is a common pattern for dialogs that need to initialize third-party libraries
                // like Google Maps once the DOM element is fully rendered.
                setTimeout(initMap, 300);
            }
        }}>
            <DialogTrigger asChild>
                <Button size="icon" title="Ver detalle en mapa">
                    <MapPinned className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Detalle del viaje</DialogTitle>
                </DialogHeader>
                <div 
                    ref={mapRef} 
                    className="flex-grow w-full rounded-md border bg-muted min-h-[300px] mt-2"
                />
            </DialogContent>
        </Dialog>
    );
}
