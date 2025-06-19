import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from '../components/ui/Header';
import FeatureEditor from '../components/editor/FeatureEditor';
import './MapPage.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const MapPage = () => {
  const [activeLayer] = useState('standard');
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const layers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    cycle: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    humanitarian: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  };

  const handleMapClick = (e) => {
    const newMarker = {
      position: [e.latlng.lat, e.latlng.lng],
      name: `Marker ${markers.length + 1}`,
      type: 'point'
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
  };

  return (
    <div className="map-page">
      <Header />
      <div className="map-container">
        <MapContainer 
          center={[51.505, -0.09]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url={layers[activeLayer]}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position}>
              <Popup>
                <div>
                  <h3>{marker.name}</h3>
                  <p>Type: {marker.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <FeatureEditor 
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setMarkers={setMarkers}
          markers={markers}
        />
      </div>
    </div>
  );
};

export default MapPage;