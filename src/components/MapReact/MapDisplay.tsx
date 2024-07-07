import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";
import MapController from "./MapController";
import { PERALTA } from "../../utils/MapUtils";
import { showDangerToast } from "../../utils/Toast";

export default function MapDisplay() {
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        new Map(document.getElementById("map")!, {
          center: PERALTA,
          zoom: 15,
          mapId: document.documentElement.classList.contains('dark') ? '77c33a9af64c292c' : 'c0ff71cee42d74ed',
          disableDefaultUI: true,
        });
      })
      .catch((e) => {
        showDangerToast("Ha ocurrido un error al cargar el mapa");
        console.error(`Error: ${e.message}`);
      });
  }, []);

  return (
    <main className="h-[calc(100dvh-80px)] w-full flex flex-row border-t-[1px] border-t-black/20 dark:border-t-white/20">
      <MapController />
      <article id="map" className="flex-grow h-full bg-sky-900"></article>
    </main>
  );
}
