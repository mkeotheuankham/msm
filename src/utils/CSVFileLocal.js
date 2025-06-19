import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const AirportMarker = React.memo(({ position, data, index, markerRefs }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current && markerRefs) {
      markerRefs.current.push(markerRef.current);
      // ເປີດ Popup ທັນທີເມື່ອ Marker ຖືກສ້າງ
      markerRef.current.openPopup();
    }
  }, [markerRefs]);

  const airportIcon = L.divIcon({
    html: `
      <div style="
        background: ${index % 2 === 0 ? "#e53935" : "#1e88e5"};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      ">
        ${index + 1}
      </div>
    `,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <Marker position={position} icon={airportIcon} ref={markerRef}>
      <Popup>
        <div style={{ minWidth: "200px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1a73e8" }}>
            {data.Name_Lao || "ບໍ່ມີຂໍ້ມູນຊື່ພາສາລາວ"}
          </h3>
          {data.Name && (
            <div style={{ marginBottom: "5px" }}>
              <strong>Name (English):</strong> {data.Name}
            </div>
          )}
          <div style={{ marginBottom: "5px" }}>
            <strong>ຕຳແໜ່ງ:</strong>
            <div>Latitude: {parseFloat(data.Latitude).toFixed(4)}</div>
            <div>Longitude: {parseFloat(data.Longitude).toFixed(4)}</div>
          </div>
          {data.Code && (
            <div style={{ marginBottom: "5px" }}>
              <strong>ລະຫັດ:</strong> {data.Code}
            </div>
          )}
          {data.Province && (
            <div style={{ marginBottom: "5px" }}>
              <strong>ແຂວງ:</strong> {data.Province}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
});

const CSVFileLocal = () => {
  const [data, setData] = useState(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = async () => {
    try {
      const file = process.env.PUBLIC_URL + "/assets/Airport.csv";
      const response = await fetch(file);
      const text = await response.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const filteredData = result.data.filter(
        (item) => item.Latitude && item.Longitude
      );
      setData(filteredData);
    } catch (error) {
      console.error("Error loading CSV data:", error);
    }
  };

  // ຟັງຊັນເປີດ Popup ທັງໝົດ
  const openAllPopups = () => {
    markerRefs.current.forEach((marker) => {
      if (marker && marker.openPopup) {
        marker.openPopup();
      }
    });
  };

  // ເປີດ Popup ທັງໝົດເມື່ອ data ມາ
  useEffect(() => {
    if (data && data.length > 0) {
      openAllPopups();
    }
  }, [data]);

  return data
    ? data.map((item, index) => (
        <AirportMarker
          key={index}
          position={[item.Latitude, item.Longitude]}
          data={item}
          index={index}
          markerRefs={markerRefs}
        />
      ))
    : null;
};

export default CSVFileLocal;
