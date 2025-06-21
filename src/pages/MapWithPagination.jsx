import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapWithPagination = () => {
  const [parcels, setParcels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParcels = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://msmapi.up.railway.app/api/rest/chanthabury`,
        {
          params: {
            page: pageNum,
            limit: 50, // ຈຳນວນຂໍ້ມູນຕໍ່ຫນ້າ
          },
        }
      );

      if (response.data.cadastre_parcel_details_0101.length === 0) {
        setHasMore(false);
      } else {
        setParcels((prev) => [
          ...prev,
          ...response.data.cadastre_parcel_details_0101,
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParcels(page);
  }, [page, fetchParcels]);

  // ເມື່ອແຜນທີ່ຖືກ scroll ເຖິງຂອບເຂດທີ່ກຳນົດ
  const handleMapMoveEnd = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  // ສ້າງ style ສຳລັບ GeoJSON
  const getParcelStyle = (feature) => {
    const landUseCode = feature.properties.landusetype_code;
    let color;

    switch (landUseCode) {
      case 1:
        color = "#3388ff";
        break; // ທີ່ຢູ່ອາໄສ
      case 4:
        color = "#33cc33";
        break; // ເປົ່າຫວ່າງ
      default:
        color = "#ff9933";
    }

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // ສ້າງ cluster ຫຼື ຈຸດສູນກາງ
  const getCentroid = (geom) => {
    if (geom.type === "Polygon") {
      const coords = geom.coordinates[0];
      let latSum = 0,
        lngSum = 0;

      coords.forEach((coord) => {
        lngSum += coord[0];
        latSum += coord[1];
      });

      return [latSum / coords.length, lngSum / coords.length];
    }
    return [17.985375, 103.968534]; // ຄ່າ default
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[17.985375, 103.968534]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        onMoveEnd={handleMapMoveEnd}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {parcels.map((parcel) => (
          <GeoJSON
            key={parcel.gid}
            data={{
              type: "Feature",
              geometry: parcel.geom,
              properties: parcel,
            }}
            style={(feature) => getParcelStyle(feature)}
          />
        ))}
      </MapContainer>

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px",
            background: "white",
            zIndex: 1000,
          }}
        >
          ກຳລັງໂຫລດຂໍ້ມູນ...
        </div>
      )}
    </div>
  );
};

export default MapWithPagination;
// ນີ້ແມ່ນຕົວຢ່າງຂອງແຜນທີ່ React ທີ່ໃຊ້ GeoJSON ແລະ Pagination
// ສໍາລັບການໃຊ້ GeoJSON ໃນ React Leaflet ຈະເຮັດໃຫ້ເຮົາສາມາດແຜນທີ່ ແລະ ສໍາເນົາ ຂໍ້ມູນ GeoJSON ທີ່ໄດ້
// ຈາກ API ຫຼື ຂໍ້ມູນທີ່ຖືກເກັບໄວ້
// ການໃຊ້ Pagination ຈະເຮັດໃຫ້ເຮົາສາມາດໂຫລດຂໍ້ມູນໃນຈຳນວນນ້ອຍ ແລະ ສາມາດເພີ່ມເນື້ອໃນແຜນທີ່ໄດ້
// ຂໍ້ມູນທີ່ໃຊ້ໃນຕົວຢ່າງນີ້ ແມ່ນຂໍ້ມູນ GeoJSON ທີ່ຖືກເກັບໄວ້ ແລະ ສາມາດນໍາໃຊ້ໄດ້
// ຕົວຢ່າງນີ້ແມ່ນສໍາລັບການໃຊ້ React Leaflet ກັບ GeoJSON ແລະ Pagination
// ການໃຊ້ Axios ເພື່ອໂຫລດຂໍ້ມູນ GeoJSON ຈາກ API ແລະ ສໍາເນົາ ຂໍ້ມູນໃນ MapContainer
// ການໃຊ້ useState ແລະ useEffect ສໍາລັບການຈັດການ state ແລະ ການໂຫລດຂໍ້ມູນ
// ການໃຊ້ useCallback ສໍາລັບການເຮັດໃຫ້ແນ່ໃຈວ່າ fetchParcels ຈະຖືກເຮັດໃນເທື່ອນ ແລະ ບໍ່ເຮັດໃນ ເທື່ອນ
// ການໃຊ້ GeoJSON ສໍາລັບການແຜນທີ່ ແລະ ສໍາເນົາ ຂໍ້ມູນ GeoJSON ທີ່ໄດ້
// ການໃຊ້ TileLayer ສໍາລັບການແຜນທີ່ ແລະ ສໍາເນົາ ຂໍ້ມູນ Tile ຈາກ OpenStreetMap
// ການໃຊ້ GeoJSON ສໍາລັບການແຜນທີ່ ແລະ ສໍາເນົາ ຂໍ້ມູນ GeoJSON ທີ່ໄດ້
// ການໃຊ້ onMoveEnd ສໍາລັບການເຮັດໃຫ້ແນ່ໃຈວ່າ ເມື່ອ scroll ເຖິງຂອບເຂດ ຈະເພີ່ມ page ໃນ Pagination
// ການໃຊ້ getParcelStyle ສໍາລັບການສ້າງ style ສໍາລັບ GeoJSON ຕາມປະເພດຂໍ້ມູນ
// ການໃຊ້ getCentroid ສໍາລັບການສ້າງ cluster ຫຼື ຈຸດສູນກາງ ຂອງ GeoJSON
// ການໃຊ້ loading ແລະ error ສໍາລັບການຈັດການສະຖານະໃນເວລາໂຫລດຂໍ້ມູນ
// ການໃຊ້ hasMore ສໍາລັບການກວດສອບວ່າ ຍັງມີເນື້ອໃນ Pagination ຫຼື ບໍ່
// ການໃຊ້ setPage ເພື່ອປ່ອນ page ໃນ Pagination ແລະ ການເພີ່ມ page ໃນ Pagination
// ການໃຊ້ setParcels ເພື່ອປ່ອນ parcels ໃນ state ແລະ ການເພີ່ມ parcels ໃນ state
// ການໃຊ້ setLoading ເພື່ອປ່ອນ loading ໃນ state ແລະ ການເພີ່ມ loading ໃນ state
// ການໃຊ້ setError ເພື່ອປ່ອນ error ໃນ state ແລະ ການເພີ່ມ error ໃນ state
// ການໃຊ້ useCallback ສໍາລັບການເຮັດໃຫ້ແນ່ໃຈວ່າ handleMapMoveEnd ຈະຖືກເຮັດໃນເທື່ອນ ແລະ ບໍ່ເຮັດໃນ ເທື່ອນ
