import axios from "axios";
import { BASE_URL } from "./base_url";

export async function loginUser (username, password, role) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
      role,
    });

    // response.data contains the backend response
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

export async function registerUser (name, username, password, role) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      username,
      password,
      role,
    });

    // response.data contains the backend response
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

