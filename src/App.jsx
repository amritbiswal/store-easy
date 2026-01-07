import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Navbar and footer
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Layouts
import AdminLayout from "./layouts/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Pages
import Home from "./pages/customer/Home";
import ProductList from "./pages/customer/ProductList";
import ProductDetail from "./pages/customer/ProductDetail";
import Categories from "./pages/customer/Categories";
import Brands from "./pages/customer/Brands";

import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";
import Favorites from "./pages/customer/Favorites";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import StockOrders from "./pages/admin/StockOrders";

// Route Guards
// import AdminRoute from "./routes/AdminRoute";
// import CustomerRoute from "./routes/CustomerRoute";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <BrowserRouter>
          <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/brands" element={<Brands />} />

            {/* <Route element={<CustomerRoute />}> */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* </Route> */}

            {/* Admin Routes */}
            {/* <Route element={<AdminRoute />}> */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route
                path="/admin/inventory"
                element={<InventoryManagement />}
              />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/stock-orders" element={<StockOrders />} />
            </Route>
            {/* </Route> */}

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
