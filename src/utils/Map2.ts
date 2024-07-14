import { Loader } from "@googlemaps/js-api-loader";
import { HOME, PERALTA, ROUTES_COLORS } from "./MapUtils";
import type { OrigenDestinoProps } from "../components/MapReact/MapDisplay";
import { resetCalculateData, type CalculateRoutesProps } from "../components/MapReact/MapController";
import { tarifa } from "../model/tarifas";
import { numToEur, secToTimeFormat } from "./Format";

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
export async function  createMarker(
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
      "<div><strong>" +
        place.name +
        "</strong><br>" +
        getAddress(place) +
        "</div>"
    );
    infoWindow.setHeaderDisabled(true);
    infoWindow.open(map, marker);
    return marker;
  });
}

// Centra el mapa dependiendo de si es un único marcador o son dos
export function centerMap(
  map: google.maps.Map | undefined,
  origenDestino: OrigenDestinoProps
) {
  if (!map) return;
  if (!origenDestino.origen && !origenDestino.destino) {
    map.setCenter(PERALTA);
    map.setZoom(15);
  } else if (origenDestino.origen && !origenDestino.destino) {
    map.setCenter(origenDestino.origen.position!);
    map.setZoom(15);
  } else if (!origenDestino.origen && origenDestino.destino) {
    map.setCenter(origenDestino.destino.position!);
    map.setZoom(15);
  } else if (origenDestino.origen && origenDestino.destino) {
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

export async function calculateRoute(
  map: google.maps.Map,
  origenDestino: OrigenDestinoProps,
  calculateData: CalculateRoutesProps
): Promise<CalculateRoutesProps> {
  let calculateDataAux: CalculateRoutesProps = {... calculateData}
  // Reset routes display
  calculateDataAux = resetCalculateData(calculateDataAux);

  const directionsService = new google.maps.DirectionsService();

  // Distancia total HOME -> ORIGEN -> DESTINO -> HOME
  const kmHomeOrigen =
    (
      await directionsService.route({
        origin: HOME,
        destination: origenDestino.origen?.position!,
        travelMode: google.maps.TravelMode.DRIVING,
      })
    ).routes[0].legs[0].distance?.value! / 1000;

  const kmHomeDestino =
    (
      await directionsService.route({
        origin: origenDestino.destino?.position!,
        destination: HOME,
        travelMode: google.maps.TravelMode.DRIVING,
      })
    ).routes[0].legs[0].distance?.value! / 1000;

  const direcciones = await directionsService.route({
    origin: origenDestino.origen?.position!,
    destination: origenDestino.destino?.position!,
    avoidHighways: false,
    avoidTolls: false,
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.DRIVING,
  });
  direcciones.routes.forEach((route, i) => {
    const dr = new google.maps.DirectionsRenderer({
      map: map,
      directions: direcciones,
      routeIndex: i,
      preserveViewport: true,
      suppressMarkers: true,
      suppressInfoWindows: false,
      polylineOptions: new google.maps.Polyline({
        strokeColor: ROUTES_COLORS[i],
        strokeWeight: 6,
      }) as google.maps.PolylineOptions,
    });
    calculateDataAux.displayRoutes.push(dr);

    const kmOrigenDesitno = route.legs[0].distance?.value! / 1000;
    const kmTotales = kmHomeOrigen + kmOrigenDesitno + kmHomeDestino;
    const duration = route.legs[0].duration?.value;
    const price = (calculateData.tariffType ? tarifa.nocturna.kmRecorrido : tarifa.diurna.kmRecorrido) * kmTotales

    calculateDataAux.routesPrices[i] = price;
    calculateDataAux.routesDurations[i] = duration ?? 0;
    calculateDataAux.routesDistances[i] = kmOrigenDesitno;

    // console.log(`Distancia casa - origen: ${kmHomeOrigen}`);
    // console.log(`Distancia origen - destino: ${kmOrigenDesitno}`);
    // console.log(`Distancia destino - casa: ${kmHomeDestino}`);
    // console.log(`Distancia total: ${kmTotales}`);
    // console.log(`Tarifa nocturna: ${calculateData.tariffType}`);
    // console.log(`Precio tarifa: ${calculateData.tariffType ? tarifa.nocturna.kmRecorrido : tarifa.diurna.kmRecorrido}`);
    // console.log(`Precio total: ${price}`);

    const infoWindow = new google.maps.InfoWindow();
      const content = `<div><strong class=\"text-xl font-semibold\" style=\"color: ${ROUTES_COLORS[i]}\">${numToEur(price)}</strong><br>${kmOrigenDesitno.toFixed(0)} km<br>${secToTimeFormat(duration ?? 0)}</div>`;
      infoWindow.setContent(content);
      infoWindow.setHeaderDisabled(true);
      infoWindow.setPosition(getFirstNoOverlapingPosition(route, direcciones.routes.filter(d => d !== route)));
      infoWindow.open(map);
    calculateDataAux.displayInfoWindows.push(infoWindow);
  });
  return calculateDataAux;
}

// Obtiene la posicion del medio del segmento de la ruta que no se superpone con el resto de las rutas
function getFirstNoOverlapingPosition(
  currentRoute: google.maps.DirectionsRoute,
  restRoutes: google.maps.DirectionsRoute[]
): google.maps.LatLng {
  const TRESHOLD = 2; // Establecemos el umbral de distancia (km) para que se considere que dos posiciones no se superponen

  let posiblePositions: google.maps.LatLng[] = currentRoute.legs[0].steps.map(e => e.path).flat();
  let evaluatedPositions: google.maps.LatLng[] = restRoutes.map(r => r.legs[0].steps.map(e => e.path).flat()).flat();

  // Reducimos el tamaño de los arrays
  const ARRAY_SIZE = 1000;
  if (posiblePositions.length > ARRAY_SIZE) {
    const posiblePositionsStep = Math.floor(posiblePositions.length / ARRAY_SIZE);
    posiblePositions = posiblePositions.filter((_, i) => i % posiblePositionsStep === 0);
  }
  if (evaluatedPositions.length > ARRAY_SIZE) {
    const evaluatedPositionsStep = Math.floor(evaluatedPositions.length / ARRAY_SIZE);
    evaluatedPositions = evaluatedPositions.filter((_, i) => i % evaluatedPositionsStep === 0);
  }

  // Posición por defecto en caso de que no encontremos una posición libre
  const DEFAULT_POSITION = posiblePositions[Math.floor(posiblePositions.length/2)];
  const filteredPositions = posiblePositions.filter(pp => evaluatedPositions.every(ep => positionDistance(pp, ep) > TRESHOLD));
  return filteredPositions.length > 0 ? filteredPositions[Math.floor(filteredPositions.length/2)] : DEFAULT_POSITION
}

// Calcula la distancia entre dos posiciones en kilómetros
function positionDistance(a: google.maps.LatLng, b: google.maps.LatLng): number {
  const toRadians = (n: number): number => (n * Math.PI) / 180;

  const R = 6371; //Km
  const diffLat = toRadians(b.lat() - a.lat());
  const diffLng = toRadians(b.lng() - a.lng());
  const aux =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.cos(toRadians(a.lat())) *
      Math.cos(toRadians(b.lat())) *
      Math.sin(diffLng / 2) *
      Math.sin(diffLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(aux), Math.sqrt(1 - aux));
}
