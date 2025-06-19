import { createContext, useState } from "react";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [activeLayer, setActiveLayer] = useState("standard");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [markers, setMarkers] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  return (
    <MapContext.Provider
      value={{
        activeLayer,
        setActiveLayer,
        mapCenter,
        setMapCenter,
        zoomLevel,
        setZoomLevel,
        markers,
        setMarkers,
        selectedEndpoint,
        setSelectedEndpoint,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
