import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// ຕັ້ງຄ່າ icon marker ທີ່ຖືກຕ້ອງ
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapWithAPI = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://msmapi.up.railway.app/api/rest/chanthabury"
        );
        setParcels(response.data.cadastre_parcel_details_0101);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>ກຳລັງໂຫລດຂໍ້ມູນ...</div>;
  if (error) return <div>ມີຂໍ້ຜິດພາດ: {error}</div>;

  // ສ້າງ style ສຳລັບ GeoJSON
  const parcelStyle = {
    fillColor: "#3388ff",
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "100",
    fillOpacity: 0.7,
  };

  // ເມື່ອຄລິກໃສ່ parcel
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const { owners, parcelno, area, landusetype, road } = feature.properties;
      layer.bindPopup(`
        <b>ເຈົ້າຂອງ:</b> ${owners}<br/>
        <b>ເລກທີ່ດິນ:</b> ${parcelno}<br/>
        <b>ເນື້ອທີ່:</b> ${area} m²<br/>
        <b>ປະເພດການນຳໃຊ້:</b> ${landusetype}<br/>
        <b>ຖະໜົນ:</b> ${road || "ບໍ່ມີຂໍ້ມູນ"}
      `);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[17.985375, 103.968534]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {parcels.map((parcel, index) => (
          <GeoJSON
            key={parcel.gid}
            data={{
              type: "Feature",
              geometry: parcel.geom,
              properties: parcel,
            }}
            style={parcelStyle}
            onEachFeature={onEachFeature}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWithAPI;
