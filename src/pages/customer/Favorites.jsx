import { useState, useEffect } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";
import "./Favorites.css";

const Favorites = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteProducts();
    } else {
      setLoading(false);
      setFavoriteProducts([]);
    }
  }, [favorites, user]);

  const fetchFavoriteProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      const filteredProducts = allProducts.filter((product) =>
        favorites.includes(product.id)
      );
      setFavoriteProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching favorite products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Your Favorites</h1>
          <p className="favorites-count">
            {favoriteProducts.length}{" "}
            {favoriteProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {!user ? (
          <div className="empty-favorites">
            <div className="empty-icon">💜</div>
            <h2>Please login to view your favorites</h2>
            <p>Sign in to save and view your favorite products</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">💔</div>
            <h2>No favorites yet</h2>
            <p>
              Start adding products to your favorites by clicking the heart icon
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
