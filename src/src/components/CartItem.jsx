import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
        <button className="cart-item-remove" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;