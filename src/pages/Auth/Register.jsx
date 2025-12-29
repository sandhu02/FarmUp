import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import "./Login.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "farmer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await registerUser(
                formData.name,
                formData.username,
                formData.password,
                formData.role
            );

            if (response.success) {
                setSuccessMessage("Registration successful");
            } else {
                setError(response.message || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            setError("Server error, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
        <div className="card">
            <h2 className="login-title">Smart Agriculture Market Tracker</h2>

            <form onSubmit={handleSubmit} className="login-form">
            <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            
            <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {successMessage && <p className="success-text">{successMessage}</p>}
            {error && <p className="error-text">{error}</p>}

            <button
                type="button"
                onClick={() => navigate("/login")}
                disabled={loading}
                className="register-btn"
            >
                Login
            </button>

            <button type="submit" disabled={loading} className="login-btn">
                {loading ? "Registering..." : "Register"}
            </button>
            
            </form>
        </div>
        </div>
    );
};

export default Register;
