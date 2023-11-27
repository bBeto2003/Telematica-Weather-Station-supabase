 
import { useEffect, useState } from "react";
import { supabase } from "../libs/supabaseClient";
import React from 'react';
import Map from './Map'
import '../components/index.css';

export default function Table() {
  const [tableData, setTableData] = useState([]);
  const position = [19.24911,-103.69734];
  useEffect(() => {
    async function fetchTableData() {
      console.log("Comenzando la obtención de datos de Supabase...");
      try {
        const { data, error } = await supabase
          .from("measurements")
          .select("created_at,station_id,latitude,longitude,temperature,humidity");

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

  return (
    
    <>
         <h2>Estos son los datos de la Tabla de Supabase</h2>
      <div className="flex justify-center items-center">

        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>
        <table class="table table-striped table-dark">
          <thead>
            <tr>
             
              <th>created_at</th>
              <th>station_id</th>
              <th>latitude</th>
              <th>longitude</th>
              <th>temperature</th>
              <th>humidity</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>

                <td>{row.created_at}</td>
                <td>{row.station_id}</td>
                <td>{row.latitude}</td>
                <td>{row.longitude}</td>
                <td>{row.temperature}</td>
                <td>{row.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Map/>
      </>
     
  );
  
}
