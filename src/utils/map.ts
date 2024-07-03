import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";

const HOME = { lat: 42.339044, lng: -1.806348 };
const PERALTA = { lat: 42.3389757, lng: -1.7990956999999526 };
const ROUTES_COLORS = [
  "#fe0c0c",
  "#2534d7",
  "#17a416",
  "#f5db0a",
  "#750f68",
  "#00FFFF",
];

export async function createMap(
  elementId: string,
  center = PERALTA,
  zoom = 15
): Promise<google.maps.Map> {
  const loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API as string,
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  return new Map(document.getElementById(elementId) as HTMLElement, {
    center,
    zoom,
  });
}

export const getAutoComplete = (el: string) =>
  new google.maps.places.Autocomplete(
    document.getElementById(el) as HTMLInputElement
  );

export function showMarkPoint(map: google.maps.Map) {
  showDangerToast("No se ha podido encontrar la ubicación.");
}
