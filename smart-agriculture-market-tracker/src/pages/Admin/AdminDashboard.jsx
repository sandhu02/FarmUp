import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { marketAPI } from "../../api/adminApi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const { token } = useContext(AuthContext); // get JWT token
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { user } = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    

    // New item form state
    const [newItem, setNewItem] = useState({
        itemName: "",
        category: "vegetable",
        price: "",
        unit: "kg",
        region: ""
    });

    // Auto-hide messages after 5 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 3000); // 3 seconds

            // Cleanup timer on unmount or when messages change
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    // Fetch all items with better error handling
    const fetchItems = async () => {
        try {
            setLoading(true);

            const response = await marketAPI.getItems(token);
            console.log("Full API response:", response);
        
            if (response && response.success) {
                setItems(response.data || []);
                console.log("Items set:", response.data);
            } 
            else {
                throw new Error(response?.message || "Failed to fetch items");
            }
        } 
        catch (error) {
                console.error("Error in fetchItems:", error);
                console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        
            if (error.response?.status === 401) {
                alert("Session expired. Please log in again.");
            } else if (error.response?.status === 403) {
                alert("Access denied. Admin privileges required.");
            } else {
                alert(error.message || "Error fetching items. Check console for details.");
            }
            setItems([]);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("AdminDashboard useEffect running");    
        fetchItems();
        setLoading(false);

    }, [user]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // Add new item
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
        const itemData = {
            itemName: newItem.itemName,
            category: newItem.category,
            price: parseFloat(newItem.price),
            unit: newItem.unit,
            region: newItem.region
        };

        console.log("Adding item:", itemData);
        const response = await marketAPI.createItem(itemData,token);
        
        if (response.success) {
            setItems(prev => [...prev, response.data]);
            setNewItem({
            itemName: "",
            category: "vegetable",
            price: "",
            unit: "kg",
            region: ""
            });
            setShowAddForm(false);
            setSuccessMessage("Item Added successfully");
        }
        } catch (error) {
        console.error("Error adding item:", error);
            setErrorMessage(error.response?.data?.message || "Error adding item");
        }
    };

    // Delete item
    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await marketAPI.deleteItem(itemId, token);
            
            if (response.success) {
            setItems(prev => prev.filter(item => item._id !== itemId));
            alert("Item deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            alert(error.response?.data?.message || "Error deleting item");
        }
        }
    };

    // Update item
    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
        const itemData = {
            itemName: newItem.itemName,
            category: newItem.category,
            price: parseFloat(newItem.price),
            unit: newItem.unit,
            region: newItem.region
        };

        const response = await marketAPI.updateItem(editingItem._id, itemData, token);
        
        if (response.success) {
            setItems(prev => prev.map(item => 
            item._id === response.data._id ? response.data : item
            ));
            setEditingItem(null);
            setNewItem({
            itemName: "",
            category: "vegetable",
            price: "",
            unit: "kg",
            region: ""
            });
            setShowAddForm(false);
            alert("Item updated successfully!");
        }
        } catch (error) {
        console.error("Error updating item:", error);
        alert(error.response?.data?.message || "Error updating item");
        }
    };

    // Start editing an item
    const startEditItem = (item) => {
        setEditingItem(item);
        setNewItem({
        itemName: item.itemName,
        category: item.category,
        price: item.price.toString(),
        unit: item.unit,
        region: item.region
        });
        setShowAddForm(true);
    };

    // Cancel form
    const cancelForm = () => {
        setShowAddForm(false);
        setEditingItem(null);
        setNewItem({
        itemName: "",
        category: "vegetable",
        price: "",
        unit: "kg",
        region: ""
        });
    };

    // Refresh items
    const handleRefresh = () => {
        fetchItems();
    };

    if (loading) {
        return (
        <div className="loading">
            <div>Loading items...</div>
            <button onClick={handleRefresh} className="btn btn-primary" style={{marginTop: '10px'}}>
            Retry Loading
            </button>
            <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
            Check browser console for details
            </div>
        </div>
        );
    }

    return (
        <div className="admin-dashboard">
        <header className="admin-header">
            <div>
                <h1>Admin Dashboard - Market Items</h1>
                {successMessage && <p className="success-text">{successMessage}</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
            <div className="header-actions">
            <button 
                className="btn btn-secondary"
                onClick={handleRefresh}
            >
                Refresh Items
            </button>
            <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
            >
                Add New Item
            </button>
            </div>
        </header>

        {/* Add/Edit Item Form */}
        {showAddForm && (
            <div className="form-overlay">
            <div className="form-container">
                <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
                <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
                <div className="form-group">
                    <label>Item Name:</label>
                    <input
                    type="text"
                    name="itemName"
                    value={newItem.itemName}
                    onChange={handleInputChange}
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select
                    name="category"
                    value={newItem.category}
                    onChange={handleInputChange}
                    required
                    >
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                    <option value="grain">Grain</option>
                    <option value="dairy">Dairy</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Unit:</label>
                    <select
                    name="unit"
                    value={newItem.unit}
                    onChange={handleInputChange}
                    required
                    >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Region:</label>
                    <input
                        type="text"
                        name="region"
                        value={newItem.region}
                        onChange={handleInputChange}
                    required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                    {editingItem ? "Update Item" : "Add Item"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                    Cancel
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        {/* Items List */}
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
            <div className="items-grid">
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
                        <p>Last price: ₹{item.priceHistory[0].price}</p>
                        <small>
                        {new Date(item.priceHistory[0].date).toLocaleDateString()}
                        </small>
                    </div>
                    )}

                    <div className="item-actions">
                    <button 
                        className="btn btn-edit"
                        onClick={() => startEditItem(item)}
                    >
                        Edit
                    </button>
                    <button 
                        className="btn btn-delete"
                        onClick={() => handleDeleteItem(item._id)}
                    >
                        Delete
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

export default AdminDashboard;