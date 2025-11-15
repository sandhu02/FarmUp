import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAdviceData, getLocationByIP, getMarketData } from "../../api/farmerApi";
import ItemCard from "./ItemCard";
import FarmerHeader from "./FarmerHeader";
import "./FarmerDashboard.css"

function FarmerDashboard() {
  const { token } = useContext(AuthContext); // get JWT token
  const [items, setItems] = useState([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    fetchItems();
    fetchAdvice();
    fetchLocation();
  }, [token]);
  
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000); // 5 seconds
      
      // Cleanup timer on unmount or when messages change
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);
  
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getMarketData(token);

      if (response.success) {
        setItems(response.data || []);
      } else {
        setErrorMessage(response.message || "Failed to fetch market data");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Fetching Items: Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    try{
      const response = await getAdviceData(token);
      if (response.success){
        setAdvice(response.text)
      }
      else {
        console.log(response.message)
      }
    }
    catch (err) {
      console.error(err);
      setErrorMessage("Fetching Advice: Server error, please try again");
    }
  };
  
  const fetchLocation = async () => {
    try{
      const response = await getLocationByIP(token)
      if (response.success){
        setCity(response.city)
      }
      else {
        console.log(response.message)
      }
    }
    catch (err) {
      console.error(err);
      setErrorMessage("Fetching City: Server error");
    }
  };

  const handleRefresh = () => {
        fetchItems();
  };


  if (loading) return <p>Loading market data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="farmer-dashboard">
      <FarmerHeader city={city}/>
      {successMessage && <p className="success-text">{successMessage}</p>}
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <span>
        <div className="items-container">
            {items.length === 0 ? (
            <div className="no-items">
                <h3>No items found</h3>
                <p>Add your first item using the "Add New Item" button above</p>
                <button onClick={handleRefresh} className="btn btn-primary">
                Refresh
                </button>
            </div>
            ) : (
            <div className="items-list">
                {items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>
            )}
        </div>

        <div className="advice-container">
          <h2>⚠️ Remember</h2>
          {advice}
        </div>

      </span>

    </div>
  );
}

export default FarmerDashboard;
