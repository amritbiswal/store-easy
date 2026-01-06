import { useState, useEffect } from "react";
import {
  getProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    category: "",
    brandId: "",
    brand: "",
    gender: "Unisex",
    images: [""],
    sizes: [],
    colors: [""],
    featured: false,
    isNew: false,
    onSale: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Available sizes for shoes
  const availableSizes = [
    "US 5",
    "US 6",
    "US 7",
    "US 8",
    "US 9",
    "US 10",
    "US 11",
    "US 12",
    "US 1Y",
    "US 2Y",
    "US 3Y",
    "US 4Y",
    "US 5Y",
    "US 6Y",
  ];

  const genderOptions = ["Men", "Women", "Unisex", "Kids"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
      ]);
      setProducts(productsData.reverse() || []);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    const matchesBrand = !filterBrand || product.brand === filterBrand;
    const matchesStock =
      !filterStock ||
      (filterStock === "in-stock" && product.totalStock > 30) ||
      (filterStock === "low-stock" &&
        product.totalStock > 0 &&
        product.totalStock <= 30) ||
      (filterStock === "out-of-stock" && product.totalStock === 0);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  // Get stock status
  const getStockStatus = (totalStock) => {
    if (totalStock === 0)
      return { text: "Out of Stock", class: "out-of-stock" };
    if (totalStock <= 30) return { text: "Low Stock", class: "low-stock" };
    return { text: "In Stock", class: "in-stock" };
  };

  // Initialize form for adding
  const handleAddProduct = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      categoryId: "",
      category: "",
      brandId: "",
      brand: "",
      gender: "Unisex",
      images: [""],
      sizes: availableSizes.slice(0, 6).map((size) => ({ size, stock: 0 })),
      colors: [""],
      featured: false,
      isNew: true,
      onSale: false,
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  // Initialize form for editing
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      categoryId: product.categoryId?.toString() || "",
      category: product.category,
      brandId: product.brandId?.toString() || "",
      brand: product.brand,
      gender: product.gender || "Unisex",
      images: product.images?.length > 0 ? product.images : [""],
      sizes: product.sizes || [],
      colors: product.colors?.length > 0 ? product.colors : [""],
      featured: product.featured || false,
      isNew: product.isNew || false,
      onSale: product.onSale || false,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // View product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Confirm delete
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id.toString() === categoryId);
    setFormData((prev) => ({
      ...prev,
      categoryId,
      category: category?.name || "",
    }));
  };

  // Handle brand change
  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    const brand = brands.find((b) => b.id.toString() === brandId);
    setFormData((prev) => ({
      ...prev,
      brandId,
      brand: brand?.name || "",
    }));
  };

  // Handle image changes
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  // Handle color changes
  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const addColorField = () => {
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, ""] }));
  };

  const removeColorField = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, colors: newColors }));
    }
  };

  // Handle size stock changes
  const handleSizeStockChange = (size, stock) => {
    const newSizes = [...formData.sizes];
    const existingIndex = newSizes.findIndex((s) => s.size === size);

    if (existingIndex >= 0) {
      newSizes[existingIndex].stock = parseInt(stock) || 0;
    } else {
      newSizes.push({ size, stock: parseInt(stock) || 0 });
    }

    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.price = "Valid price is required";
    if (!formData.categoryId) errors.categoryId = "Category is required";
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.images.some((img) => img.trim()))
      errors.images = "At least one image URL is required";
    if (!formData.colors.some((color) => color.trim()))
      errors.colors = "At least one color is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Calculate total stock
      const totalStock = formData.sizes.reduce(
        (sum, s) => sum + (parseInt(s.stock) || 0),
        0
      );

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice:
          parseFloat(formData.originalPrice) || parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        category: formData.category,
        brandId: parseInt(formData.brandId),
        brand: formData.brand,
        gender: formData.gender,
        images: formData.images.filter((img) => img.trim()),
        sizes: formData.sizes.filter((s) => s.stock > 0 || s.size),
        colors: formData.colors.filter((c) => c.trim()),
        totalStock,
        featured: formData.featured,
        isNew: formData.isNew,
        onSale:
          formData.onSale ||
          parseFloat(formData.originalPrice) > parseFloat(formData.price),
        rating: selectedProduct?.rating || 0,
        reviews: selectedProduct?.reviews || 0,
        createdAt: selectedProduct?.createdAt || new Date().toISOString(),
      };

      if (showEditModal && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      await fetchData();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      await deleteProduct(selectedProduct.id);
      // await fetchData();
      // deleting locally to avoid extra fetch
      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProduct.id)
      );

      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="product-management-loading">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      {/* Header */}
      <div className="pm-header">
        <div className="pm-title">
          <h1>Product Management</h1>
          <p>{products.length} products in inventory</p>
        </div>
        <button className="btn-add-product" onClick={handleAddProduct}>
          <span>+</span> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="pm-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
        >
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.totalStock);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="product-thumb"
                        />
                        <div className="product-info">
                          <span className="product-name">{product.name}</span>
                          <span className="product-id">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <div className="price-cell">
                        <span className="current-price">
                          ${product.price?.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">
                            ${product.originalPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{product.totalStock}</td>
                    <td>
                      <div className="status-badges">
                        <span className={`stock-badge ${stockStatus.class}`}>
                          {stockStatus.text}
                        </span>
                        {product.featured && (
                          <span className="badge featured">Featured</span>
                        )}
                        {product.isNew && (
                          <span className="badge new">New</span>
                        )}
                        {product.onSale && (
                          <span className="badge sale">Sale</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action view"
                          onClick={() => handleViewProduct(product)}
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-action edit"
                          onClick={() => handleEditProduct(product)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteClick(product)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-products">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{showEditModal ? "Edit Product" : "Add New Product"}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                ✕
              </button>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Basic Info */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? "error" : ""}
                    />
                    {formErrors.name && (
                      <span className="error-text">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={formErrors.description ? "error" : ""}
                    />
                    {formErrors.description && (
                      <span className="error-text">
                        {formErrors.description}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="categoryId">Category *</label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleCategoryChange}
                        className={formErrors.categoryId ? "error" : ""}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.categoryId && (
                        <span className="error-text">
                          {formErrors.categoryId}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="brandId">Brand *</label>
                      <select
                        id="brandId"
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleBrandChange}
                        className={formErrors.brandId ? "error" : ""}
                      >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.brandId && (
                        <span className="error-text">{formErrors.brandId}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="form-section">
                  <h3>Pricing</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Selling Price ($) *</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={formErrors.price ? "error" : ""}
                      />
                      {formErrors.price && (
                        <span className="error-text">{formErrors.price}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="originalPrice">Original Price ($)</label>
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Product Flags</label>
                    <div className="checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        Featured
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                        />
                        New Arrival
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="onSale"
                          checked={formData.onSale}
                          onChange={handleInputChange}
                        />
                        On Sale
                      </label>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="form-group">
                    <label>Colors *</label>
                    {formData.colors.map((color, index) => (
                      <div key={index} className="color-input">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                          placeholder="e.g., Black/White"
                        />
                        {formData.colors.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeColorField(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {formErrors.colors && (
                      <span className="error-text">{formErrors.colors}</span>
                    )}
                    <button
                      type="button"
                      className="btn-add-field"
                      onClick={addColorField}
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div className="form-section full-width">
                  <h3>Product Images</h3>
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-input">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        placeholder="Image URL"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeImageField(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {formErrors.images && (
                    <span className="error-text">{formErrors.images}</span>
                  )}
                  <button
                    type="button"
                    className="btn-add-field"
                    onClick={addImageField}
                  >
                    + Add Image
                  </button>
                </div>

                {/* Sizes & Stock */}
                <div className="form-section full-width">
                  <h3>Sizes & Stock</h3>
                  <div className="sizes-grid">
                    {availableSizes.map((size) => {
                      const sizeData = formData.sizes.find(
                        (s) => s.size === size
                      );
                      return (
                        <div key={size} className="size-stock-item">
                          <span className="size-label">{size}</span>
                          <input
                            type="number"
                            min="0"
                            value={sizeData?.stock || 0}
                            onChange={(e) =>
                              handleSizeStockChange(size, e.target.value)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : showEditModal
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div
            className="modal-content view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Product Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="view-content">
              <div className="view-images">
                <img
                  src={selectedProduct.images?.[0]}
                  alt={selectedProduct.name}
                  className="main-image"
                />
                {selectedProduct.images?.length > 1 && (
                  <div className="thumbnail-images">
                    {selectedProduct.images.slice(1).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedProduct.name} ${index + 2}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="view-details">
                <h3>{selectedProduct.name}</h3>
                <p className="view-brand">
                  {selectedProduct.brand} | {selectedProduct.category}
                </p>

                <div className="view-price">
                  <span className="current">
                    ${selectedProduct.price?.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="original">
                      ${selectedProduct.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="view-description">
                  {selectedProduct.description}
                </p>

                <div className="view-meta">
                  <p className="meta-item">
                    <strong>Gender:</strong> {selectedProduct.gender}
                  </p>
                  <p className="meta-item">
                    <strong>Total Stock:</strong> {selectedProduct.totalStock}{" "}
                    units
                  </p>
                  <p className="meta-item">
                    <strong>Rating:</strong> ⭐ {selectedProduct.rating} (
                    {selectedProduct.reviews} reviews)
                  </p>
                </div>

                <div className="view-colors">
                  <strong>Colors:</strong>
                  <div className="color-list">
                    {selectedProduct.colors?.map((color, index) => (
                      <span key={index} className="color-tag">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="view-sizes">
                  <strong>Sizes:</strong>
                  <div className="size-list">
                    {selectedProduct.sizes?.map((s, index) => (
                      <span
                        key={index}
                        className={`size-tag ${s.stock === 0 ? "out" : ""}`}
                      >
                        {s.size} ({s.stock})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="view-badges">
                  {selectedProduct.featured && (
                    <span className="badge featured">Featured</span>
                  )}
                  {selectedProduct.isNew && (
                    <span className="badge new">New</span>
                  )}
                  {selectedProduct.onSale && (
                    <span className="badge sale">Sale</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                className="btn-submit"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditProduct(selectedProduct);
                }}
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="delete-content">
              <div className="delete-icon">⚠️</div>
              <p>
                Are you sure you want to delete{" "}
                <strong>{selectedProduct.name}</strong>?
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
