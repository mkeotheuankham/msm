import { useContext } from 'react';
import { MapProvider } from '../context/MapContext';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import MapView from '../components/map/MapView';
import '../styles/map.css';

const MapPage = () => {
  return (
    <MapProvider>
      <div className="app">
        <Header />
        <div className="main-content">
          <Sidebar />
          <MapView />
        </div>
      </div>
    </MapProvider>
  );
};

export default MapPage;