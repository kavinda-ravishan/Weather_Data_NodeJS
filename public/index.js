const latitudeDom = document.getElementById("latitude");
const longitudeDom = document.getElementById("longitude");
const responseDom = document.getElementById("response");

const isGeolocationSupported = !!navigator.geolocation;

if (isGeolocationSupported) {
  console.log("Geolocation is supported by your browser");
} else {
  console.error("Geolocation is not supported by your browser");
  document.getElementById("sendBtn").disabled = true;
}

function sendData() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      latitudeDom.textContent = latitude;
      longitudeDom.textContent = longitude;

      //Send data
      const data = {
        Time: Date.now(),
        Latitude: latitude,
        Longitude: longitude,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch("/api", options);
      const res = await response.json();

      responseDom.textContent = `Time : ${new Date(
        res.Time
      ).toLocaleString()}, Latitude : ${res.Latitude}, Longitude : ${
        res.Longitude
      }`;
    },
    (error) => {
      console.error(`Error : ${error.message}`);
    }
  );
}

function sendLocationForWeatherData() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      latitudeDom.textContent = latitude;
      longitudeDom.textContent = longitude;

      const res = await fetch(`/weather/${latitude},${longitude}`);
      const resJson = await res.json();

      const WeatherData = JSON.parse(resJson.WeatherData).data;

      const {
        apparentTemperature,
        cloudCover,
        dewPoint,
        humidity,
        lat,
        lng,
        ozone,
        pressure,
        temperature,
        time,
        visibility,
        windBearing,
        windGust,
        windSpeed,
      } = WeatherData;

      console.log(WeatherData);
      responseDom.textContent = `Latitude : ${resJson.Latitude}, Longitude : ${resJson.Longitude}, Temperature : ${temperature}`;
    },
    (error) => {
      console.error(`Error : ${error.message}`);
    }
  );
}

function sendLocationForAirQualityData() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      latitudeDom.textContent = latitude;
      longitudeDom.textContent = longitude;

      const res = await fetch(`/air/${latitude},${longitude}`);
      const resJson = await res.json();

      responseDom.textContent = "";
      try {
        if (resJson.results.length === 0) {
          responseDom.textContent = "Data not available for this location";
        }
        for (result of resJson.results) {
          const brDom = document.createElement("br");
          for (measurement of result.measurements) {
            const lastUpdated = measurement.lastUpdated;
            const parameter = measurement.parameter;
            const unit = measurement.unit;
            const value = measurement.value;

            const airDom = document.createElement("p");
            airDom.textContent = `Last Updated : ${lastUpdated}, Parameter : ${parameter}, Unit = ${unit}, Value : ${value}`;
            responseDom.append(airDom);
          }
          responseDom.append(brDom);
        }
      } catch (err) {
        responseDom.textContent = `${err}`;
      }
    },
    (error) => {
      console.error(`Error : ${error.message}`);
    }
  );
}
