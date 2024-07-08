import { useEffect, useRef, useState } from "react";
import MapController from "./MapController";
import { createMap } from "../../utils/Map2";
import { showDangerToast } from "../../utils/Toast";

interface LugarProps {
  autocomplete: google.maps.places.Autocomplete | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

export interface OrigenDestinoProps {
  origen: LugarProps;
  destino: LugarProps;
}

export default function MapDisplay() {
  const mapRef = useRef(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [origenDestino, setOrigenDestino] = useState<OrigenDestinoProps>({
    origen: {
      autocomplete: null,
      marker: null,
    },
    destino: {
      autocomplete: null,
      marker: null,
    },
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

  useEffect(() => {
    if (origenDestino.origen.autocomplete) {
      console.log(origenDestino);
      const origenDestinoAux: OrigenDestinoProps = { ...origenDestino };
      origenDestino.origen!.autocomplete!.bindTo("bounds", map!);
      origenDestino.origen!.autocomplete!.bindTo("bounds", map!);
    }
  }, [origenDestino]);

  return (
    <main className="h-[calc(100dvh-80px)] w-full flex flex-row border-t-[1px] border-t-black/20 dark:border-t-white/20">
      <MapController setOrigenDestino={setOrigenDestino} />
      <article
        id="map"
        ref={mapRef}
        className="flex-grow h-full bg-sky-900"
      ></article>
    </main>
  );
}
