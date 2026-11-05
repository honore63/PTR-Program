import { useEffect, useRef } from "react";
import { ExternalLink, LocateFixed } from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { ModelSchool } from "@/data/ptrp";
import "leaflet/dist/leaflet.css";

type ModelSchoolsMapProps = {
  schools: ModelSchool[];
  selectedSchool?: ModelSchool;
  onSelectSchool: (schoolId: number) => void;
};

function directionsUrl(school: ModelSchool) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.mapQuery)}`;
}

function createSchoolIcon(school: ModelSchool, selected: boolean) {
  return L.divIcon({
    className: `model-school-map-marker${selected ? " model-school-map-pin-selected" : ""}${school.locationIsApproximate ? " model-school-map-pin-approximate" : ""}`,
    html: `<span class="model-school-map-pin-inner"><b>${school.id}</b></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function MapViewport({ school, schools }: { school?: ModelSchool; schools: ModelSchool[] }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (schools.length) map.fitBounds(L.latLngBounds(schools.map((item) => item.position)), { padding: [32, 32] });
      return;
    }
    if (!schools.length) return;
    const nextSchool = school && schools.some((item) => item.id === school.id) ? school : schools[0];
    map.flyTo(nextSchool.position, 11, { duration: 0.6 });
  }, [map, school?.id, schools]);

  if (schools.length <= 1) return null;

  return (
    <button
      type="button"
      onClick={() => {
        map.fitBounds(L.latLngBounds(schools.map((item) => item.position)), { padding: [32, 32] });
      }}
      className="model-school-map-overview"
      aria-label="Show all model schools"
      title="Show all model schools"
    >
      <LocateFixed className="size-4" />
      <span>All schools</span>
    </button>
  );
}

export function ModelSchoolsMap({ schools, selectedSchool, onSelectSchool }: ModelSchoolsMapProps) {
  return (
    <div className="model-schools-map-shell" role="region" aria-label="Interactive map of PTRP model schools in Rwanda">
      {schools.length === 0 && <div className="model-schools-map-empty" role="status">No schools match the current filters.</div>}
      <MapContainer
        center={[-1.94, 29.87]}
        zoom={7.5}
        minZoom={6}
        maxZoom={18}
        scrollWheelZoom
        className="model-schools-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport school={selectedSchool} schools={schools} />
        {schools.map((school) => (
          <Marker
            key={school.id}
            position={school.position}
            icon={createSchoolIcon(school, school.id === selectedSchool?.id)}
            eventHandlers={{ click: () => onSelectSchool(school.id) }}
            title={`${school.name}, ${school.district}`}
          >
            <Popup>
              <div className="model-school-map-popup">
                <p className="model-school-map-popup-number">Model school {String(school.id).padStart(2, "0")}</p>
                <h3>{school.name}</h3>
                <p><strong>District:</strong> {school.district}</p>
                <p><strong>Sector / address:</strong> {school.address}</p>
                {school.locationIsApproximate && (
                  <p className="model-school-map-popup-note">Google Maps did not identify an exact school pin; this marker is an area-level reference.</p>
                )}
                <a href={directionsUrl(school)} target="_blank" rel="noreferrer">
                  Google Maps directions <ExternalLink className="size-3.5" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
