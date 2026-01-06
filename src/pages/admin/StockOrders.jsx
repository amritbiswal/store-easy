import { useState, useEffect } from "react";
import {
  getStockOrders,
  createStockOrder,
  updateStockOrderStatus,
  deleteStockOrder,
  getProducts,
  getInventory,
  updateInventory,
  addInventoryLog,
} from "../../services/api";
import "./StockOrders.css";

const StockOrders = () => {
  const [stockOrders, setStockOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    productId: "",
    quantity: "",
    supplier: "",
    estimatedDelivery: "",
    notes: "",
  });

  const statusOptions = [
    "pending",
    "approved",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const supplierOptions = [
    "Nike Distribution Center",
    "Adidas Warehouse",
    "Puma Supply Chain",
    "New Balance Logistics",
    "Timberland Warehouse",
    "Converse Distribution",
    "Vans Supplier",
    "Other",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, productsData, inventoryData] = await Promise.all([
        getStockOrders(),
        getProducts(),
        getInventory(),
      ]);

      setStockOrders(ordersData);
      setProducts(productsData);
      setInventory(inventoryData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort orders
  const filteredOrders = stockOrders
    .filter((order) => {
      const matchesSearch =
        order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "quantity-high":
          return b.quantity - a.quantity;
        case "quantity-low":
          return a.quantity - b.quantity;
        case "delivery":
          return new Date(a.estimatedDelivery) - new Date(b.estimatedDelivery);
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    total: stockOrders.length,
    pending: stockOrders.filter((o) => o.status === "pending").length,
    approved: stockOrders.filter((o) => o.status === "approved").length,
    shipped: stockOrders.filter((o) => o.status === "shipped").length,
    delivered: stockOrders.filter((o) => o.status === "delivered").length,
    totalUnits: stockOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.quantity, 0),
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: "status-pending",
      approved: "status-approved",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return statusMap[status?.toLowerCase()] || "status-pending";
  };

  // Handle create form changes
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product selection
  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === parseInt(productId));

    setCreateForm((prev) => ({
      ...prev,
      productId: productId,
    }));
  };

  // Submit create form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!createForm.productId || !createForm.quantity || !createForm.supplier) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const product = products.find(
        (p) => p.id === parseInt(createForm.productId)
      );

      const orderData = {
        productId: parseInt(createForm.productId),
        productName: product?.name || "Unknown Product",
        quantity: parseInt(createForm.quantity),
        supplier: createForm.supplier,
        estimatedDelivery: createForm.estimatedDelivery
          ? new Date(createForm.estimatedDelivery).toISOString()
          : null,
        notes: createForm.notes,
      };

      const newOrder = await createStockOrder(orderData);

      setStockOrders((prev) => [newOrder, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        productId: "",
        quantity: "",
        supplier: "",
        estimatedDelivery: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating stock order:", error);
      alert("Error creating stock order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateStockOrderStatus(orderId, newStatus);

      // If delivered, update inventory
      if (newStatus === "delivered") {
        const order = stockOrders.find((o) => o.id === orderId);
        if (order) {
          const inventoryItem = inventory.find(
            (i) => i.productId === order.productId
          );
          if (inventoryItem) {
            const previousQuantity = inventoryItem.quantity;
            const newQuantity = previousQuantity + order.quantity;

            await updateInventory(inventoryItem.id, {
              quantity: newQuantity,
              lastRestocked: new Date().toISOString(),
            });

            await addInventoryLog({
              productId: order.productId,
              productName: order.productName,
              sku: inventoryItem.sku,
              adjustmentType: "add",
              previousQuantity,
              newQuantity,
              quantityChanged: order.quantity,
              reason: "Stock Order Received",
              notes: `Stock order from ${order.supplier}`,
              performedBy: "Admin",
            });

            // Update local inventory state
            setInventory((prev) =>
              prev.map((item) =>
                item.id === inventoryItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            );
          }
        }
      }

      setStockOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating order status.");
    }
  };

  // Delete order
  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    setIsSubmitting(true);

    try {
      await deleteStockOrder(selectedOrder.id);
      setStockOrders((prev) =>
        prev.filter((order) => order.id !== selectedOrder.id)
      );
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting stock order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="stock-orders-loading">
        <div className="loader"></div>
        <p>Loading stock orders...</p>
      </div>
    );
  }

  return (
    <div className="stock-orders">
      {/* Header */}
      <div className="so-header">
        <div className="so-title">
          <h1>Stock Orders</h1>
          <p>Manage supplier orders and restock inventory</p>
        </div>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          <span className="btn-plus-icon">+</span> New Stock Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="so-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card approved">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card shipped">
          <span className="stat-icon">🚚</span>
          <div className="stat-info">
            <span className="stat-value">{stats.shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="stat-card delivered">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-value">{stats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="stat-card units">
          <span className="stat-icon">🏷️</span>
          <div className="stat-info">
            <span className="stat-value">
              {stats.totalUnits.toLocaleString()}
            </span>
            <span className="stat-label">Total Units</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="so-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by product or supplier..."
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
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="quantity-high">Quantity (High to Low)</option>
          <option value="quantity-low">Quantity (Low to High)</option>
          <option value="delivery">Delivery Date</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="so-table-container">
        <table className="so-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Est. Delivery</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td className="product-cell">{order.productName}</td>
                  <td className="quantity-cell">
                    <span className="quantity-badge">{order.quantity}</span>
                  </td>
                  <td className="supplier-cell">{order.supplier}</td>
                  <td className="date-cell">
                    {formatDate(order.estimatedDelivery)}
                  </td>
                  <td className="date-cell">{formatDate(order.createdAt)}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusClass(
                        order.status
                      )}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      disabled={
                        order.status === "delivered" ||
                        order.status === "cancelled"
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
                      {order.status === "pending" && (
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteClick(order)}
                          title="Delete Order"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No stock orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content create-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create Stock Order</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="create-form">
              <div className="form-group">
                <label htmlFor="productId">Product *</label>
                <select
                  id="productId"
                  name="productId"
                  value={createForm.productId}
                  onChange={handleProductSelect}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku || `ID: ${product.id}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={createForm.quantity}
                    onChange={handleCreateChange}
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedDelivery">Est. Delivery Date</label>
                  <input
                    type="date"
                    id="estimatedDelivery"
                    name="estimatedDelivery"
                    value={createForm.estimatedDelivery}
                    onChange={handleCreateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier *</label>
                <select
                  id="supplier"
                  name="supplier"
                  value={createForm.supplier}
                  onChange={handleCreateChange}
                  required
                >
                  <option value="">Select a supplier</option>
                  {supplierOptions.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={createForm.notes}
                  onChange={handleCreateChange}
                  placeholder="Add any notes about this order..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div
            className="modal-content view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Stock Order #{selectedOrder.id}</h2>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="order-details">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID</span>
                    <span className="detail-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Est. Delivery</span>
                    <span className="detail-value">
                      {formatDate(selectedOrder.estimatedDelivery)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Product Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Product</span>
                    <span className="detail-value">
                      {selectedOrder.productName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value quantity-highlight">
                      {selectedOrder.quantity} units
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Supplier Information</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Supplier</span>
                    <span className="detail-value">
                      {selectedOrder.supplier}
                    </span>
                  </div>
                </div>
              </div>

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
              {selectedOrder.status !== "delivered" &&
                selectedOrder.status !== "cancelled" && (
                  <button
                    className="btn-submit"
                    onClick={() => {
                      const nextStatus = {
                        pending: "approved",
                        approved: "shipped",
                        shipped: "delivered",
                      };
                      handleStatusUpdate(
                        selectedOrder.id,
                        nextStatus[selectedOrder.status]
                      );
                      setShowViewModal(false);
                    }}
                  >
                    {selectedOrder.status === "pending" && "Approve Order"}
                    {selectedOrder.status === "approved" && "Mark as Shipped"}
                    {selectedOrder.status === "shipped" && "Mark as Delivered"}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Delete Stock Order</h2>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="delete-content">
              <div className="delete-icon">⚠️</div>
              <p>
                Are you sure you want to delete stock order{" "}
                <strong>#{selectedOrder.id}</strong>?
              </p>
              <p className="delete-product">
                Product: {selectedOrder.productName}
                <br />
                Quantity: {selectedOrder.quantity} units
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockOrders;
