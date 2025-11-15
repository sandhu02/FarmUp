import './ItemCard.css';

function ItemCard({item}) {
    return (
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
    )
}

export default ItemCard;