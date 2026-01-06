import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, totalAmount, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart ({itemCount} {itemCount > 1 ? 'items' : 'item'})</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Left side - Cart items */}
            <div className="cart-items-section">
              <div className="cart-items">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
              <button className="continue-shopping-link" onClick={() => navigate('/products')}>
                ← Continue Shopping
              </button>
            </div>

            {/* Right side - Summary */}
            <div className="cart-summary-section">
              <div className="cart-summary">
                <h2 className="summary-title">Summary</h2>

                <div className="summary-line">
                  <span>{itemCount} {itemCount > 1 ? 'items' : 'item'}</span>
                  <span className="summary-amount">€{totalAmount.toFixed(2)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping</span>
                  <span className="summary-amount free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line total">
                  <span>Estimated Total</span>
                  <span className="summary-total">€{totalAmount.toFixed(2)}</span>
                </div>

                <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </button>

                <p className="delivery-note">
                  Delivery times will be specified at the next step
                </p>

                <div className="payment-methods">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;