import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;