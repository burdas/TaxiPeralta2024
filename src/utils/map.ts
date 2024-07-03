import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";

let map: google.maps.Map;
let loader: Loader;
let bounds: google.maps.LatLngBounds;
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
  zoom = 15,
  mapId = 'MAP_ID'
): Promise<google.maps.Map> {
  loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API as string,
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  map = new Map(document.getElementById(elementId) as HTMLElement, {
    center,
    zoom,
    mapId
  });
  return map
}

export const getAutoComplete = (el: string) =>
  new google.maps.places.Autocomplete(
    document.getElementById(el) as HTMLInputElement
  );

export async function showOriginPoint(
  this: google.maps.places.Autocomplete
) {
  const place = this.getPlace();
  if (!place.geometry) {
    showDangerToast(
      `No se ha podido encontrar "${place.name}". Selecciona un lugar de la lista.`
    );
    return;
  }
  bounds = new google.maps.LatLngBounds();
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location!);
    map.setZoom(15);
  }

  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const marker = new AdvancedMarkerElement({
    map,
    position: place.geometry.location,
    title: "Origen",
  });
  bounds.extend(marker.position!);
}

export async function showDestinyPoint(
  this: google.maps.places.Autocomplete
) {
  const place = this.getPlace();
  if (!place.geometry) {
    showDangerToast(
      `No se ha podido encontrar "${place.name}". Selecciona un lugar de la lista.`
    );
    return;
  }
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location!);
    map.setZoom(15);
  }

  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const marker = new AdvancedMarkerElement({
    map,
    position: place.geometry.location,
    title: "Origen",
  });
  bounds.extend(marker.position!);
  map.fitBounds(bounds);
}
