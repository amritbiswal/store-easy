import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Our E-Commerce Store</h1>
      <p>Discover a wide range of products at unbeatable prices!</p>
      <div className="featured-products">
        <h2>Featured Products</h2>
        {/* Product cards will be rendered here */}
      </div>
    </div>
  );
};

export default Home;