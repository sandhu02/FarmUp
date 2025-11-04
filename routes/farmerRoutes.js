// routes/admin.js
const express = require("express");
const router = express.Router();
const Market = require("../model/market");
const verifyToken = require("../middleware/verifyToken");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");


router.get("/marketdata", verifyToken, async (req, res) => {
    try {
        const data = await Market.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: "Market data fetched successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error fetching market data",
        });
    }
});


// ✅ GET: Weather by city name
router.get("/weather", verifyToken, async (req, res) => {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
        const city = req.query.city || "Lahore";

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "Please provide a city name in query parameter, e.g. ?city=Lahore",
            });
        }

        if (!OPENWEATHER_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Missing OpenWeatherMap API key in environment variables",
            });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
        )}&units=metric&appid=${OPENWEATHER_API_KEY}`;

        const response = await axios.get(url);
        const data = response.data;

        // ✅ Clean structured response
        res.status(200).json({
            success: true,
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            weather: data.weather[0].description,
            wind_speed: data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            timestamp: new Date(),
        });
    } catch (err) {
        console.error("Weather API error:", err.response?.data || err.message);

        if (err.response?.status === 404) {
            return res.status(404).json({
                success: false,
                message: "City not found. Please check the spelling.",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch weather data",
            error: err.message,
        });
    }
});

// ✅ GET weather data for multiple cities
router.get("/weather/all", async (req, res) => {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
        const cities = [
            "Lahore",
            "Karachi",
            "Islamabad",
            "Peshawar",
            "Quetta",
            "Multan",
            "Faisalabad",
            "Hyderabad",
            "Sialkot",
            "Rawalpindi",
        ];

        // Fetch all city data in parallel
        const requests = cities.map((city) =>
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
            )
        );

        const responses = await Promise.allSettled(requests);

        const weatherData = responses.map((result, index) => {
            if (result.status === "fulfilled") {
                const data = result.value.data;
                return {
                    city: data.name,
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    weather: data.weather[0].main,
                    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                    color:
                        data.weather[0].main.toLowerCase().includes("rain")
                            ? "blue"
                            : data.main.temp > 35
                                ? "yellow"
                                : "green",
                };
            } else {
                return { city: cities[index], error: "Failed to fetch weather" };
            }
        });

        res.status(200).json({
            success: true,
            data: weatherData,
        });
    } catch (err) {
        console.error("Weather fetch error:", err.message);
        res.status(500).json({ success: false, message: "Failed to load weather data" });
    }
});

// router.get("/forecast", verifyToken, async (req, res) => { })


// routes/admin.js
router.get("/forecast", async (req, res) => {
  const city = req.query.city || "Lahore";

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const forecast = response.data.list.map((item) => ({
      datetime: item.dt_txt,
      temperature: item.main.temp,
      condition: item.weather[0].main,
      humidity: item.main.humidity,
    }));

    res.json({
      city: response.data.city.name,
      forecast,
    });
  } catch (err) {
    console.error("OpenWeather forecast error:", err.message);
    res.status(500).json({ message: "Failed to fetch forecast" });
  }
});

router.get("/advice", verifyToken, async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({
            success: false,
            message: "Please provide ?city=Lahore",
        });
    }

    const priceTrend = "Stable"

    try {
        const weatherRes = await axios.get(
        `http://localhost:${process.env.PORT}/farmer/weather?city=${encodeURIComponent(city)}`,
        {
            headers: { Authorization: req.headers.authorization }, // reuse token
        }
        );
        const forecastRes = await axios.get(
        `http://localhost:${process.env.PORT}/farmer/forecast?city=${encodeURIComponent(city)}`,
        {
            headers: { Authorization: req.headers.authorization }, // reuse token
        }
        );
        
        const prompt = `
            You are an agriculture advisor AI helping Pakistani farmers.
            Given the following data, write 2-3 short, actionable farming advice sentences.
    
            Crop: ${"General"}
            City: ${city || "Unknown"}
            Weather: ${weatherRes.data || "Normal"}
            Temperature: ${weatherRes.data.temperature || "N/A"}°C
            Forecast: ${forecastRes.data || "N/A"}
            Price Trend: ${priceTrend || "Stable"}
    
            Example advice:
            - Avoid watering crops today, rain is expected.
            - Tomato prices are rising; consider selling soon.
            - High temperatures can damage spinach; provide shade.
    
            Now generate similar advice for the above data.
            `;


        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


        const result = await model.generateContent(prompt);
        res.send(result.response.text());
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch AI response" });
    }
});

module.exports = router;
