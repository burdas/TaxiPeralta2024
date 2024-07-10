import { useEffect, useRef, useState } from "react";
import type { OrigenDestinoProps } from "./MapDisplay";
import { calculateRoute, centerMap, createMarker } from "../../utils/Map2";
import AutocompleInput from "./AutocompleInput";
import { showDangerToast } from "../../utils/Toast";

interface MapControllerProps {
  origenDestino: OrigenDestinoProps;
  setOrigenDestino: React.Dispatch<React.SetStateAction<OrigenDestinoProps>>;
  map: google.maps.Map;
}

export interface CalculateRoutesProps {
  displayRoutes: google.maps.DirectionsRenderer[];
  displayInfoWindows: google.maps.InfoWindow[];
}

export default function MapController({
  origenDestino,
  setOrigenDestino,
  map,
}: MapControllerProps) {
  const [originPlace, setOriginPlace] =
    useState<google.maps.places.PlaceResult>();
  const [destinyPlace, setDestinyPlace] =
    useState<google.maps.places.PlaceResult>();
  const [disableButton, setDisableButton] = useState<Boolean>(true);
  const [btnLoading, setBtnLoading] = useState<Boolean>(false);
  const [calculateData, setCalculateData] = useState<
    CalculateRoutesProps
  >({
    displayRoutes: [],
    displayInfoWindows: []
  } as CalculateRoutesProps);

  useEffect(() => centerMap(map, origenDestino), []);

  useEffect(() => {
    if (!originPlace) return;
    if (calculateData.displayRoutes) calculateData.displayRoutes.map((e) => e.setMap(null));
    if (calculateData.displayInfoWindows) calculateData.displayInfoWindows.map((e) => e.close());
    createMarker("Origen", map, originPlace)
      .then((marker) => {
        const origenDestinoAux: OrigenDestinoProps = { ...origenDestino };
        if (origenDestinoAux.origen) origenDestinoAux.origen.map = null;
        origenDestinoAux.origen = marker;
        setOrigenDestino(origenDestinoAux);
      })
      .catch((e) => {
        console.error(`Error al crear el marcador: ${e}`);
        showDangerToast("Ha cocurrido un error al crear el marcador.");
      });
  }, [originPlace]);

  useEffect(() => {
    if (!destinyPlace) return;
    if (calculateData.displayRoutes) calculateData.displayRoutes.map((e) => e.setMap(null));
    if (calculateData.displayInfoWindows) calculateData.displayInfoWindows.map((e) => e.close());
    createMarker("Destino", map, destinyPlace)
      .then((marker) => {
        const origenDestinoAux: OrigenDestinoProps = { ...origenDestino };
        if (origenDestinoAux.destino) origenDestinoAux.destino.map = null;
        origenDestinoAux.destino = marker;
        setOrigenDestino(origenDestinoAux);
      })
      .catch((e) => {
        console.error(`Error al crear el marcador: ${e}`);
        showDangerToast("Ha cocurrido un error al crear el marcador.");
      });
  }, [destinyPlace]);

  useEffect(
    () => setDisableButton(!originPlace || !destinyPlace),
    [originPlace, destinyPlace]
  );

  return (
    <article
      id="mapControllerBox"
      className="flex-none w-80 h-full dark:bg-black border-r-black/20 dark:border-r-white/20 p-3"
    >
      <h4 className="text-xl font-semibold text-center dark:text-white">
        Calcula tu
        <span className="text-sky-500"> viaje</span>
      </h4>
      <div className="w-full space-y-4">
        <AutocompleInput
          title={"Origen"}
          placeHolder={"Peralta"}
          setPlace={setOriginPlace}
          map={map}
        />
        <AutocompleInput
          title={"Destino"}
          placeHolder={"Pamplona"}
          setPlace={setDestinyPlace}
          map={map}
        />
        <div className="flex flex-row justify-between">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Tarifa nocturna
            </span>
          </label>
          {disableButton ? (
            <button
              id="btnCalcular"
              title="Elige un origen y un destino."
              disabled
              className="rounded-md w-28 h-10 p-2 text-sm bg-gray-500/50 dark:text-white cursor-not-allowed"
            >
              <span id="textCalcular">Calcular</span>
            </button>
          ) : (
            <button
              id="btnCalcular"
              onClick={async () => {
                setBtnLoading(true);
                setCalculateData(
                  await calculateRoute(map, origenDestino, calculateData)
                );
                setBtnLoading(false);
              }}
              className="rounded-md w-28 h-10 p-2 text-sm bg-sky-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center"
            >
              {btnLoading ? (
                <svg
                  id="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  aria-hidden="true"
                  className="w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                >
                  <path
                    fill="#E5E7EB"
                    d="M100 50.5908c0 27.6143-22.3858 50.0002-50 50.0002S0 78.2051 0 50.5908C0 22.9766 22.3858.59082 50 .59082s50 22.38578 50 49.99998Zm-90.91856 0C9.08144 73.1895 27.4013 91.5094 50 91.5094s40.9186-18.3199 40.9186-40.9186C90.9186 27.9921 72.5987 9.67226 50 9.67226c-22.5987 0-40.91856 18.31984-40.91856 40.91854Z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M93.9676 39.0409c2.4254-.6371 3.8948-3.1293 3.0403-5.487-1.7147-4.7312-4.1369-9.1847-7.1912-13.2059-3.9715-5.2288-8.9341-9.6242-14.6043-12.93511-5.6702-3.31095-11.937-5.47264-18.4426-6.36165-5.0032-.683699-10.0722-.604397-15.0353.22749-2.4732.41455-3.9215 2.91905-3.2844 5.34453.6372 2.42548 3.1193 3.84844 5.6004 3.48384 3.8006-.55855 7.6686-.58021 11.4897-.058 5.324.7275 10.4526 2.4966 15.0929 5.2061 4.6404 2.7096 8.7016 6.3067 11.9518 10.5858 2.3326 3.0711 4.2148 6.4503 5.5962 10.0348.9019 2.34 3.361 3.8023 5.7865 3.1651Z"
                  ></path>
                </svg>
              ) : (
                <span id="textCalcular">Calcular</span>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
