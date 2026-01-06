import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">👟</span>
            <span className="logo-text">StoreEasy</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
              <li>
                <Link to="/favorites">Favorites</Link>
              </li>
            </>
          )}
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Cart with Badge */}
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile">
                <span className="user-icon">👤</span>
                <span className="user-name">
                  {user.firstName || user.username}
                </span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
