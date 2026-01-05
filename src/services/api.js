import axios from "axios";

// const API_URL = 'https://api.example.com'; // Replace with your actual API URL
const API_URL = "http://localhost:5005"; // Local API URL for json-server

// Function to get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching products");
  }
};

// Function to get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching product");
  }
};

// Function to create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw new Error("Error creating order");
  }
};

// Function to get user orders
export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user orders");
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error("Error registering user");
  }
};

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error("Error logging in user");
  }
};

// Function to get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};
