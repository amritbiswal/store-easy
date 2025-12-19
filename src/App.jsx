import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Pages
import CustomerHome from "./pages/customer/Home";
import ProductList from "./pages/customer/ProductList";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import CustomerOrders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";
import Favorites from "./pages/customer/Favorites";

// Admin Pages
import AdminDashboard from "./pages/admin/dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import StockOrders from "./pages/admin/StockOrders";

// Route Guards
import AdminRoute from "./routes/AdminRoute";
import CustomerRoute from "./routes/CustomerRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route element={<CustomerRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/inventory" element={<InventoryManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/customers" element={<CustomerManagement />} />
            <Route path="/admin/stock-orders" element={<StockOrders />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
