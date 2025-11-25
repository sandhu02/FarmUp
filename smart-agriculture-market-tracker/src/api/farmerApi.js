import axios from "axios";
import { BASE_URL } from "./base_url";

export const getMarketData = async (token) => {
  const response = await axios.get(`${BASE_URL}/farmer/marketdata`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAdviceData = async (token) => {
  const iplocation = await getLocationByIP(token);
  const city = iplocation ? iplocation.city : "Lahore"
  
  const response = await axios.get(`${BASE_URL}/farmer/advice?city=${encodeURIComponent(city)}`, {    
    headers : {
      Authorization: `Bearer ${token}` ,
    },
  })
  console.log(response.data)
  return response.data;
}

export const getLocationByIP = async (token) => {
  const response = await axios.get(`${BASE_URL}/util/iplocation`, {
    headers : {
      Authorization: `Bearer ${token}` ,
    },
  })
  return response.data;
}


export const getWeather = async (city , token) => {
  const response = await axios.get(`${BASE_URL}/farmer/weather?city=${encodeURIComponent(city)}`, {
      headers : {
      Authorization: `Bearer ${token}` ,
    },
  }) 
  return response.data
}

export const getforecast = async (city , token) => {
  const response = await axios.get(`${BASE_URL}/farmer/forecast?city=${encodeURIComponent(city)}`, {
      headers : {
      Authorization: `Bearer ${token}` ,
    },
  }) 
  return response.data
}