import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";

let map: google.maps.Map;
let loader: Loader;
let bounds: google.maps.LatLngBounds;
interface MyPosition {
  position: google.maps.LatLng | undefined | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}
interface OrigenDestino {
  origen: MyPosition;
  destino: MyPosition;
}
const origenDestino: OrigenDestino = {
  origen: {
    position: null,
    marker: null
  },
  destino: {
    position: null,
    marker: null
  },
};
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

async function createMarker(
  position: google.maps.LatLng,
  title: string
): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const marker = new AdvancedMarkerElement({
    map,
    position: position,
    title: title,
  });
  return marker;
}

function centerMap() {
  if (!origenDestino.destino.position) {
    map.setCenter(origenDestino.origen?.position!);
    map.setZoom(15);
  } else {
    bounds = new google.maps.LatLngBounds();
    bounds = bounds.extend(origenDestino.origen?.position!);
    bounds = bounds.extend(origenDestino.destino.position!);
    map.fitBounds(bounds);
  }
}

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

  if (origenDestino.origen.marker) {origenDestino.origen.marker.map = null;}
  origenDestino.origen.position = place.geometry.location;
  createMarker(place.geometry.location!, "Origen").then(
    (marker) => {
      // console.log(origenDestino.origen);
      // origenDestino.origen!.marker!.remove()
      origenDestino.origen.marker = marker
    }
  ).catch(err => console.log(err));
  centerMap();
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
  if (origenDestino.destino.marker) {origenDestino.destino.marker.map = null;}
  origenDestino.destino.position = place.geometry.location
  createMarker(place.geometry.location!, "Destino").then(
    (marker) => {
      origenDestino.destino!.marker = marker
    }
  );
  centerMap();
}
