import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./DistrictMapWithLayers.css";

// ຕັ້ງຄ່າ icon marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DistrictMapWithLayers = () => {
  const [districtsData, setDistrictsData] = useState({
    xaisettha: { parcels: [], loading: false, error: null, checked: false },
    xaithany: { parcels: [], loading: false, error: null, checked: false },
    sisattanak: { parcels: [], loading: false, error: null, checked: false },
  });
  const [bounds, setBounds] = useState(null);
  const [map, setMap] = useState(null);

  const districtEndpoints = useMemo(
    () => ({
      xaisettha: "https://msmapi.up.railway.app/api/rest/xaisettha",
      xaithany: "https://msmapi.up.railway.app/api/rest/xaithany",
      sisattanak: "https://msmapi.up.railway.app/api/rest/sisattanak",
    }),
    []
  );

  // ສີສຳລັບແຕ່ລະເມືອງ
  const districtColors = {
    xaisettha: "#ff0000",
    xaithany: "#00ff00",
    sisattanak: "#0000ff",
  };

  // ຊື່ເມືອງເປັນພາສາລາວ
  const districtNames = {
    xaisettha: "ໄຊເສດຖາ",
    xaithany: "ໄຊທານີ",
    sisattanak: "ສີສັດຕະນາກ",
  };

  const handleCheckboxChange = (district) => {
    const isChecked = !districtsData[district].checked;

    setDistrictsData((prev) => ({
      ...prev,
      [district]: {
        ...prev[district],
        checked: isChecked,
        loading: isChecked && prev[district].parcels.length === 0,
      },
    }));

    if (isChecked && districtsData[district].parcels.length === 0) {
      fetchDistrictData(district);
    }
  };

  const fetchDistrictData = async (district) => {
    try {
      const response = await axios.get(districtEndpoints[district]);
      const parcels = response.data?.cadastre_parcel_details_0101 || [];

      // ກວດສອບຂໍ້ມູນ GeoJSON
      const validParcels = parcels.filter(
        (parcel) =>
          parcel.geom &&
          parcel.geom.type === "Polygon" &&
          parcel.geom.coordinates?.[0]?.length > 0
      );

      console.log(
        `Fetched ${validParcels.length} valid parcels for ${district}`
      );

      setDistrictsData((prev) => ({
        ...prev,
        [district]: {
          ...prev[district],
          parcels: validParcels,
          loading: false,
          error: null,
        },
      }));

      // ຕັ້ງຄ່າ bounds ໃຫ້ກັບ map
      if (validParcels.length > 0) {
        const coords = validParcels.flatMap((parcel) =>
          parcel.geom.coordinates[0].map(([lng, lat]) => [lat, lng])
        );

        if (coords.length > 0) {
          const newBounds = L.latLngBounds(coords);
          setBounds(newBounds);

          // ຖ້າ map ມີຄ່າ ໃຫ້ fit bounds
          if (map) {
            map.fitBounds(newBounds, { padding: [50, 50] });
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching data for ${district}:`, err);
      setDistrictsData((prev) => ({
        ...prev,
        [district]: {
          ...prev[district],
          loading: false,
          error: err.message,
        },
      }));
    }
  };

  const getDistrictStyle = (district) => {
    return {
      fillColor: districtColors[district],
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const { owners, parcelno, area, landusetype, road, district_lao } =
        feature.properties;
      layer.bindPopup(`
        <div style="min-width: 200px;">
          <b>ເມືອງ:</b> ${district_lao || "ບໍ່ມີຂໍ້ມູນ"}<br/>
          <b>ເຈົ້າຂອງ:</b> ${owners || "ບໍ່ມີຂໍ້ມູນ"}<br/>
          <b>ເລກທີ່ດິນ:</b> ${parcelno || "ບໍ່ມີຂໍ້ມູນ"}<br/>
          <b>ເນື້ອທີ່:</b> ${area || "ບໍ່ມີຂໍ້ມູນ"} m²<br/>
          <b>ປະເພດການນຳໃຊ້:</b> ${landusetype || "ບໍ່ມີຂໍ້ມູນ"}<br/>
          <b>ຖະໜົນ:</b> ${road || "ບໍ່ມີຂໍ້ມູນ"}
        </div>
      `);
    }
  };

  // ກວດສອບສະຖານະການໂຫຼດຂໍ້ມູນ
  const isLoading = Object.values(districtsData).some((d) => d.loading);
  const hasError = Object.values(districtsData).some((d) => d.error);

  // ສ້າງ feature collection ສຳລັບແຕ່ລະເມືອງ
  const createFeatureCollection = (parcels) => {
    return {
      type: "FeatureCollection",
      features: parcels
        .filter((parcel) => parcel.geom)
        .map((parcel) => ({
          type: "Feature",
          geometry: parcel.geom,
          properties: parcel,
        })),
    };
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[17.975, 102.6]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* ສະແດງ GeoJSON ສຳລັບແຕ່ລະເມືອງທີ່ເລືອກ */}
        {Object.entries(districtsData).map(([district, data]) => {
          if (data.checked && data.parcels.length > 0) {
            const featureCollection = createFeatureCollection(data.parcels);
            return (
              <GeoJSON
                key={district}
                data={featureCollection}
                style={getDistrictStyle(district)}
                onEachFeature={onEachFeature}
              />
            );
          }
          return null;
        })}
      </MapContainer>

      {/* Custom Control Panel */}
      <div className="custom-control-panel">
        <h3 style={{ margin: "0 0 10px 0", textAlign: "center" }}>ເມືອງ</h3>
        {Object.entries(districtsData).map(([district, data]) => (
          <label key={district} className="custom-control-label">
            <input
              type="checkbox"
              checked={data.checked}
              onChange={() => handleCheckboxChange(district)}
              disabled={data.loading}
            />
            <span
              style={{
                color: districtColors[district],
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {districtNames[district]}
              {data.loading && " (ກຳລັງໂຫລດ...)"}
              {data.error && " (ຜິດພາດ)"}
            </span>
          </label>
        ))}
        {isLoading && (
          <div style={{ marginTop: "10px", color: "#666" }}>
            ກຳລັງໂຫລດຂໍ້ມູນ...
          </div>
        )}
        {hasError && (
          <div style={{ marginTop: "10px", color: "red" }}>
            ມີຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictMapWithLayers;
