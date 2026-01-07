import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrdersByUserId } from "../../services/api";
import Loader from "../../components/Loader";
import "./Orders.css";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrdersByUserId(user.id);
        // Sort by date, newest first
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "processing":
        return "status-processing";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>{orders.length} order(s) found</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping!</p>
            <button
              className="shop-now-btn"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div
                  className="order-header"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="order-info">
                    <div className="order-number">
                      <span className="label">Order</span>
                      <span className="value">{order.orderNumber}</span>
                    </div>
                    <div className="order-date">
                      <span className="label">Placed on</span>
                      <span className="value">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="order-total">
                      <span className="label">Total</span>
                      <span className="value">€{order.total.toFixed(2)}</span>
                    </div>
                    <div className="order-status">
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedOrder === order.id ? "▲" : "▼"}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <div className="order-items">
                      <h3>Items</h3>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="item-image"
                          />
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>
                              Size: {item.size} | Color: {item.color}
                            </p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary-details">
                      <div className="summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                          <span>Subtotal</span>
                          <span>€{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>
                            {order.shipping === 0
                              ? "Free"
                              : `€${order.shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span>Tax</span>
                          <span>€{order.tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total</span>
                          <span>€{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="shipping-section">
                        <h3>Shipping Address</h3>
                        <p>{order.customerName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>

                      <div className="payment-section">
                        <h3>Payment</h3>
                        <p>
                          Method:{" "}
                          {order.paymentMethod === "credit_card"
                            ? "Credit Card"
                            : order.paymentMethod}
                        </p>
                        <p>
                          Status:{" "}
                          <span
                            className={`payment-status ${order.paymentStatus}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>

                      {order.trackingNumber && (
                        <div className="tracking-section">
                          <h3>Tracking</h3>
                          <p>{order.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
