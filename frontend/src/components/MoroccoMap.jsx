import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/morocco/morocco-provinces.json";

// Cities (lon, lat)
const cities = {
  Casablanca: [-7.5898, 33.5731],
  Rabat: [-6.8498, 34.0209],
  Marrakech: [-7.9811, 31.6295],
  Tangier: [-5.8339, 35.7595],
  Agadir: [-9.5981, 30.4278],
};

export default function MoroccoMap() {
  return (
    <div className="w-full h-[400px]">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2000, center: [-7, 32] }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#E5E7EB", outline: "none" },
                  hover: { fill: "#3B82F6", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Markers (cities) */}
        {Object.entries(cities).map(([name, coords]) => (
          <Marker key={name} coordinates={coords}>
            <circle r={4} fill="#2563EB" />
          </Marker>
        ))}

        {/* Lines between cities */}
        <Line from={cities.Casablanca} to={cities.Rabat} stroke="#2563EB" strokeWidth={2} />
        <Line from={cities.Rabat} to={cities.Tangier} stroke="#2563EB" strokeWidth={2} />
        <Line from={cities.Casablanca} to={cities.Marrakech} stroke="#2563EB" strokeWidth={2} />
        <Line from={cities.Marrakech} to={cities.Agadir} stroke="#2563EB" strokeWidth={2} />
      </ComposableMap>
    </div>
  );
}