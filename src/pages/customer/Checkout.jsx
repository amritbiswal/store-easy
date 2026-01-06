import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    apartment: "",
    city: "",
    zipCode: "",
    country: "USA",
  });

  const [errors, setErrors] = useState({});

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const shippingCost = totalAmount > 50 ? 0 : 5.99;
  const finalTotal = totalAmount + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    alert(
      `Order placed successfully!\nTotal: €${finalTotal.toFixed(
        2
      )}\nThank you for your order!`
    );
    clearCart();
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="checkout-page">
          <div className="checkout-container">
            <div className="empty-checkout">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to your cart before checking out</p>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>

          <div className="checkout-content">
            <div className="checkout-form-section">
              <form onSubmit={handleCheckout}>
                <div className="form-section">
                  <h2 className="form-section-title">Contact Information</h2>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? "error" : ""}
                      />
                      {errors.firstName && (
                        <span className="error-message">
                          {errors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? "error" : ""}
                      />
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && (
                        <span className="error-message">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "error" : ""}
                      />
                      {errors.phone && (
                        <span className="error-message">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2 className="form-section-title">Shipping Address</h2>

                  <div className="form-group">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={errors.address ? "error" : ""}
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="apartment">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? "error" : ""}
                      />
                      {errors.city && (
                        <span className="error-message">{errors.city}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="zipCode">Zip Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={errors.zipCode ? "error" : ""}
                      />
                      {errors.zipCode && (
                        <span className="error-message">{errors.zipCode}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="ES">Spain</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="place-order-btn">
                  Place Order - €{finalTotal.toFixed(2)}
                </button>
              </form>
            </div>

            <div className="order-summary-section">
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-image">
                        <img
                          src={item.thumbnail || item.image}
                          alt={item.name}
                        />
                        <span className="item-quantity">{item.quantity}</span>
                      </div>
                      <div className="summary-item-details">
                        <h4>{item.name}</h4>
                        <p className="item-attributes">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " • "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      </div>
                      <div className="summary-item-price">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line">
                  <span>
                    Subtotal ({itemCount} {itemCount > 1 ? "items" : "item"})
                  </span>
                  <span>€{totalAmount.toFixed(2)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "free" : ""}>
                    {shippingCost === 0
                      ? "FREE"
                      : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {totalAmount < 50 && (
                  <p className="free-shipping-note">
                    Add €{(50 - totalAmount).toFixed(2)} more for FREE shipping
                  </p>
                )}

                <div className="summary-divider"></div>

                <div className="summary-line total">
                  <span>Total</span>
                  <span className="summary-total">
                    €{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
