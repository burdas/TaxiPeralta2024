import { numToEur, secToTimeFormat } from "../../utils/Format";
import { ROUTES_COLORS } from "../../utils/MapUtils";

interface RouteInfoBox {
  routeIndex: number;
  routePrice: number;
  routeDistance: number;
  routeDuration: number;
}

const delayIndex = ["delay-0", "delay-200", "delay-300", "delay700", "delay-1000"];

export default function RouteInfo({
  routeIndex,
  routePrice,
  routeDistance,
  routeDuration,
}: RouteInfoBox) {
  return (
    <article
      className={`rounded-lg p-3 flex flex-row justify-between items-center animate-modalf transition-transform duration-500 ease-in-out ${delayIndex[routeIndex]}`}
      style={{ backgroundColor: ROUTES_COLORS[routeIndex] }}
    >
      <div className="flex flex-col">
        <span className="text-2xl font-semibold text-white mb-3">
          {numToEur(routePrice)}
        </span>
        <span className="text-white text-sm font-medium">
          {routeDistance.toFixed(0)} km
        </span>
        <span className="text-white text-sm font-medium">
          {secToTimeFormat(routeDuration)}
        </span>
      </div>
      <span className="text-white text-5xl font-semibold">{routeIndex+1}</span>
    </article>
  );
}
