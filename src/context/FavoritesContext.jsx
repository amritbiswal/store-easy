import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { getUserById, updateUserProfile } from "../services/api";
export const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
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
      const userData = await getUserById(user.id);
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
      // Fetch the latest user data to avoid overwriting other fields
      const userData = await getUserById(user.id);
      const { favorites, ...rest } = userData; // Exclude old favorites
      const userBody = { ...rest, favorites: newFavorites };

      const response = await updateUserProfile(user.id, userBody);
      updateUser(response);
    } catch (error) {
      console.error("Error updating favorites:", error);
      // Revert on error
      setFavorites(favorites);
      alert("Failed to update favorites. Please try again.");
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
