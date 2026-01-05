import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 500 },
    inStockOnly: false
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);

        // Check if there's a category query parameter
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setFilters(prev => ({
            ...prev,
            categories: [categoryParam]
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
      result = result.filter(product =>
        filters.categories.includes(product.category.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Filter by stock availability
    if (filters.inStockOnly) {
      result = result.filter(product => product.totalStock > 0);
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  return (
    <div className="product-list-page">

      <div className="page-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />

        <main className="products-main">
          <div className="products-header">
            <h1>All Products</h1>
            <p className="products-count">
              Showing {filteredProducts.length} of {products.length} products
            </p>
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
