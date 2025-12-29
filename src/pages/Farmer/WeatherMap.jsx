import React from 'react';
import './WeatherMap.css';

function WeatherMap() {
  return (
    <div className="weather-map-app">
      <header className="weather-map-header">
        <h1>Pakistan Weather Map</h1>
        <p>Real-time weather conditions across Pakistan</p>
      </header>
      
      <div className="weather-map-container">
        <iframe
          className="weather-map-iframe"
          src="https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=30.3753&lon=69.3451&zoom=5"
          title="Pakistan Weather Map"
        />
      </div>
    </div>
  );
}

export default WeatherMap;