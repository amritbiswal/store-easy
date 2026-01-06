import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

export const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5005/users/${user.id}`);
      const userData = await response.json();
      setFavorites(userData.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user?.id) {
      alert("Please login to add favorites");
      return;
    }

    const isFavorite = favorites.includes(productId);
    const newFavorites = isFavorite
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    // Optimistic update
    setFavorites(newFavorites);

    try {
      const response = await fetch(`http://localhost:5005/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: newFavorites }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
