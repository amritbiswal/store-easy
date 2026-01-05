import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const isInStock = product.totalStock > 0;

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
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">${product.price.toFixed(2)}</span>
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
