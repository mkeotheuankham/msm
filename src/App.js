import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import "./styles/global.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

function App() {
  return (
    <div className="app">
      <MapPage />
    </div>
  );
}

export default App;
