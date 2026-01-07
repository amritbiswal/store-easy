import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "../../services/api";
import Loader from "../../components/Loader";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      // Fetch categories from API
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      // Enhance categories with product counts and featured products
      const enhancedCategories = categoriesData.map((category) => {
        // Filter products that belong to this category
        const categoryProducts = productsData.filter(
          (product) =>
            product.category === category.name ||
            product.category === category.slug
        );

        // Calculate price range
        const prices = categoryProducts.map((p) => p.price);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

        // Get featured products (top rated or first 3)
        const featuredProducts = categoryProducts
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);

        return {
          ...category,
          count: categoryProducts.length,
          minPrice,
          maxPrice,
          featuredProducts,
          products: categoryProducts,
        };
      });

      // Sort by product count (descending)
      enhancedCategories.sort((a, b) => b.count - a.count);

      setCategories(enhancedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="categories-page">
      {/* Hero Section */}
      <section className="categories-hero">
        <div className="hero-content">
          <h1>Shop by Category</h1>
          <p>Find the perfect footwear for every occasion and activity</p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
            <span className="stat-label">Products</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-page-section">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(
                category.slug || category.name
              )}`}
              key={category.id}
              className="category-card"
              style={{ "--card-color": category.color || "#667eea" }}
            >
              <div className="category-image">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="category-placeholder">
                    <span className="category-icon">
                      {category.icon || "👟"}
                    </span>
                  </div>
                )}
                <div className="category-overlay">
                  <span className="view-products">View Products →</span>
                </div>
              </div>
              <div className="category-content">
                <div className="category-header">
                  <span className="category-icon-small">
                    {category.icon || "👟"}
                  </span>
                  <h3>{category.name}</h3>
                </div>
                <p className="category-description">
                  {category.description ||
                    `Explore our ${category.name} collection`}
                </p>
                <div className="category-meta">
                  <span className="product-count">
                    {category.count}{" "}
                    {category.count === 1 ? "Product" : "Products"}
                  </span>
                  {category.count > 0 && (
                    <span className="price-range">
                      ${category.minPrice?.toFixed(0)} - $
                      {category.maxPrice?.toFixed(0)}
                    </span>
                  )}
                </div>
                {/* Featured Products Preview */}
                {category.featuredProducts?.length > 0 && (
                  <div className="featured-preview">
                    {category.featuredProducts.map((product, idx) => (
                      <div
                        key={product.id}
                        className="preview-item"
                        style={{ zIndex: 3 - idx }}
                      >
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="no-categories">
            <span className="no-data-icon">📂</span>
            <p>No categories found</p>
          </div>
        )}
      </section>

      {/* Why Shop by Category */}
      <section className="why-categories">
        <h2>Why Shop by Category?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">🎯</span>
            <h3>Find Exactly What You Need</h3>
            <p>
              Browse shoes designed specifically for your activity or style
              preference
            </p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">⚡</span>
            <h3>Quick Navigation</h3>
            <p>Jump directly to products that match your requirements</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">💡</span>
            <h3>Discover New Styles</h3>
            <p>Explore categories you might not have considered before</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
