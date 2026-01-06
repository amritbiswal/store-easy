import { useState, useEffect } from "react";
import {
  getInventory,
  updateInventory,
  getInventoryLog,
  addInventoryLog,
  getProducts,
} from "../../services/api";
import "./InventoryManagement.css";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventoryLog, setInventoryLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Modal states
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Adjust stock form state
  const [adjustForm, setAdjustForm] = useState({
    adjustmentType: "add",
    quantity: "",
    reason: "",
    notes: "",
  });

  const reasonOptions = [
    "Purchase Order Received",
    "Manual Adjustment",
    "Inventory Count",
    "Damaged Goods",
    "Return to Supplier",
    "Customer Return",
    "Theft/Loss",
    "Transfer",
    "Other",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [inventoryData, productsData, logData] = await Promise.all([
        getInventory(),
        getProducts(),
        getInventoryLog(),
      ]);

      // Merge inventory with product details
      const mergedInventory = inventoryData.map((inv) => {
        const product = productsData.find((p) => p.id === inv.productId);
        return {
          ...inv,
          productName: product?.name || "Unknown Product",
          productImage: product?.images?.[0] || product?.image || "",
          sku: product?.sku || inv.sku,
          category: product?.category || "",
          brand: product?.brand || "",
          price: product?.price || 0,
        };
      });

      setInventory(mergedInventory);
      setProducts(productsData);
      setInventoryLog(logData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStock = true;
      if (filterStock === "low") {
        matchesStock = item.quantity <= item.lowStockThreshold && item.quantity > 0;
      } else if (filterStock === "out") {
        matchesStock = item.quantity === 0;
      } else if (filterStock === "inStock") {
        matchesStock = item.quantity > item.lowStockThreshold;
      }

      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.productName?.localeCompare(b.productName);
        case "quantity-asc":
          return a.quantity - b.quantity;
        case "quantity-desc":
          return b.quantity - a.quantity;
        case "sku":
          return a.sku?.localeCompare(b.sku);
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    totalProducts: inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStock: inventory.filter(
      (item) => item.quantity <= item.lowStockThreshold && item.quantity > 0
    ).length,
    outOfStock: inventory.filter((item) => item.quantity === 0).length,
    totalValue: inventory.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ),
  };

  // Get stock status
  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: "Out of Stock", class: "out" };
    if (item.quantity <= item.lowStockThreshold)
      return { label: "Low Stock", class: "low" };
    return { label: "In Stock", class: "in" };
  };

  // Open adjust modal
  const handleAdjustStock = (item) => {
    setSelectedItem(item);
    setAdjustForm({
      adjustmentType: "add",
      quantity: "",
      reason: "",
      notes: "",
    });
    setShowAdjustModal(true);
  };

  // Handle adjust form changes
  const handleAdjustChange = (e) => {
    const { name, value } = e.target;
    setAdjustForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit stock adjustment
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem || !adjustForm.quantity || !adjustForm.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const quantity = parseInt(adjustForm.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    setIsSubmitting(true);

    try {
      const previousQuantity = selectedItem.quantity;
      let newQuantity;

      if (adjustForm.adjustmentType === "add") {
        newQuantity = previousQuantity + quantity;
      } else if (adjustForm.adjustmentType === "remove") {
        newQuantity = Math.max(0, previousQuantity - quantity);
      } else {
        newQuantity = quantity; // Set exact quantity
      }

      // Update inventory
      await updateInventory(selectedItem.id, {
        quantity: newQuantity,
        lastRestocked:
          adjustForm.adjustmentType === "add"
            ? new Date().toISOString()
            : selectedItem.lastRestocked,
      });

      // Add to inventory log
      await addInventoryLog({
        productId: selectedItem.productId,
        productName: selectedItem.productName,
        sku: selectedItem.sku,
        adjustmentType: adjustForm.adjustmentType,
        previousQuantity,
        newQuantity,
        quantityChanged:
          adjustForm.adjustmentType === "set"
            ? newQuantity - previousQuantity
            : adjustForm.adjustmentType === "add"
            ? quantity
            : -quantity,
        reason: adjustForm.reason,
        notes: adjustForm.notes,
        performedBy: "Admin", // Replace with actual user
      });

      // Update local state
      setInventory((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                quantity: newQuantity,
                lastRestocked:
                  adjustForm.adjustmentType === "add"
                    ? new Date().toISOString()
                    : item.lastRestocked,
              }
            : item
        )
      );

      // Refresh log
      const newLog = await getInventoryLog();
      setInventoryLog(newLog);

      setShowAdjustModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("Error adjusting stock. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // View item history
  const handleViewHistory = async (item) => {
    setSelectedItem(item);
    setShowHistoryModal(true);
  };

  // Get item's log history
  const getItemHistory = () => {
    if (!selectedItem) return [];
    return inventoryLog.filter((log) => log.productId === selectedItem.productId);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="inventory-loading">
        <div className="loader"></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      {/* Header */}
      <div className="im-header">
        <div className="im-title">
          <h1>Inventory Management</h1>
          <p>Monitor and manage your stock levels</p>
        </div>
        <div className="im-actions">
          <button
            className="btn-history"
            onClick={() => setShowLogModal(true)}
          >
            📋 View Full Log
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="im-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏷️</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalStock.toLocaleString()}</span>
            <span className="stat-label">Total Units</span>
          </div>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon">⚠️</span>
          <div className="stat-info">
            <span className="stat-value">{stats.lowStock}</span>
            <span className="stat-label">Low Stock</span>
          </div>
        </div>
        <div className="stat-card danger">
          <span className="stat-icon">❌</span>
          <div className="stat-info">
            <span className="stat-value">{stats.outOfStock}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
        <div className="stat-card success">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">
              ${stats.totalValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="stat-label">Inventory Value</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="im-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
        >
          <option value="">All Stock Levels</option>
          <option value="inStock">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="sku">Sort by SKU</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="im-table-container">
        <table className="im-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Last Restocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="product-cell">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="product-thumb"
                          />
                        )}
                        <div className="product-info">
                          <span className="product-name">{item.productName}</span>
                          <span className="product-brand">{item.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="sku-cell">{item.sku}</td>
                    <td>{item.category}</td>
                    <td className="quantity-cell">
                      <span
                        className={`quantity ${
                          item.quantity === 0
                            ? "zero"
                            : item.quantity <= item.lowStockThreshold
                            ? "low"
                            : ""
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td>{item.lowStockThreshold}</td>
                    <td>
                      <span className={`status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="date-cell">
                      {formatDate(item.lastRestocked)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action adjust"
                          onClick={() => handleAdjustStock(item)}
                          title="Adjust Stock"
                        >
                          ➕➖
                        </button>
                        <button
                          className="btn-action history"
                          onClick={() => handleViewHistory(item)}
                          title="View History"
                        >
                          📜
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div
            className="modal-content adjust-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Adjust Stock</h2>
              <button
                className="modal-close"
                onClick={() => setShowAdjustModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Product Info */}
              <div className="product-preview">
                {selectedItem.productImage && (
                  <img
                    src={selectedItem.productImage}
                    alt={selectedItem.productName}
                  />
                )}
                <div className="product-details">
                  <h3>{selectedItem.productName}</h3>
                  <p>SKU: {selectedItem.sku}</p>
                  <p className="current-stock">
                    Current Stock: <strong>{selectedItem.quantity}</strong> units
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdjustSubmit} className="adjust-form">
                {/* Adjustment Type */}
                <div className="form-group">
                  <label>Adjustment Type *</label>
                  <div className="adjustment-type-buttons">
                    <button
                      type="button"
                      className={`type-btn add ${
                        adjustForm.adjustmentType === "add" ? "active" : ""
                      }`}
                      onClick={() =>
                        setAdjustForm((prev) => ({
                          ...prev,
                          adjustmentType: "add",
                        }))
                      }
                    >
                      ➕ Add Stock
                    </button>
                    <button
                      type="button"
                      className={`type-btn remove ${
                        adjustForm.adjustmentType === "remove" ? "active" : ""
                      }`}
                      onClick={() =>
                        setAdjustForm((prev) => ({
                          ...prev,
                          adjustmentType: "remove",
                        }))
                      }
                    >
                      ➖ Remove Stock
                    </button>
                    <button
                      type="button"
                      className={`type-btn set ${
                        adjustForm.adjustmentType === "set" ? "active" : ""
                      }`}
                      onClick={() =>
                        setAdjustForm((prev) => ({
                          ...prev,
                          adjustmentType: "set",
                        }))
                      }
                    >
                      🎯 Set Exact
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label htmlFor="quantity">
                    {adjustForm.adjustmentType === "set"
                      ? "New Quantity *"
                      : "Quantity *"}
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={adjustForm.quantity}
                    onChange={handleAdjustChange}
                    placeholder={
                      adjustForm.adjustmentType === "set"
                        ? "Enter new stock quantity"
                        : "Enter quantity to adjust"
                    }
                  />
                  {adjustForm.quantity && (
                    <span className="quantity-preview">
                      New stock will be:{" "}
                      <strong>
                        {adjustForm.adjustmentType === "add"
                          ? selectedItem.quantity + parseInt(adjustForm.quantity)
                          : adjustForm.adjustmentType === "remove"
                          ? Math.max(
                              0,
                              selectedItem.quantity - parseInt(adjustForm.quantity)
                            )
                          : parseInt(adjustForm.quantity)}
                      </strong>{" "}
                      units
                    </span>
                  )}
                </div>

                {/* Reason */}
                <div className="form-group">
                  <label htmlFor="reason">Reason *</label>
                  <select
                    id="reason"
                    name="reason"
                    value={adjustForm.reason}
                    onChange={handleAdjustChange}
                  >
                    <option value="">Select a reason</option>
                    {reasonOptions.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label htmlFor="notes">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={adjustForm.notes}
                    onChange={handleAdjustChange}
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowAdjustModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Adjustment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Item History Modal */}
      {showHistoryModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div
            className="modal-content history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Stock History - {selectedItem.productName}</h2>
              <button
                className="modal-close"
                onClick={() => setShowHistoryModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="history-list">
                {getItemHistory().length > 0 ? (
                  getItemHistory().map((log, index) => (
                    <div key={log.id || index} className="history-item">
                      <div className="history-icon">
                        {log.adjustmentType === "add"
                          ? "📈"
                          : log.adjustmentType === "remove"
                          ? "📉"
                          : "🎯"}
                      </div>
                      <div className="history-details">
                        <div className="history-header">
                          <span
                            className={`history-type ${log.adjustmentType}`}
                          >
                            {log.adjustmentType === "add"
                              ? `+${log.quantityChanged}`
                              : log.adjustmentType === "remove"
                              ? log.quantityChanged
                              : `Set to ${log.newQuantity}`}
                          </span>
                          <span className="history-date">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                        <p className="history-reason">{log.reason}</p>
                        <p className="history-change">
                          {log.previousQuantity} → {log.newQuantity} units
                        </p>
                        {log.notes && (
                          <p className="history-notes">Note: {log.notes}</p>
                        )}
                        <p className="history-by">By: {log.performedBy}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-history">No history available for this item</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Inventory Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div
            className="modal-content log-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Inventory Activity Log</h2>
              <button
                className="modal-close"
                onClick={() => setShowLogModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="log-table-container">
                <table className="log-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Type</th>
                      <th>Change</th>
                      <th>Stock</th>
                      <th>Reason</th>
                      <th>By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryLog.length > 0 ? (
                      inventoryLog.map((log, index) => (
                        <tr key={log.id || index}>
                          <td className="date-cell">
                            {formatDate(log.createdAt)}
                          </td>
                          <td>{log.productName}</td>
                          <td className="sku-cell">{log.sku}</td>
                          <td>
                            <span
                              className={`type-badge ${log.adjustmentType}`}
                            >
                              {log.adjustmentType}
                            </span>
                          </td>
                          <td
                            className={`change-cell ${
                              log.quantityChanged >= 0 ? "positive" : "negative"
                            }`}
                          >
                            {log.quantityChanged >= 0 ? "+" : ""}
                            {log.quantityChanged}
                          </td>
                          <td>
                            {log.previousQuantity} → {log.newQuantity}
                          </td>
                          <td>{log.reason}</td>
                          <td>{log.performedBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          No inventory log entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowLogModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;