import { useState, useEffect } from "react";
import { getOrders, updateOrder } from "../../services/api";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: "",
    paymentStatus: "",
    notes: "",
  });

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const paymentStatusOptions = ["pending", "paid", "failed", "refunded"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const matchesPayment =
        !filterPayment || order.paymentStatus === filterPayment;

      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.orderDate) - new Date(a.orderDate);
        case "oldest":
          return new Date(a.orderDate) - new Date(b.orderDate);
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return statusMap[status?.toLowerCase()] || "status-pending";
  };

  // Get payment status badge class
  const getPaymentClass = (status) => {
    const statusMap = {
      pending: "payment-pending",
      paid: "payment-paid",
      failed: "payment-failed",
      refunded: "payment-refunded",
    };
    return statusMap[status?.toLowerCase()] || "payment-pending";
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Open edit modal
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || "",
    });
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrder) return;

    setIsSubmitting(true);

    try {
      const updatedOrder = {
        ...selectedOrder,
        status: editForm.status,
        paymentStatus: editForm.paymentStatus,
        notes: editForm.notes,
        updatedAt: new Date().toISOString(),
      };

      await updateOrder(selectedOrder.id, updatedOrder);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? updatedOrder : order
        )
      );

      setShowEditModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick status update
  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      await updateOrder(orderId, updatedOrder);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating order status.");
    }
  };

  // Calculate order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled" && o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0),
  };

  if (isLoading) {
    return (
      <div className="order-management-loading">
        <div className="loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      {/* Header */}
      <div className="om-header">
        <div className="om-title">
          <h1>Order Management</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="om-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-value">{orderStats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-value">{orderStats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card processing">
          <span className="stat-icon">⚙️</span>
          <div className="stat-info">
            <span className="stat-value">{orderStats.processing}</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="stat-card shipped">
          <span className="stat-icon">🚚</span>
          <div className="stat-info">
            <span className="stat-value">{orderStats.shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="stat-card delivered">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{orderStats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="stat-card revenue">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">
              €{orderStats.totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="om-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by order #, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">All Payments</option>
          {paymentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="om-table-container">
        <table className="om-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-number">{order.orderNumber}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{order.customerName}</span>
                      <span className="customer-email">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td>{order.items?.length || 0} item(s)</td>
                  <td className="order-date">{formatDate(order.orderDate)}</td>
                  <td className="order-total">€{order.total?.toFixed(2)}</td>
                  <td>
                    <span className={`payment-badge ${getPaymentClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`status-select ${getStatusClass(order.status)}`}
                      value={order.status}
                      onChange={(e) =>
                        handleQuickStatusUpdate(order.id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action view"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action edit"
                        onClick={() => handleEditOrder(order)}
                        title="Edit Order"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="order-details">
              {/* Order Info */}
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order Number</span>
                    <span className="detail-value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Order Date</span>
                    <span className="detail-value">
                      {formatDate(selectedOrder.orderDate)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Status</span>
                    <span className={`payment-badge ${getPaymentClass(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Shipping Address</span>
                    <span className="detail-value">
                      {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode},{" "}
                      {selectedOrder.shippingAddress?.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          Size: {item.size} | Color: {item.color}
                        </span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>€{selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>€{selectedOrder.shipping?.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>€{selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>-€{selectedOrder.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>€{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p className="order-notes">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                className="btn-submit"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditOrder(selectedOrder);
                }}
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Order - {selectedOrder.orderNumber}</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="status">Order Status</label>
                <select
                  id="status"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="paymentStatus">Payment Status</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={editForm.paymentStatus}
                  onChange={handleEditChange}
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  placeholder="Add notes about this order..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;