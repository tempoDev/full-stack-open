import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Weather({ capital }) {
  const [weatherData, setWheaterData] = useState([]);
  const apiKey = process.env.REACT_APP_WEATHER_KEY;
  console.log(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
  );

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        setWheaterData(response.data);
      });

    console.log(weatherData);
  }, []);

  return (
    <>
      {weatherData.main ? (
        <div>
          <h3>Weather in {capital}</h3>
          <div><span style={{fontWeight: "bold"}}>Temperature:</span> {weatherData.main.temp} Celsius</div>
          <div><span style={{fontWeight: "bold"}}>Wind:</span> {weatherData.wind.speed}</div>
          <img
            alt="weather icon"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          />
        </div>
      ) : null}
    </>
  );
}
