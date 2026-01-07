import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBrands, getProducts } from "../../services/api";
import Loader from "../../components/Loader";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);

      // Fetch brands and products from API
      const [brandsData, productsData] = await Promise.all([
        getBrands(),
        getProducts(),
      ]);

      // Enhance brands with product counts and statistics
      const enhancedBrands = brandsData.map((brand) => {
        // Filter products that belong to this brand
        const brandProducts = productsData.filter(
          (product) => product.brand === brand.name
        );

        // Calculate statistics
        const totalValue = brandProducts.reduce((sum, p) => sum + p.price, 0);
        const avgPrice =
          brandProducts.length > 0 ? totalValue / brandProducts.length : 0;

        // Get unique categories for this brand
        const categories = [
          ...new Set(brandProducts.map((p) => p.category).filter(Boolean)),
        ];

        // Get featured products (top rated)
        const featuredProducts = brandProducts
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);

        return {
          ...brand,
          count: brandProducts.length,
          avgPrice,
          categories,
          featuredProducts,
          products: brandProducts,
        };
      });

      // Sort by product count (descending)
      enhancedBrands.sort((a, b) => b.count - a.count);

      setBrands(enhancedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter brands by search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="brands-page">
      {/* Hero Section */}
      <section className="brands-hero">
        <div className="hero-content">
          <h1>Shop by Brand</h1>
          <p>Discover premium footwear from world-renowned brands</p>
        </div>
        <div className="hero-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Featured Brands */}
      <section className="featured-brands-section">
        <div className="section-header">
          <h2>Featured Brands</h2>
          <p>{filteredBrands.length} brands available</p>
        </div>

        <div className="brands-grid">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <Link
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                key={brand.id}
                className="brand-card"
                style={{
                  "--brand-color": brand.color || "#667eea",
                  "--brand-bg": brand.bgColor || "#f9fafb",
                }}
              >
                <div className="brand-header">
                  <div className="brand-logo">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <span className="brand-initial">{brand.name[0]}</span>
                    )}
                  </div>
                  <span className="product-badge">{brand.count} Products</span>
                </div>

                <div className="brand-content">
                  <h3>{brand.name}</h3>
                  {brand.tagline && (
                    <p className="brand-tagline">"{brand.tagline}"</p>
                  )}
                  <p className="brand-description">
                    {brand.description || `Explore ${brand.name} collection`}
                  </p>

                  <div className="brand-meta">
                    {brand.founded && (
                      <span className="meta-item">
                        <span className="meta-icon">📅</span>
                        Est. {brand.founded}
                      </span>
                    )}
                    {brand.count > 0 && (
                      <span className="meta-item">
                        <span className="meta-icon">💰</span>
                        Avg. ${brand.avgPrice?.toFixed(0)}
                      </span>
                    )}
                  </div>

                  {brand.categories.length > 0 && (
                    <div className="brand-categories">
                      {brand.categories.slice(0, 3).map((cat) => (
                        <span key={cat} className="category-tag">
                          {cat}
                        </span>
                      ))}
                      {brand.categories.length > 3 && (
                        <span className="category-tag more">
                          +{brand.categories.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Featured Products */}
                {brand.featuredProducts?.length > 0 && (
                  <div className="brand-products">
                    {brand.featuredProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="product-preview">
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="brand-cta">
                  <span>Shop {brand.name}</span>
                  <span className="arrow">→</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-brands">
              <span className="no-brands-icon">🔍</span>
              <p>No brands found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm("")}>Clear Search</button>
            </div>
          )}
        </div>
      </section>

      {/* Brand Stats */}
      <section className="brand-stats-section">
        <h2>Our Brand Partners</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🏷️</span>
            <span className="stat-value">{brands.length}</span>
            <span className="stat-label">Premium Brands</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👟</span>
            <span className="stat-value">
              {brands.reduce((sum, b) => sum + b.count, 0)}
            </span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌍</span>
            <span className="stat-value">
              {new Set(brands.map((b) => b.country).filter(Boolean)).size ||
                "5+"}
            </span>
            <span className="stat-label">Countries</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">100%</span>
            <span className="stat-label">Authentic</span>
          </div>
        </div>
      </section>

      {/* Brand Logos Marquee */}
      {brands.length > 0 && (
        <section className="brand-marquee">
          <div className="marquee-content">
            {brands.concat(brands).map((brand, idx) => (
              <div key={`${brand.id}-${idx}`} className="marquee-item">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <span className="marquee-text">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Brands;
