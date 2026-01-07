import { useState, useEffect } from 'react';
import { getCategories, getBrands } from '../services/api';
import './Sidebar.css';

const Sidebar = ({ onFilterChange, currentFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.filter(cat => cat.isActive));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch brands from API
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const handleCategoryChange = (categorySlug) => {
    const updatedCategories = currentFilters.categories.includes(categorySlug)
      ? currentFilters.categories.filter(c => c !== categorySlug)
      : [...currentFilters.categories, categorySlug];

    onFilterChange({ ...currentFilters, categories: updatedCategories });
  };

  const handleBrandChange = (brandName) => {
    const updatedBrands = currentFilters.brands.includes(brandName)
      ? currentFilters.brands.filter(b => b !== brandName)
      : [...currentFilters.brands, brandName];

    onFilterChange({ ...currentFilters, brands: updatedBrands });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newPriceRange = { ...priceRange, [name]: Number(value) };
    setPriceRange(newPriceRange);
    onFilterChange({ ...currentFilters, priceRange: newPriceRange });
  };

  const handleStockChange = () => {
    onFilterChange({ ...currentFilters, inStockOnly: !currentFilters.inStockOnly });
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 500 });
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 500 },
      inStockOnly: false
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button onClick={handleClearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* Categories Filter */}
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="category-filters">
          {categories.map(category => (
            <label key={category.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={currentFilters.categories.includes(category.slug)}
                onChange={() => handleCategoryChange(category.slug)}
              />
              <span>{category.name}</span>
              <span className="count">({category.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="filter-section">
        <h4>Brands</h4>
        <div className="brand-filters">
          {brands.map(brand => (
            <label key={brand.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={currentFilters.brands.includes(brand.name)}
                onChange={() => handleBrandChange(brand.name)}
              />
              <span>{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-filter">
          <div className="price-inputs">
            <div className="price-input-group">
              <label>Min (€)</label>
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                min="0"
                max="500"
              />
            </div>
            <div className="price-input-group">
              <label>Max (€)</label>
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                min="0"
                max="500"
              />
            </div>
          </div>
          <div className="price-range-display">
            €{priceRange.min} - €{priceRange.max}
          </div>
        </div>
      </div>

      {/* Stock Availability Filter */}
      <div className="filter-section">
        <h4>Availability</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={currentFilters.inStockOnly}
            onChange={handleStockChange}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};

export default Sidebar;
