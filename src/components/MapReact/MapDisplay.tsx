import { useEffect, useRef, useState } from "react";
import MapController from "./MapController";
import { centerMap, createMap } from "../../utils/Map2";
import { showDangerToast } from "../../utils/Toast";
import { PERALTA } from "../../utils/MapUtils";
import InfoModal from "./InfoModal";

export interface OrigenDestinoProps {
  origen: google.maps.marker.AdvancedMarkerElement | null;
  destino: google.maps.marker.AdvancedMarkerElement | null;
}

const useMap = (mapRef: React.MutableRefObject<null>) => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    const loadMap = async () => {
      try {
        const m = await createMap(mapRef.current!);
        setMap(m);
        m.setCenter(PERALTA);
        m.setZoom(15);
      } catch (e: any) {
        console.error(`Error al cargar el mapa: ${e.error}`);
        showDangerToast("Ha ocurrido un error al cargar el mapa");
      }
    };

    loadMap();
  }, [mapRef]);

  return map;
};

export default function MapDisplay() {
  const mapRef = useRef(null);
  const map = useMap(mapRef);
  const [origenDestino, setOrigenDestino] = useState<OrigenDestinoProps>({
    origen: null,
    destino: null,
  });

  useEffect(() => {
    centerMap(map, origenDestino);
  }, [origenDestino]);

  return (
    <main className="h-[calc(100vh-80px)] w-full flex flex-col md:flex-row border-t-[1px] border-t-black/20 dark:border-t-white/20">
      <MapController
        setOrigenDestino={setOrigenDestino}
        map={map!}
        origenDestino={origenDestino}
      />
      <section
        id="map"
        ref={mapRef}
        className="w-full -order-1 md:order-none lg:flex-grow h-full bg-sky-900"
      >
      </section>
      <InfoModal />
    </main>
  );
}
