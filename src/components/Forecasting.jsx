
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import * as tf from "@tensorflow/tfjs";
import { supabase } from "../libs/supabaseClient";

const Forecasting = () => {
  const [temperaturePrediction, setTemperaturePrediction] = useState(null);
  const [humidityPrediction, setHumidityPrediction] = useState(null);
  const [temperatureDataPlot, setTemperatureDataPlot] = useState([]);
  const [humidityDataPlot, setHumidityDataPlot] = useState([]);

  useEffect(() => {
    const predictData = async () => {
      try {
        const { data: measurementsData, error } = await supabase
          .from("measurements")
          .select("temperature, humidity")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) {
          throw error;
        }

        const combinedData = measurementsData.map(({ temperature, humidity }) => ({
          temperature,
          humidity,
        }));

        const inputData = combinedData.map(({ temperature, humidity }) => [
          temperature,
          humidity,
        ]);
        const xs = tf.tensor2d(inputData, [combinedData.length, 2]);
        const ys = tf.tensor2d(inputData, [combinedData.length, 2]);

        const model = tf.sequential();
        model.add(
          tf.layers.dense({ units: 8, inputShape: [2], activation: "relu" })
        );
        model.add(tf.layers.dense({ units: 16, activation: "relu" }));
        model.add(tf.layers.dense({ units: 2 }));
        model.compile({ loss: "meanSquaredError", optimizer: "adam" });

        await model.fit(xs, ys, { epochs: 100, batchSize: 32 });

        const lastMeasurement = measurementsData[measurementsData.length - 1];
        const predictionInput = tf.tensor2d([
          [lastMeasurement.temperature, lastMeasurement.humidity],
        ]);
        const predictions = model.predict(predictionInput);

        const [temperaturePred, humidityPred] = predictions.arraySync()[0];

        setTemperaturePrediction(Math.round(temperaturePred));
        setHumidityPrediction(Math.round(humidityPred) + "%");

        const temperaturePlot = measurementsData.map(({ temperature }) =>
          temperature
        );
        const humidityPlot = measurementsData.map(({ humidity }) => humidity);

        setTemperatureDataPlot(temperaturePlot);
        setHumidityDataPlot(humidityPlot);
      } catch (error) {
        console.error("Error predicting:", error);
      }
    };

    predictData();
  }, []);

  return (
    <div className="forecasting-alternative">
      
      {temperaturePrediction !== null && humidityPrediction !== null && (
        <div className="predictions">
          <h3>Predicciones:</h3>
          <p>Temperatura: {temperaturePrediction}</p>
          <p>Humedad: {humidityPrediction}</p>
        </div>
      )}

      <div className="scatter-plots">
        
        <Plot
          data={[
            {
              y: temperatureDataPlot,
              type: "scatter",
              mode: "markers",
              marker: { color: "red" },
              name: "Temperature",
            },
          ]}
          layout={{
            width: 600,
            height: 400,
            title: "Temperatura",
            showLine: true,
          }}
        />

       
        <Plot
          data={[
            {
              y: humidityDataPlot,
              type: "scatter",
              mode: "markers",
              marker: { color: "blue" },
              name: "Humidity",
            },
          ]}
          layout={{
            width: 600,
            height: 400,
            title: "Humedad",
            showLine: true,
          }}


          



        />
        <Plot
          data={[
            {
              y: temperatureDataPlot,
              type: "scatter",
              mode: "lines",
              line: { color: "red", width: 2 },
              name: "Temperatura",
            },
          ]}
          layout={{
            width: 600,
            height: 400,
            title: "Temperatura",
            showLine: true,
          }}
        />

        
        <Plot
          data={[
            {
              y: humidityDataPlot,
              type: "scatter",
              mode: "lines",
              line: { color: "blue", width: 2 },
              name: "Humidity",
            },
          ]}
          layout={{
            width: 600,
            height: 400,
            title: "Humedad",
            showLine: true,
          }}
        />
      </div>
    </div>
  );
};

export default Forecasting;

