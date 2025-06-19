import { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapContext } from '../../context/MapContext';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const { activeLayer, mapCenter, zoomLevel, markers } = useContext(MapContext);
  
  const layers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    cycle: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
    transport: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
    humanitarian: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={layers[activeLayer]}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              <div>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;