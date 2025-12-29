import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PriceHistoryChart from './PriceHistoryChart';
import './ItemDetail.css';

function ItemDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;

    // Check if item exists
    if (!item) {
        return (
            <div className="item-detail-error">
                <h2>Item Not Found</h2>
                <p>The requested item could not be found.</p>
                <button onClick={() => navigate(-1)} className="back-button">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="item-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Dashboard
            </button>
            
            <div className="item-detail-card">
                <div className="item-detail-header">
                    <h1 className="item-detail-title">{item.itemName}</h1>
                    <span className={`category-tag category-${item.category.toLowerCase()}`}>
                        {item.category}
                    </span>
                </div>
                
                <div className="item-detail-info">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Current Price:</span>
                            <span className="info-value price-highlight">
                                Rs. {item.price} / {item.unit}
                            </span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Region:</span>
                            <span className="info-value">{item.region}</span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Category:</span>
                            <span className="info-value category-value">{item.category}</span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Date Added:</span>
                            <span className="info-value">
                                {new Date(item.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {item.priceHistory && item.priceHistory.length > 0 && (
                    <div className="price-history-section">
                        <h2 className="section-title">Price History</h2>
                        <PriceHistoryChart priceHistory={item.priceHistory} />
                        
                        {/* Additional price history stats */}
                        <div className="price-stats">
                            <div className="stat-card">
                                <span className="stat-label">Price Changes</span>
                                <span className="stat-value">{item.priceHistory.length}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">First Recorded</span>
                                <span className="stat-value">
                                    {new Date(item.priceHistory[0].date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Latest Update</span>
                                <span className="stat-value">
                                    {new Date(item.priceHistory[item.priceHistory.length - 1].date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemDetail;