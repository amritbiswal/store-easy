import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductReviews } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);

        // Fetch reviews
        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);

        // Set default selections
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.primaryColor || data.colors[0]);
        }

        // Set the first available size as default
        if (data.sizes && data.sizes.length > 0) {
          const firstAvailableSize = data.sizes.find((s) => s.stock > 0);
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.size);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      thumbnail: product.thumbnail || product.images[0],
    };

    addToCart(cartItem);
    setAddedToCart(true);

    // Reset the notification after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getAvailableStock = () => {
    if (!product || !selectedSize) return 0;
    const sizeOption = product.sizes.find((s) => s.size === selectedSize);
    return sizeOption ? sizeOption.stock : 0;
  };

  const handleQuantityChange = (change) => {
    const availableStock = getAvailableStock();
    const newQuantity = quantity + change;

    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="error-container">
          <h2>Product not found</h2>
          <button onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </div>
      </>
    );
  }

  const availableStock = getAvailableStock();
  const isInStock = availableStock > 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.name}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? "active" : ""}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <div className="product-header">
            <div className="product-header-top">
              <div>
                <h1>{product.name}</h1>
                <p className="product-brand">{product.brand}</p>
              </div>
              <button
                className={`favorite-btn-detail ${isFavorite(product.id) ? 'favorited' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={isFavorite(product.id) ? 'currentColor' : 'none'}
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

            {product.rating && (
              <div className="rating-section">
                <span className="rating-stars">
                  ⭐ {product.rating.toFixed(1)}
                </span>
                {product.reviews > 0 && (
                  <span className="review-count">
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="product-price-section">
            <span className="product-price">€{product.price.toFixed(2)}</span>
            {isInStock ? (
              <span className="stock-status in-stock">In Stock</span>
            ) : (
              <span className="stock-status out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="selection-section">
              <h3>
                Color: <span className="selected-value">{selectedColor}</span>
              </h3>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="selection-section">
              <h3>
                Size:{" "}
                {selectedSize && (
                  <span className="selected-value">{selectedSize}</span>
                )}
              </h3>
              <div className="size-options">
                {product.sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    className={`size-option ${
                      selectedSize === sizeOption.size ? "selected" : ""
                    } ${sizeOption.stock === 0 ? "disabled" : ""}`}
                    onClick={() =>
                      sizeOption.stock > 0 && setSelectedSize(sizeOption.size)
                    }
                    disabled={sizeOption.stock === 0}
                  >
                    {sizeOption.size}
                    {sizeOption.stock === 0 && (
                      <span className="out-badge">Out</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="stock-info">
                  {availableStock} {availableStock === 1 ? "item" : "items"}{" "}
                  available
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          {isInStock && (
            <div className="selection-section">
              <h3>Quantity</h3>
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="action-buttons">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!isInStock || !selectedSize}
            >
              {!isInStock
                ? "Out of Stock"
                : addedToCart
                ? "✓ Added to Cart"
                : "Add to Cart"}
            </button>
            <button
              className="buy-now-btn"
              onClick={() => navigate("/cart")}
              disabled={!isInStock}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="average-rating">
                <span className="rating-number">{product.rating.toFixed(1)}</span>
                <div className="rating-stars-large">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="total-reviews">Based on {product.reviews} reviews</span>
              </div>
            </div>
          </div>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.userName}</span>
                    {review.verified && (
                      <span className="verified-badge">✓ Verified Purchase</span>
                    )}
                  </div>
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {review.title && <h4 className="review-title">{review.title}</h4>}
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
