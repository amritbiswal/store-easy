import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-page">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">New Collection 2026</div>
          <h1 className="hero-title">
            Step Into Style
            <span className="hero-highlight">Premium Footwear</span>
          </h1>
          <p className="hero-subtitle">
            Discover the perfect blend of comfort, quality, and style.
            From casual sneakers to elegant dress shoes - find your perfect match.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="hero-cta primary">
              Shop Collection
            </Link>
            <Link to="/brands" className="hero-cta secondary">
              Explore Brands
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Premium Styles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="features-heading">Why Choose ShoeEasy?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free delivery on all orders over €50. Fast and reliable shipping worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return within 30 days for a full refund. No questions asked.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Shop with confidence. 100% secure payment processing and data protection.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Quality</h3>
              <p>Only authentic products from the world's leading footwear brands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Find Your Perfect Pair?</h2>
          <p className="cta-subtitle">
            Browse our curated collection of premium footwear from top brands.
          </p>
          <Link to="/products" className="cta-button">
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Best online shoe store! Fast delivery, great quality, and amazing customer service."
              </p>
              <div className="testimonial-author">
                <strong>Sarah M.</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Found the perfect running shoes. Comfortable, stylish, and at a great price!"
              </p>
              <div className="testimonial-author">
                <strong>Mike R.</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Love the variety and quality. ShoeEasy is now my go-to for all footwear needs!"
              </p>
              <div className="testimonial-author">
                <strong>Emma L.</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
