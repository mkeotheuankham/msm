import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// ແກ້ໄຂບັນຫາ marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapWithClustering = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markerClusterRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://msmapi.up.railway.app/api/rest/chanthabury"
        );
        const data = await response.json();
        setParcels(data.cadastre_parcel_details_0101);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!mapRef.current || parcels.length === 0) return;

    // ລຶບ marker cluster ເກົ່າຖ້າມີ
    if (markerClusterRef.current) {
      markerClusterRef.current.remove();
    }

    // ສ້າງ marker cluster ໃໝ່
    const markerCluster = L.markerClusterGroup();
    markerClusterRef.current = markerCluster;

    parcels.forEach((parcel) => {
      const centroid = parcel.centroid_coordinates.match(
        /POINT\(([^ ]+) ([^ ]+)\)/
      );
      if (centroid) {
        const lng = parseFloat(centroid[1]);
        const lat = parseFloat(centroid[2]);

        const marker = L.marker([lat, lng]).bindPopup(`
          <b>ເລກທີ່ດິນ:</b> ${parcel.parcelno}<br/>
          <b>ເຈົ້າຂອງ:</b> ${parcel.owners}<br/>
          <b>ເນື້ອທີ່:</b> ${parcel.area} m²
        `);

        markerCluster.addLayer(marker);
      }
    });

    mapRef.current.addLayer(markerCluster);

    return () => {
      if (markerClusterRef.current) {
        mapRef.current.removeLayer(markerClusterRef.current);
      }
    };
  }, [parcels]);

  if (loading) return <div>ກຳລັງໂຫລດຂໍ້ມູນ...</div>;
  if (error) return <div>ມີຂໍ້ຜິດພາດ: {error}</div>;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[18.008246, 102.598182]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default MapWithClustering;
