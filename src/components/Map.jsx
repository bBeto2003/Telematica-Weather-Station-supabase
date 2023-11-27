import { useEffect, useState } from "react";
import { supabase } from "../libs/supabaseClient";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../components/index.css';

export default function Map() {
  
  const [tableData, setTableData] = useState([]);
  const position = [19.24911,-103.69734];
  useEffect(() => {
    async function fetchTableData() {
      console.log("Comenzando la obtención de datos de Supabase...");
      try {
        const { data, error } = await supabase
          .from("measurements")
          .select("id,created_at,station_id,latitude,longitude,temperature,humidity")
          .order('created_at',{ascending: false})
          .limit(1);
        if (error) {
          throw error;
        }

        setTableData(data);
      } catch (error) {
        console.error("Error al obtener datos de Supabase:", error.message);
      }
      console.log("Finalizada la obtención de datos de Supabase.");
    }

    fetchTableData();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: "https://e7.pngegg.com/pngimages/363/769/png-clipart-location-icon-landmark-map.png", // Ruta a tu icono personalizado
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
      />
      <script
        src="https://unpkg.com/leaflet/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""
      ></script>
      <div id="map" style={{ height: '180px' }}>
        <h2>Mapa</h2>
        <MapContainer center={position} zoom={20} scrollWheelZoom={false}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            icon={customIcon}
          position={position}>
            <Popup>
             {tableData.map((row) => (
                  <div>
                    <p>ID: {row.id}</p>
                    <p>Created at: {row.created_at}</p>
                    <p>Station ID: {row.station_id}</p>
                    <p>Latitude: {row.latitude}</p>
                    <p>Longitude: {row.longitude}</p>
                    <p>Temperature: {row.temperature}</p>
                    <p>Humidity: {row.humidity}</p>
                  </div>
                ))}
            </Popup>
          </Marker> 
        </MapContainer>
      </div>
    </>
  );
}


