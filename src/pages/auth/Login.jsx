import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Perform login action
    try {
      // Call API to authenticate
      const response = await login({ email, password });
      console.log("Login response:", response);
      
      if (!response.success) {
        throw new Error(response.error || "Login failed");
      }

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
        <div className="register-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
