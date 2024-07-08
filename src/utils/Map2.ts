import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";
import { HOME, PERALTA, ROUTES_COLORS } from "./MapUtils";

let loader: Loader;
let MapClass: typeof google.maps.Map;

async function initMapLibraries() {

  loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API as string,
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  MapClass = Map
}

// Create a new Loader instance y create a new Map instance y devuelve la instancia map
export async function createMap(
  htmlElement: HTMLElement,
  center = PERALTA,
  zoom = 15,
  mapId = document.documentElement.classList.contains("dark")
    ? "77c33a9af64c292c"
    : "c0ff71cee42d74ed"
): Promise<google.maps.Map> {
  await initMapLibraries();
  const map = new MapClass(htmlElement, {
    center,
    zoom,
    mapId,
    disableDefaultUI: true,
  });
  return map;
}

// Genera el autocompletado del input con las direcciones
export const getAutoComplete = async (el: HTMLInputElement) => {
  await initMapLibraries();
  return new google.maps.places.Autocomplete(el);
};
