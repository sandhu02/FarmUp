import "./FarmerHeader.css"
import { useNavigate } from "react-router-dom";

function FarmerHeader({city}){
    const navigate = useNavigate();
    
    return (
        <header className="farmer-header">
            <div>
                <h1>Market Items</h1>
            </div>
            <div className="header-actions">   
                <p>📍{city}</p>
                <button 
                    className="btn btn-secondary"
                    onClick={() => navigate("/checkWeather" , { state: { city } })}
                >
                    Check Weather
                </button>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/weatherMap")}
                >
                    See Weather Map 
                </button>
            </div>
        </header>
    );
}

export default FarmerHeader;