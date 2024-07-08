import { Loader } from "@googlemaps/js-api-loader";
import { showDangerToast } from "./Toast";
import { HOME, PERALTA, ROUTES_COLORS} from "./MapUtils";

let map: google.maps.Map;
let loader: Loader;
let bounds: google.maps.LatLngBounds;
interface OrigenDestino {
  origen: google.maps.marker.AdvancedMarkerElement | null;
  destino: google.maps.marker.AdvancedMarkerElement | null;
}
const origenDestino: OrigenDestino = {
  origen: null,
  destino: null,
};
let displayRoutes: google.maps.DirectionsRenderer[] = [];

// Create a new Loader instance y create a new Map instance y devuelve la instancia map
export async function createMap(
  elementId: string,
  center = PERALTA,
  zoom = 15,
  mapId = document.documentElement.classList.contains('dark') ? '77c33a9af64c292c' : 'c0ff71cee42d74ed'
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
    mapId,
    disableDefaultUI: true
  });
  return map;
}

// Genera el autocompletado del input con las direcciones
export const getAutoComplete = (el: string) =>
  new google.maps.places.Autocomplete(
    document.getElementById(el) as HTMLInputElement
  );

// Genera un marcador en el mapa con su ventana de detalles
async function createMarker(
  position: google.maps.LatLng,
  title: "Origen" | "Destino",
  placeName: string | undefined,
  address: string
): Promise<google.maps.marker.AdvancedMarkerElement> {
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const marker = new AdvancedMarkerElement({
    map,
    position: position,
    title: title,
  });

  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(
    "<div><strong>" + placeName + "</strong><br>" + address
  );
  infoWindow.setHeaderDisabled(true);
  infoWindow.open(map, marker);

  if (title === "Origen") {
    if (origenDestino.origen) {
      origenDestino.origen.map = null;
    }
    origenDestino.origen = marker;
  } else {
    if (origenDestino.destino) {
      origenDestino.destino.map = null;
    }
    origenDestino.destino = marker;
  }
  centerMap();
  return marker;
}

// Centra el mapa dependiendo de si es un único marcador o son dos
function centerMap() {
  if (!origenDestino.destino?.position) {
    map.setCenter(origenDestino.origen?.position!);
    map.setZoom(15);
  } else if (!origenDestino.origen?.position) {
    map.setCenter(origenDestino.destino?.position!);
    map.setZoom(15);
  } else {
    bounds = new google.maps.LatLngBounds();
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

export async function showOriginPoint(this: google.maps.places.Autocomplete) {
  const place = this.getPlace();
  if (!place.geometry) {
    showDangerToast(
      `No se ha podido encontrar "${place.name}". Selecciona un lugar de la lista.`
    );
    return;
  }
  createMarker(
    place.geometry.location!,
    "Origen",
    place.name,
    getAddress(place)
  );
}

// maneja el autocompletado del input origen
export async function showDestinyPoint(this: google.maps.places.Autocomplete) {
  const place = this.getPlace();
  if (!place.geometry) {
    showDangerToast(
      `No se ha podido encontrar "${place.name}". Selecciona un lugar de la lista.`
    );
    return;
  }
  createMarker(
    place.geometry.location!,
    "Destino",
    place.name,
    getAddress(place)
  );
}

// Maneja el autocompletado del input destino
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

export async function calculateRoute(e: Event) {
  // Reset routes display
  displayRoutes.map(e => e.setMap(null));
  displayRoutes = []

  e.preventDefault();
  if (!origenDestino.origen?.position || !origenDestino.destino?.position) {
    showDangerToast("Selecciona un punto de origen y un punto de destino");
    return;
  }
  // Spinner animation
  document.getElementById("textCalcular")?.classList.toggle("hidden");
  document.getElementById("spinner")?.classList.toggle("hidden");

  const directionsService = new google.maps.DirectionsService();

  // Distancia total HOME -> ORIGEN -> DESTINO -> HOME
  const kmHomeOrigen =
    (
      await directionsService.route({
        origin: HOME,
        destination: origenDestino.origen?.position,
        travelMode: google.maps.TravelMode.DRIVING,
      })
    ).routes[0].legs[0].distance?.value! / 1000;

  const kmHomeDestino =
    (
      await directionsService.route({
        origin: origenDestino.destino?.position,
        destination: HOME,
        travelMode: google.maps.TravelMode.DRIVING,
      })
    ).routes[0].legs[0].distance?.value! / 1000;

  const direcciones = await directionsService.route({
    origin: origenDestino.origen?.position,
    destination: origenDestino.destino?.position,
    avoidHighways: false,
    avoidTolls: false,
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.DRIVING,
  });
  direcciones.routes.forEach((route, i) => {
    displayRoutes.push(new google.maps.DirectionsRenderer({
      map: map,
      directions: direcciones,
      routeIndex: i,
      preserveViewport: true,
      suppressMarkers: true,
      polylineOptions: new google.maps.Polyline({
        strokeColor: ROUTES_COLORS[i],
        strokeWeight: 6,
      }) as google.maps.PolylineOptions
    }));
  });

  console.log(displayRoutes[0]!.getDirections()!.routes.map(r => r.legs[0].steps.length));
  // Quitar el spinner de carga
  document.getElementById("spinner")?.classList.toggle("hidden");
  document.getElementById("textCalcular")?.classList.toggle("hidden");
}

function showRoutesInfoWindows() {
  const routes = displayRoutes[0]!.getDirections()!.routes;
  routes.forEach(r => {

  })
}
