import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
