import './ItemCard.css';
import { useNavigate } from "react-router-dom";


function ItemCard({item}) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/itemDetail`, { state: { item } });
    };

    return (
        <div key={item._id} className="item-card" onClick={handleCardClick}>
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
                <p>Last price: {item.priceHistory[item.priceHistory.length - 2]?.price ? item.priceHistory[item.priceHistory.length - 2].price : "No previous data"}</p>
                <small>
                {item.priceHistory.length > 1 
                    ? new Date(item.priceHistory[item.priceHistory.length - 2].date).toLocaleDateString()
                    : "No previous date"
                }
                </small>
            </div>
            )}

        </div>
    )
}

export default ItemCard;