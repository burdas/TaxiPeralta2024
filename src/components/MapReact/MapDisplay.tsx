import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { PERALTA } from "../../utils/MapUtils";
import { useEffect } from "react";
import MapController from "./MapController";

export default function MapDisplay() {

  return (
    <main className="h-[calc(100dvh-80px)] w-full flex flex-row border-t-[1px] border-t-black/20 dark:border-t-white/20">
      <MapController />
      <APIProvider apiKey={import.meta.env.PUBLIC_GOOGLE_MAPS_API}>
        <Map
          className="flex-grow h-full bg-sky-900"
          defaultCenter={PERALTA}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          id="map"
          mapId={
            document.documentElement.classList.contains("dark")
              ? "77c33a9af64c292c"
              : "c0ff71cee42d74ed"
          }
        />
      </APIProvider>
    </main>
  );
}
