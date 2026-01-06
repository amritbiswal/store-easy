import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const isInStock = product.totalStock > 0;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.name}
          className="product-image"
        />
        {!isInStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
        {product.averageRating && (
          <div className="product-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{product.averageRating.toFixed(1)}</span>
          </div>
        )}
        <button
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={favorited ? 'currentColor' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">€{product.price.toFixed(2)}</span>
          </div>

          {isInStock ? (
            <span className="stock-badge in-stock">In Stock</span>
          ) : (
            <span className="stock-badge out-of-stock">Out of Stock</span>
          )}
        </div>

        {product.totalReviews > 0 && (
          <p className="product-reviews">{product.totalReviews} reviews</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
