import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
// const API_URL = "http://localhost:5005";
// const API_URL = "https://json-server-backend-fml9.onrender.com";
// ============================================
// PRODUCTS
// ============================================

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Error fetching product");
  }
};

// Get products with filters
export const getFilteredProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.featured) params.append("featured", true);
    if (filters.isNew) params.append("isNew", true);
    if (filters.onSale) params.append("onSale", true);
    if (filters._sort) params.append("_sort", filters._sort);
    if (filters._order) params.append("_order", filters._order);
    if (filters._limit) params.append("_limit", filters._limit);

    const response = await axios.get(
      `${API_URL}/products?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw new Error("Error fetching filtered products");
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL}/products?featured=true&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Error fetching featured products");
  }
};

// Get new arrivals
export const getNewArrivals = async (limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL}/products?isNew=true&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw new Error("Error fetching new arrivals");
  }
};

// Get products on sale
export const getSaleProducts = async (limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL}/products?onSale=true&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sale products:", error);
    throw new Error("Error fetching sale products");
  }
};

// Get products by category
export const getProductsByCategory = async (categorySlug) => {
  try {
    const response = await axios.get(
      `${API_URL}/products?category=${categorySlug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Error fetching products by category");
  }
};

// Get products by brand
export const getProductsByBrand = async (brandName) => {
  try {
    const response = await axios.get(`${API_URL}/products?brand=${brandName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    throw new Error("Error fetching products by brand");
  }
};

// Create product (Admin)
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};

// Update product (Admin)
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};

// Patch product (Admin) - partial update
export const patchProduct = async (id, partialData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, partialData);
    return response.data;
  } catch (error) {
    console.error("Error patching product:", error);
    throw new Error("Error patching product");
  }
};

// Delete product (Admin)
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {};
    // throw new Error("Error deleting product");
  }
};

// ============================================
// CATEGORIES
// ============================================

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Error fetching categories");
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Error fetching category");
  }
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/categories?slug=${slug}`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Error fetching category");
  }
};

// ============================================
// BRANDS
// ============================================

// Get all brands
export const getBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/brands`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Error fetching brands");
  }
};

// Get brand by ID
export const getBrandById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Error fetching brand");
  }
};

// ============================================
// AUTHENTICATION & USERS
// ============================================

// Login user
export const loginUser = async (credentials) => {
  try {
    // json-server doesn't have auth, so we simulate it
    const response = await axios.get(
      `${API_URL}/users?email=${credentials.email}`
    );
    const user = response.data[0];

    if (user && user.password === credentials.password) {
      // Remove password before returning
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token: "mock-jwt-token" };
    }
    throw new Error("Invalid email or password");
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Invalid email or password");
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await axios.get(
      `${API_URL}/users?email=${userData.email}`
    );
    if (existingUser.data.length > 0) {
      throw new Error("Email already exists");
    }

    const newUser = {
      ...userData,
      role: "customer",
      favorites: [],
      cartItems: [],
      createdAt: new Date().toISOString(),
    };

    const response = await axios.post(`${API_URL}/users`, newUser);
    const { password, ...userWithoutPassword } = response.data;
    return { user: userWithoutPassword, token: "mock-jwt-token" };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(error.message || "Error registering user");
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    const { ...userCopy } = response.data;
    return userCopy;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

// Update user profile
export const updateUserProfile = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    const { ...userCopy } = response.data;
    return userCopy;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

// Get all customers (Admin)
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users?role=customer`);
    return response.data.map(({ ...userCopy }) => userCopy);
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error fetching customers");
  }
};

// ============================================
// ORDERS
// ============================================

// Get all orders (Admin)
export const getOrders = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/orders?_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders");
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Error fetching order");
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders");
  }
};

// Get user orders (Customer)
export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Error fetching user orders");
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    // Generate order number
    const ordersResponse = await axios.get(`${API_URL}/orders`);
    const orderCount = ordersResponse.data.length + 1;
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(
      orderCount
    ).padStart(4, "0")}`;

    const newOrder = {
      ...orderData,
      orderNumber,
      status: "pending",
      trackingNumber: generateTrackingNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await axios.post(`${API_URL}/orders`, newOrder);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

// Function to generate a random tracking number of 18 alphanumeric characters
const generateTrackingNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let trackingNumber = "";
  for (let i = 0; i < 18; i++) {
    trackingNumber += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return trackingNumber;
};

// Update order status (Admin)
export const updateOrderStatus = async (id, status, trackingNumber = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const response = await axios.put(`${API_URL}/orders/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Error updating order status");
  }
};

// Update order (Admin)
export const updateOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}`, {
      ...orderData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Error updating order");
  }
};

// Delete order (Admin)
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Error deleting order");
  }
};

// ============================================
// CART
// ============================================

// Get user cart
export const getCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart?userId=${userId}`);
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Error fetching cart");
  }
};

// Create or update cart
export const updateCart = async (userId, cartData) => {
  try {
    // Check if cart exists
    const existingCart = await getCart(userId);

    const cartPayload = {
      userId,
      items: cartData.items,
      subtotal: cartData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      updatedAt: new Date().toISOString(),
    };

    if (existingCart) {
      const response = await axios.put(
        `${API_URL}/cart/${existingCart.id}`,
        cartPayload
      );
      return response.data;
    } else {
      const response = await axios.post(`${API_URL}/cart`, cartPayload);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new Error("Error updating cart");
  }
};

// Add item to cart
export const addToCart = async (userId, item) => {
  try {
    const cart = await getCart(userId);
    let items = cart?.items || [];

    // Check if item already exists
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.color === item.color
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    return await updateCart(userId, { items });
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Error adding to cart");
  }
};

// Remove item from cart
export const removeFromCart = async (userId, productId, size, color) => {
  try {
    const cart = await getCart(userId);
    if (!cart) return null;

    const items = cart.items.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.size === size &&
          item.color === color
        )
    );

    return await updateCart(userId, { items });
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Error removing from cart");
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  userId,
  productId,
  size,
  color,
  quantity
) => {
  try {
    const cart = await getCart(userId);
    if (!cart) return null;

    const items = cart.items.map((item) => {
      if (
        item.productId === productId &&
        item.size === size &&
        item.color === color
      ) {
        return { ...item, quantity };
      }
      return item;
    });

    return await updateCart(userId, { items });
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Error updating cart item");
  }
};

// Clear cart
export const clearCart = async (userId) => {
  try {
    const cart = await getCart(userId);
    if (cart) {
      await axios.delete(`${API_URL}/cart/${cart.id}`);
    }
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Error clearing cart");
  }
};

// ============================================
// FAVORITES / WISHLIST
// ============================================

// Get user favorites
export const getFavorites = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/favorites?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error("Error fetching favorites");
  }
};

// Get user favorites with product details
export const getFavoritesWithProducts = async (userId) => {
  try {
    const favorites = await getFavorites(userId);
    const productIds = favorites.map((f) => f.productId);

    if (productIds.length === 0) return [];

    const products = await Promise.all(
      productIds.map((id) => getProductById(id))
    );

    return products;
  } catch (error) {
    console.error("Error fetching favorites with products:", error);
    throw new Error("Error fetching favorites with products");
  }
};

// Add to favorites
export const addToFavorites = async (userId, productId) => {
  try {
    // Check if already in favorites
    const existing = await axios.get(
      `${API_URL}/favorites?userId=${userId}&productId=${productId}`
    );

    if (existing.data.length > 0) {
      return existing.data[0];
    }

    const response = await axios.post(`${API_URL}/favorites`, {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error("Error adding to favorites");
  }
};

// Remove from favorites
export const removeFromFavorites = async (userId, productId) => {
  try {
    const existing = await axios.get(
      `${API_URL}/favorites?userId=${userId}&productId=${productId}`
    );

    if (existing.data.length > 0) {
      await axios.delete(`${API_URL}/favorites/${existing.data[0].id}`);
    }
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw new Error("Error removing from favorites");
  }
};

// Check if product is in favorites
export const isInFavorites = async (userId, productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/favorites?userId=${userId}&productId=${productId}`
    );
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
};

// ============================================
// REVIEWS
// ============================================

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews?productId=${productId}&_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Error fetching reviews");
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, {
      ...reviewData,
      verified: true,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Error creating review");
  }
};

// Get all reviews (Admin)
export const getAllReviews = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews?_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw new Error("Error fetching all reviews");
  }
};

// Delete review (Admin)
export const deleteReview = async (id) => {
  try {
    await axios.delete(`${API_URL}/reviews/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Error deleting review");
  }
};

// ============================================
// COUPONS
// ============================================

// Validate coupon
export const validateCoupon = async (code, subtotal) => {
  try {
    const response = await axios.get(`${API_URL}/coupons?code=${code}`);
    const coupon = response.data[0];

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.active) {
      throw new Error("Coupon is no longer active");
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      throw new Error("Coupon has expired");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    if (subtotal < coupon.minPurchase) {
      throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    } else if (coupon.type === "free_shipping") {
      discount = 0; // Handle in checkout
    }

    return { coupon, discount };
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw new Error(error.message || "Error validating coupon");
  }
};

// Get all coupons (Admin)
export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_URL}/coupons`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error("Error fetching coupons");
  }
};

// Create coupon (Admin)
export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${API_URL}/coupons`, {
      ...couponData,
      usedCount: 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw new Error("Error creating coupon");
  }
};

// Update coupon (Admin)
export const updateCoupon = async (id, couponData) => {
  try {
    const response = await axios.put(`${API_URL}/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw new Error("Error updating coupon");
  }
};

// Delete coupon (Admin)
export const deleteCoupon = async (id) => {
  try {
    await axios.delete(`${API_URL}/coupons/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw new Error("Error deleting coupon");
  }
};

// ============================================
// ADMIN DASHBOARD
// ============================================

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Error fetching dashboard stats");
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await axios.get(
      `${API_URL}/recent-orders?_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Error fetching recent orders");
  }
};

// Get admin dashboard data
export const getAdminDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin-dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw new Error("Error fetching admin dashboard");
  }
};

// ============================================
// INVENTORY
// ============================================

// Get inventory
export const getInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Error fetching inventory");
  }
};

// Get inventory item by product ID
export const getInventoryByProductId = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/inventory?productId=${productId}`
    );
    return response.data[0];
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    throw new Error("Error fetching inventory item");
  }
};

// Update inventory
export const updateInventory = async (id, inventoryData) => {
  try {
    const response = await axios.put(`${API_URL}/inventory/${id}`, {
      ...inventoryData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw new Error("Error updating inventory");
  }
};

// Get inventory log
export const getInventoryLog = async (productId = null) => {
  try {
    let url = `${API_URL}/inventoryLog?_sort=createdAt&_order=desc`;
    if (productId) {
      url += `&productId=${productId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory log:", error);
    throw new Error("Error fetching inventory log");
  }
};

// Add inventory log entry
export const addInventoryLog = async (logData) => {
  try {
    const response = await axios.post(`${API_URL}/inventoryLog`, {
      ...logData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding inventory log:", error);
    throw new Error("Error adding inventory log");
  }
};

// ============================================
// STOCK ORDERS
// ============================================

// Get stock orders
export const getStockOrders = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/stockOrders?_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock orders:", error);
    throw new Error("Error fetching stock orders");
  }
};

// Get stock order by ID
export const getStockOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stockOrders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock order:", error);
    throw new Error("Error fetching stock order");
  }
};

// Create stock order
export const createStockOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/stockOrders`, {
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating stock order:", error);
    throw new Error("Error creating stock order");
  }
};

// Update stock order status
export const updateStockOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/stockOrders/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating stock order:", error);
    throw new Error("Error updating stock order");
  }
};

// Delete stock order
export const deleteStockOrder = async (id) => {
  try {
    await axios.delete(`${API_URL}/stockOrders/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting stock order:", error);
    throw new Error("Error deleting stock order");
  }
};

// ============================================
// REVENUE & ANALYTICS
// ============================================

// Get revenue data
export const getRevenue = async () => {
  try {
    const response = await axios.get(`${API_URL}/revenue`);
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    throw new Error("Error fetching revenue");
  }
};

// Get sales analytics
export const getSalesAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/sales-analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw new Error("Error fetching sales analytics");
  }
};

// ============================================
// NOTIFICATIONS
// ============================================

// Get notifications
export const getNotifications = async (recipientType, recipientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/notifications?recipientType=${recipientType}&recipientId=${recipientId}&_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Error fetching notifications");
  }
};

// Get admin notifications
export const getAdminNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin-notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    throw new Error("Error fetching admin notifications");
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${id}`, {
      isRead: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Error marking notification as read");
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  recipientType,
  recipientId
) => {
  try {
    const notifications = await getNotifications(recipientType, recipientId);
    const unread = notifications.filter((n) => !n.isRead);

    await Promise.all(
      unread.map((n) =>
        axios.put(`${API_URL}/notifications/${n.id}`, { isRead: true })
      )
    );

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Error marking all notifications as read");
  }
};

// Create notification
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${API_URL}/notifications`, {
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Error creating notification");
  }
};

// ============================================
// STORE INFO
// ============================================

// Get store info
export const getStoreInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/store`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store info:", error);
    throw new Error("Error fetching store info");
  }
};

// Update store info (Admin)
export const updateStoreInfo = async (storeData) => {
  try {
    const response = await axios.put(`${API_URL}/store`, {
      ...storeData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating store info:", error);
    throw new Error("Error updating store info");
  }
};

// ============================================
// SEARCH
// ============================================

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/products?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Error searching products");
  }
};
