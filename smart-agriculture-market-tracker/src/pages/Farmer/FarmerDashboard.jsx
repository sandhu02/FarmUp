import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMarketData } from "../../api/farmerApi";

function FarmerDashboard() {
  const { token } = useContext(AuthContext); // get JWT token
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMarketData(token);

        if (response.success) {
          setMarketData(response.data);
        } else {
          setError(response.message || "Failed to fetch market data");
        }
      } catch (err) {
        console.error(err);
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading market data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="farmer-dashboard">
      <header className="admin-header">
          <div>
              <h1>Market Items</h1>
              {/* {successMessage && <p className="success-text">{successMessage}</p>}
              {errorMessage && <p className="error-text">{errorMessage}</p>} */}
          </div>
          <div className="header-actions">
            <button 
                className="btn btn-secondary"
                // onClick={handleRefresh}
            >
                Check Weather
            </button>
            <button 
                className="btn btn-primary"
                // onClick={() => setShowAddForm(true)}
            >
                See Weather Map 
            </button>
          </div>
      </header>
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
                <div key={item._id} className="item-card">
                    <div className="item-header">
                    <h3 className="item-name">{item.itemName}</h3>
                    <span className={`category-badge ${item.category}`}>
                        {item.category}
                    </span>
                    </div>
                    
                    <div className="item-details">
                    <p className="item-price">Rs. {item.price} / {item.unit}</p>
                    <p className="item-region">Region: {item.region}</p>
                    <p className="item-date">
                        Added: {new Date(item.date).toLocaleDateString()}
                    </p>
                    </div>

                    {item.priceHistory && item.priceHistory.length > 0 && (
                    <div className="price-history">
                        <p>Last price: {item.priceHistory[0].price}</p>
                        <small>
                        {new Date(item.priceHistory[0].date).toLocaleDateString()}
                        </small>
                    </div>
                    )}

                </div>
                ))}
            </div>
            )}
        </div>

        <div className="advice-container">
          
        </div>

      </span>

    </div>
  );
}

export default FarmerDashboard;
