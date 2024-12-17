import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix default marker icon issues (leaflet default icon paths)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A small helper component to recenter the map when coordinates change
function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: false });
  return null;
}

function App() {
  // Default coordinates for demonstration
  const [coord1, setCoord1] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC
  const [coord2, setCoord2] = useState({ lat: 34.0522, lng: -118.2437 }); // LA
  
  const handleCoord1Change = (e) => {
    const { name, value } = e.target;
    setCoord1((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleCoord2Change = (e) => {
    const { name, value } = e.target;
    setCoord2((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const isValidCoord = (coord) => {
    return !isNaN(coord.lat) && !isNaN(coord.lng);
  };

  const bothValid = isValidCoord(coord1) && isValidCoord(coord2);

  // Center on the midpoint if both are valid:
  const center = bothValid
    ? [
        (coord1.lat + coord2.lat) / 2,
        (coord1.lng + coord2.lng) / 2
      ]
    : [40.7128, -74.0060]; // fallback to NYC

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px' }}>
        <h2>Line Between Two Coordinates</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div>
            <h4>Coordinate 1</h4>
            <input
              type="number"
              placeholder="Lat"
              name="lat"
              value={coord1.lat}
              onChange={handleCoord1Change}
              style={{ marginRight: '5px' }}
            />
            <input
              type="number"
              placeholder="Lng"
              name="lng"
              value={coord1.lng}
              onChange={handleCoord1Change}
            />
          </div>
          <div>
            <h4>Coordinate 2</h4>
            <input
              type="number"
              placeholder="Lat"
              name="lat"
              value={coord2.lat}
              onChange={handleCoord2Change}
              style={{ marginRight: '5px' }}
            />
            <input
              type="number"
              placeholder="Lng"
              name="lng"
              value={coord2.lng}
              onChange={handleCoord2Change}
            />
          </div>
        </div>
        <p>Enter two sets of coordinates above to draw a line between them on the map.</p>
      </div>
      
      <div style={{ flex: '1', border: '1px solid #ccc' }}>
        <MapContainer center={center} zoom={4} style={{ width: '100%', height: '100%' }}>
          <RecenterMap center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {isValidCoord(coord1) && <Marker position={[coord1.lat, coord1.lng]} />}
          {isValidCoord(coord2) && <Marker position={[coord2.lat, coord2.lng]} />}
          {bothValid && (
            <Polyline positions={[[coord1.lat, coord1.lng], [coord2.lat, coord2.lng]]} color="blue" />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;