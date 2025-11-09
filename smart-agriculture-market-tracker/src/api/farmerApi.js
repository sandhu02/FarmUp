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