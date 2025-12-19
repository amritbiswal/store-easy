import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Placeholder for product data
  const product = {
    id: id,
    name: 'Sample Product',
    description: 'This is a sample product description.',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/150'
  };

  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetail;