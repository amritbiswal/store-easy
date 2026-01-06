import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, getUserById } from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // If credentials has email/password, use API login
      if (credentials.email && credentials.password) {
        const response = await loginUser(credentials);
        
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        
        return { success: true, user: response.user };
      }
      
      // If user object is passed directly (from register)
      if (credentials.id) {
        setUser(credentials);
        setToken("mock-jwt-token");
        localStorage.setItem("user", JSON.stringify(credentials));
        localStorage.setItem("token", "mock-jwt-token");
        
        return { success: true, user: credentials };
      }
      
      throw new Error("Invalid credentials format");
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      const freshUser = await getUserById(user.id);
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};