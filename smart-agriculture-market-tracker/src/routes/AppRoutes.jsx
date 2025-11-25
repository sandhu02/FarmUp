import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register"; 
import AdminDashboard from "../pages/Admin/AdminDashboard";
import FarmerDashboard from "../pages/Farmer/FarmerDashboard";
import WeatherMap from "../pages/Farmer/WeatherMap";
import CheckWeather from "../pages/Farmer/CheckWeather";
import ItemDetail from "../pages/Farmer/ItemDetail";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>; // Or your custom loader
  }
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/admin"
      element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/farmer"
      element={
        <PrivateRoute role="farmer">
          <FarmerDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/ItemDetail"
      element={
        <PrivateRoute role="farmer">
          <ItemDetail />
        </PrivateRoute>
      }
    />
    <Route
      path="/weatherMap"
      element={
        <PrivateRoute role="farmer">
          <WeatherMap />
        </PrivateRoute>
      }
    />
    <Route
      path="/checkWeather"
      element={
        <PrivateRoute role="farmer">
          <CheckWeather />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;

