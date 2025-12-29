import React, { useState, useEffect, useContext } from 'react';
import './CheckWeather.css';
import { AuthContext } from "../../context/AuthContext";
import { getforecast, getWeather } from '../../api/farmerApi';
import { useLocation } from "react-router-dom";


function CheckWeather() {
    const location = useLocation();
    const { city : argCity } = location.state || {};
    console.log("argciy" , argCity)

    const { token } = useContext(AuthContext); // get JWT token
    const [city, setCity] = useState(argCity);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    
    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeatherData = async () => {
        if (!city.trim()) return;
        
        setLoading(true);
        setError('');
        
        try {
            const weatherResponse = await getWeather(city , token)
            const forecastResponse = await getforecast(city)
            
            setCurrentWeather(weatherResponse);
            setForecast(forecastResponse);
            
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error('Error fetching weather data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeatherData();
    };

    // Fetch weather on component mount
    useEffect(() => {
        fetchWeatherData();
    }, []);

    const getWeatherIcon = (condition) => {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('clear')) return '☀️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('snow')) return '❄️';
        if (conditionLower.includes('smoke')) return '💨';
        if (conditionLower.includes('thunder')) return '⛈️';
        if (conditionLower.includes('haze') || conditionLower.includes('fog')) return '🌫️';
        return '🌈';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const groupForecastByDay = (forecastData) => {
        const grouped = {};
        forecastData.forEach(item => {
            const date = item.datetime.split(' ')[0]; // Get YYYY-MM-DD
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });
        return grouped;
    };

    return (
        <div className="check-weather">
            <header className="weather-header">
                <div className="header-content">
                    <h1>Weather Forecast</h1>
                    <form onSubmit={handleSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            value={city}
                            onChange={handleInputChange}
                            className="city-input"
                            required
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>
            </header>

            <main className="weather-content">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {currentWeather && (
                    <section className="current-weather">
                        <div className="current-weather-card">
                            <div className="location">
                                <h2>{currentWeather.city}, {currentWeather.country}</h2>
                                <p className="last-updated">
                                    Last updated: {new Date(currentWeather.timestamp).toLocaleString()}
                                </p>
                            </div>
                            
                            <div className="weather-main">
                                <div className="temperature-section">
                                    <div className="current-temp">
                                        {Math.round(currentWeather.temperature)}°C
                                    </div>
                                    <div className="feels-like">
                                        Feels like {Math.round(currentWeather.feels_like)}°C
                                    </div>
                                </div>
                                
                                <div className="weather-icon">
                                    {getWeatherIcon(currentWeather.weather)}
                                </div>
                            </div>
                            
                            <div className="weather-details">
                                <div className="weather-condition">
                                    {currentWeather.weather}
                                </div>
                                
                                <div className="weather-stats">
                                    <div className="stat">
                                        <span className="stat-label">Humidity</span>
                                        <span className="stat-value">{currentWeather.humidity}%</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Wind Speed</span>
                                        <span className="stat-value">{currentWeather.wind_speed} m/s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {forecast && (
                    <section className="weather-forecast">
                        <h3>5-Day Forecast</h3>
                        
                        <div className="forecast-container">
                            {Object.entries(groupForecastByDay(forecast.forecast)).slice(0, 5).map(([date, dayForecast]) => {
                                const dayData = dayForecast[0]; // Use first entry of the day for summary
                                const maxTemp = Math.max(...dayForecast.map(item => item.temperature));
                                const minTemp = Math.min(...dayForecast.map(item => item.temperature));
                                
                                return (
                                    <div key={date} className="forecast-day">
                                        <div className="forecast-date">
                                            {formatDate(date)}
                                        </div>
                                        <div className="forecast-icon">
                                            {getWeatherIcon(dayData.condition)}
                                        </div>
                                        <div className="forecast-temps">
                                            <span className="forecast-high">{Math.round(maxTemp)}°</span>
                                            <span className="forecast-low">{Math.round(minTemp)}°</span>
                                        </div>
                                        <div className="forecast-condition">
                                            {dayData.condition}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="detailed-forecast">
                            <h4>Detailed Forecast</h4>
                            <div className="hourly-forecast">
                                {forecast.forecast.slice(0, 12).map((item, index) => (
                                    <div key={index} className="hourly-item">
                                        <div className="hourly-time">
                                            {formatTime(item.datetime)}
                                        </div>
                                        <div className="hourly-icon">
                                            {getWeatherIcon(item.condition)}
                                        </div>
                                        <div className="hourly-temp">
                                            {Math.round(item.temperature)}°C
                                        </div>
                                        <div className="hourly-humidity">
                                            💧 {item.humidity}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default CheckWeather;