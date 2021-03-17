const express = require("express");
const app = express();
const Database = require("nedb");
const http = require("https");
const fetch = require("node-fetch");
require("dotenv").config();

const database = new Database("./Database.db");
database.loadDatabase();

app.use(express.static("public"));

app.use("/api", express.json({ limit: "1mb" }));
app.post("/api", (req, res) => {
  const data = req.body;

  const dataForDatabase = {
    Time: Date.now(),
    Latitude: data.Latitude,
    Longitude: data.Longitude,
  };

  database.insert(dataForDatabase);

  res.json({
    Time: Date.now(),
    Latitude: data.Latitude,
    Longitude: data.Longitude,
  });
});

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
      return;
    }
    res.json(data);
  });
});

app.get("/weather/:latlon", (req, res) => {
  const latlon = req.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];
  // Get weather data

  const options = {
    method: "GET",
    hostname: "api.ambeedata.com",
    port: null,
    path: `/weather/latest/by-lat-lng?lat=${lat}&lng=${lon}`,
    headers: {
      "x-api-key": process.env.API_KEY,
      "Content-type": "application/json",
    },
  };

  const reqWeather = http.request(options, function (resWeather) {
    const chunks = [];

    resWeather.on("data", function (chunk) {
      chunks.push(chunk);
    });

    resWeather.on("end", function () {
      const weatherData = Buffer.concat(chunks).toString();

      res.json({
        Time: Date.now(),
        Latitude: lat,
        Longitude: lon,
        WeatherData: weatherData,
      });
    });
  });
  reqWeather.end();
});

app.get("/air/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];

  const resAir = await fetch(
    `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?coordinates=${lat},${lon}`
  );
  const jsonAir = await resAir.json();

  res.json(jsonAir);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Started. PORT : ${port}`);
});
