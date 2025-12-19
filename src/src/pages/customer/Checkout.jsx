import React from 'react';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, totalAmount } = useContext(CartContext);

  const handleCheckout = () => {
    // Logic for handling checkout process
    alert('Proceeding to payment...');
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-details">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
        <h3>Total Amount: ${totalAmount}</h3>
      </div>
      <button onClick={handleCheckout} className="checkout-button">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;