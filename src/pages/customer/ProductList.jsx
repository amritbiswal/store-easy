import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/ProductCard";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 500 },
    inStockOnly: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);

        // Check if there's a category query parameter
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          setFilters((prev) => ({
            ...prev,
            categories: [categoryParam],
          }));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    // Apply filters whenever filters or products change
    let result = [...products];

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category.toLowerCase())
      );
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );

    // Filter by stock availability
    if (filters.inStockOnly) {
      result = result.filter((product) => product.totalStock > 0);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "reviews":
        result.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(result);
  }, [filters, products, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="product-list-page">
      <div
        className={`page-container ${!sidebarOpen ? "sidebar-collapsed" : ""}`}
      >
        <div className={`sidebar-wrapper ${sidebarOpen ? "open" : "closed"}`}>
          <Sidebar
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        <main className="products-main">
          <div className="products-header">
            <div className="header-top">
              <button
                className="toggle-filters-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Hide filters" : "Show filters"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6h18M3 12h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {sidebarOpen ? "Hide filters" : "Show filters"}
              </button>

              <div className="header-info">
                <h1>Men's Sneakers ({filteredProducts.length})</h1>
              </div>
            </div>

            <div className="products-controls">
              <p className="products-count">
                {filteredProducts.length}{" "}
                {filteredProducts.length > 1 ? "products" : "product"}
              </p>

              <div className="sort-container">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Ratings</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h2>No products found</h2>
              <p>Try adjusting your filters to see more products</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
