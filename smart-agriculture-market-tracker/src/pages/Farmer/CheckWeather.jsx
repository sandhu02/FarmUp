import React, { useState, useEffect } from 'react';
import './CheckWeather.css';

function CheckWeather() {
    const [city, setCity] = useState('Haroonabad');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock current weather data
    const mockCurrentWeather = {
        "success": true,
        "city": "Haroonabad",
        "country": "PK",
        "temperature": 21.57,
        "feels_like": 20.15,
        "humidity": 14,
        "weather": "clear sky",
        "wind_speed": 1.47,
        "icon": "https://openweathermap.org/img/wn/01n.png",
        "timestamp": "2025-11-11T13:31:58.450Z"
    };

    // Mock forecast data
    const mockForecast = {
        "city": "Haroonabad",
        "forecast": [
            {
                "datetime": "2025-11-11 15:00:00",
                "temperature": 20.77,
                "condition": "Clouds",
                "humidity": 15
            },
            {
                "datetime": "2025-11-11 18:00:00",
                "temperature": 20.27,
                "condition": "Clouds",
                "humidity": 16
            },
            {
                "datetime": "2025-11-11 21:00:00",
                "temperature": 18.89,
                "condition": "Clear",
                "humidity": 16
            },
            {
                "datetime": "2025-11-12 00:00:00",
                "temperature": 16.52,
                "condition": "Clear",
                "humidity": 17
            },
            {
                "datetime": "2025-11-12 03:00:00",
                "temperature": 19.74,
                "condition": "Clear",
                "humidity": 14
            },
            {
                "datetime": "2025-11-12 06:00:00",
                "temperature": 26.63,
                "condition": "Clear",
                "humidity": 10
            },
        ]
    };

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeatherData = async () => {
        if (!city.trim()) return;
        
        setLoading(true);
        setError('');
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Replace with actual API calls
            // const currentResponse = await fetch(`/api/current-weather?city=${city}`);
            // const forecastResponse = await fetch(`/api/forecast?city=${city}`);
            
            // For demo, using mock data
            setCurrentWeather(mockCurrentWeather);
            setForecast(mockForecast);
            
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
                                    <img 
                                        src={currentWeather.icon} 
                                        alt={currentWeather.weather}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <span className="emoji-fallback" style={{display: 'none'}}>
                                        {getWeatherIcon(currentWeather.weather)}
                                    </span>
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