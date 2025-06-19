import React from "react";
import { LayersControl, TileLayer } from "react-leaflet";
import CursorStyle from "../Drawing/CursorStyle"; // ນຳເຂົ້າ component ປ່ຽນເຄີເຊີ

const BaseMap = () => {
  return (
    <>
      <CursorStyle cursorType="crosshair" /> {/* ເພີ່ມສ່ວນນີ້ */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="OpenStreetMap" checked>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            minZoom={0}
            maxZoom={21}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="stadiamaps">
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            minZoom={0}
            maxZoom={21}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="cartocdn">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            minZoom={0}
            maxZoom={21}
            detectRetina={true}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="arcgisonline">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            minZoom={0}
            maxZoom={21}
            detectRetina={true}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </>
  );
};

export default BaseMap;
