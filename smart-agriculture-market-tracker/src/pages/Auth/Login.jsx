import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "farmer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "role") {
    // Checkbox toggles role between admin/farmer
    setFormData((prev) => ({
      ...prev,
      role: checked ? "admin" : "farmer",
    }));
  } else {
    // Handle text/password inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(
        formData.username,
        formData.password,
        formData.role
      );

      if (response.success) {
        // Store user + token in context and localStorage
        setUser(response.user);
        setToken(response.token);

        // Navigate to dashboard
        navigate(response.user.role === "admin" ? "/admin" : "/farmer");
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
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

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="role"
              name="role"
              checked={formData.role === "admin" }
              onChange={handleChange}
            />
            <label htmlFor="role">Login as Admin</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="button"
            onClick={() => navigate("/register")}
            disabled={loading}
            className="register-btn"
          >
            Register
          </button>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
