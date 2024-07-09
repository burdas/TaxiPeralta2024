import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";
import { HOME, PERALTA, ROUTES_COLORS } from "./MapUtils";
import type { OrigenDestinoProps } from "../components/MapReact/MapDisplay";

let loader: Loader;
let MapClass: typeof google.maps.Map;

async function initMapLibraries() {
  loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API as string,
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  MapClass = Map;
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

// Obtiene la dirección de un objeto Places de google maps
function getAddress(place: google.maps.places.PlaceResult): string {
  let address = "";
  if (place.address_components) {
    address = [
      (place.address_components[0] && place.address_components[0].short_name) ||
        "",
      (place.address_components[1] && place.address_components[1].short_name) ||
        "",
      (place.address_components[2] && place.address_components[2].short_name) ||
        "",
    ].join(" ");
  }
  return address;
}

// Genera un marcador en el mapa con su ventana de detalles
export function createMarker(
  title: "Origen" | "Destino",
  map: google.maps.Map,
  place: google.maps.places.PlaceResult
): Promise<google.maps.marker.AdvancedMarkerElement> {
  return loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
    const marker = new AdvancedMarkerElement({
      map,
      position: place.geometry?.location,
      title: title,
    });

    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(
      "<div><strong>" + place.name + "</strong><br>" + getAddress(place)
    );
    infoWindow.setHeaderDisabled(true);
    infoWindow.open(map, marker);
    return marker;
  });
}

// Centra el mapa dependiendo de si es un único marcador o son dos
export function centerMap(map: google.maps.Map | undefined, origenDestino: OrigenDestinoProps) {
  if (!map) return;
  if (origenDestino.origen && !origenDestino.destino){
    map.setCenter(origenDestino.origen.position!);
    map.setZoom(15);
  } else if (!origenDestino.origen && origenDestino.destino){
    map.setCenter(origenDestino.destino.position!);
    map.setZoom(15);
  } else if (origenDestino.origen && origenDestino.destino){
    let bounds = new google.maps.LatLngBounds();
    bounds = bounds.extend(origenDestino.origen?.position!);
    bounds = bounds.extend(origenDestino.destino.position!);

    // Añadir un margen extra para la infoWindow
    const margin = 0.05; // Ajusta este valor según sea necesario
    bounds.extend({
      lat: bounds.getNorthEast().lat() + margin,
      lng: bounds.getNorthEast().lng() + margin,
    });
    bounds.extend({
      lat: bounds.getSouthWest().lat() - margin,
      lng: bounds.getSouthWest().lng() - margin,
    });


    map.fitBounds(bounds);
  }
}
