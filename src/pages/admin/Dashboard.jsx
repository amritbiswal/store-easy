import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats, getRecentOrders } from "../../services/api";
import Loader from "../../components/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardStatsData = await getDashboardStats();
        setStats(dashboardStatsData);
        const recentOrdersData = await getRecentOrders();
        setRecentOrders(recentOrdersData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: "pending",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return statusMap[status?.toLowerCase()] || "pending";
  };

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.firstName || "Admin"}!</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon products">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon orders">🛒</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon customers">👥</div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">
              €
              {stats.totalRevenue?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="dashboard-stat-card warning">
          <div className="dashboard-stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="dashboard-stat-card danger">
          <div className="dashboard-stat-icon low-stock">⚠️</div>
          <div className="stat-info">
            <h3>Low Stock</h3>
            <p className="stat-value">{stats.lowStockProducts}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/admin/products" className="action-card">
            <span className="action-icon">📦</span>
            <span className="action-text">Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <span className="action-icon">📋</span>
            <span className="action-text">View Orders</span>
          </Link>
          <Link to="/admin/inventory" className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-text">Inventory</span>
          </Link>
          <Link to="/admin/customers" className="action-card">
            <span className="action-icon">👥</span>
            <span className="action-text">Customers</span>
          </Link>
          <Link to="/admin/stock-orders" className="action-card">
            <span className="action-icon">🚚</span>
            <span className="action-text">Stock Orders</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="view-all">
            View All →
          </Link>
        </div>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Items</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-number">{order.orderNumber}</td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="customer-email">
                        {order.customerEmail}
                      </span>
                    </td>
                    <td>{order.itemCount} item(s)</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td className="order-amount">€{order.total?.toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
