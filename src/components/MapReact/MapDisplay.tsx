import { useEffect, useRef, useState } from "react";
import MapController from "./MapController";
import { createMap } from "../../utils/Map2";
import { showDangerToast } from "../../utils/Toast";

export interface OrigenDestinoProps {
  origen: google.maps.marker.AdvancedMarkerElement | null;
  destino: google.maps.marker.AdvancedMarkerElement | null;
}

export default function MapDisplay() {
  const mapRef = useRef(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [origenDestino, setOrigenDestino] = useState<OrigenDestinoProps>({
    origen: null,
    destino: null,
  });

  useEffect(() => {
    createMap(mapRef.current!)
      .then((m) => {
        setMap(m);
      })
      .catch((e) => {
        console.error(`Error al cargar el mapa: ${e.error}`);
        showDangerToast("Ha ocurrido un error al cargar el mapa");
      });
  }, []);

  return (
    <main className="h-[calc(100dvh-80px)] w-full flex flex-row border-t-[1px] border-t-black/20 dark:border-t-white/20">
      <MapController setOrigenDestino={setOrigenDestino} map={map!} origenDestino={origenDestino} />
      <article
        id="map"
        ref={mapRef}
        className="flex-grow h-full bg-sky-900"
      ></article>
    </main>
  );
}
