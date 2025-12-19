import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, totalAmount } = useContext(CartContext);

  return (
    <div className="cart">
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-total">
            <h2>Total: ${totalAmount.toFixed(2)}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;