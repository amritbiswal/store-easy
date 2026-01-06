import { Link } from 'react-router-dom';
import './CartItem.css';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const productId = item.productId || item.id;

  return (
    <div className="cart-item">
      <Link to={`/products/${productId}`} className="cart-item-image-container">
        <img src={item.thumbnail || item.image} alt={item.name} className="cart-item-image" />
      </Link>

      <div className="cart-item-info">
        <div className="cart-item-main-info">
          <Link to={`/products/${productId}`} className="cart-item-name-link">
            <h3 className="cart-item-name">{item.name}</h3>
          </Link>
          {item.brand && <p className="cart-item-brand">{item.brand}</p>}

          <div className="cart-item-attributes">
            {item.size && (
              <span className="cart-item-attribute">
                <strong>Size:</strong> {item.size}
              </span>
            )}
            {item.color && (
              <span className="cart-item-attribute">
                <strong>Color:</strong> {item.color}
              </span>
            )}
          </div>
        </div>

        <div className="cart-item-actions">
          <div className="cart-item-quantity">
            <button
              className="quantity-btn minus"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="quantity-value">{item.quantity}</span>
            <button
              className="quantity-btn plus"
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <button className="cart-item-remove" onClick={() => onRemove(item.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="cart-item-price-section">
        <p className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</p>
        <p className="cart-item-unit-price">€{item.price.toFixed(2)} / unit</p>
      </div>
    </div>
  );
};

export default CartItem;