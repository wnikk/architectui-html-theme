// Страница карт: Leaflet и тайлы OpenStreetMap. Ключ API не нужен.
// Для продакшена используйте свой тайл-сервер или провайдера: публичные тайлы OSM — только для небольшой нагрузки.
import * as L from "leaflet";

const TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CITIES = [
  { name: "London", coords: [51.5074, -0.1278] },
  { name: "Berlin", coords: [52.52, 13.405] },
  { name: "Madrid", coords: [40.4168, -3.7038] },
  { name: "Amsterdam", coords: [52.3676, 4.9041] },
  { name: "Paris", coords: [48.8566, 2.3522] },
  { name: "Rome", coords: [41.9028, 12.4964] },
];

// Маркер без картинок: точка в цвет темы
const marker = (coords) => L.circleMarker(coords, {
  radius: 8,
  color: "#fff",
  weight: 2,
  fillColor: getComputedStyle(document.documentElement).getPropertyValue("--bs-primary").trim(),
  fillOpacity: 1,
});

function createMap(id, center, zoom) {
  const element = document.getElementById(id);
  if (!element) {
    return null;
  }
  const map = L.map(element, { scrollWheelZoom: false }).setView(center, zoom);
  L.tileLayer(TILES, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(map);
  return map;
}

createMap("map-world", [30, 10], 1);

const markersMap = createMap("map-markers", [48.5, 6], 4);
if (markersMap) {
  const group = L.featureGroup(CITIES.map((city) => marker(city.coords).bindTooltip(city.name))).addTo(markersMap);
  markersMap.fitBounds(group.getBounds(), { padding: [30, 30] });
}

const interactiveMap = createMap("map-interactive", [51.5074, -0.1278], 12);
if (interactiveMap) {
  L.control.scale().addTo(interactiveMap);
  marker([51.5074, -0.1278]).addTo(interactiveMap).bindPopup("<b>London</b><br>Click the map to add markers.").openPopup();
  interactiveMap.on("click", (event) => {
    const { lat, lng } = event.latlng;
    marker(event.latlng).addTo(interactiveMap).bindPopup(`${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
  });
}
