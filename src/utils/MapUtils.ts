const HOME = { lat: 42.339044, lng: -1.806348 };
const PERALTA = { lat: 42.3389757, lng: -1.7990956999999526 };
const ROUTES_COLORS = [
  "#d883ff",
  "#ffe808",
  "#f77976",
  "#52e3e1",
  "#fabd4a",
  "#00FFFF",
];

export { HOME, PERALTA, ROUTES_COLORS }

// Transform a number to radian units
const numToRad = (n: number) => (n * Math.PI) / 180;

// Calcualte the distance between two points in km
function distanceLatLng(lat1: number, lon1:number, lat2:number, lon2:number) {
  const R = 6371; // km 
  const dLat = numToRad(lat2 - lat1);
  const dLon = numToRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(numToRad(lat1)) * Math.cos(numToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}