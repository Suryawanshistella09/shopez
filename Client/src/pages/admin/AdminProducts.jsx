import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';
import '../../styles/admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, selectedCategories, selectedGenders]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      
      const uniqueCategories = [...new Set(data.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-products-layout">
          {/* Filters Sidebar */}
          <aside className="admin-filters-sidebar">
            <div className="filters-section">
              <h3>Filters</h3>

              {/* Sort By */}
              <div className="filter-group">
                <h4>Sort By</h4>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    value="popular"
                    checked={sortBy === 'popular'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Popularity
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    value="price-low"
                    checked={sortBy === 'price-low'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Price (low to high)
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    value="price-high"
                    checked={sortBy === 'price-high'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Price (high to low)
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    value="discount"
                    checked={sortBy === 'discount'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Discount
                </label>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="filter-group">
                  <h4>Categories</h4>
                  {categories.map(category => (
                    <label key={category} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              )}

              {/* Gender */}
              <div className="filter-group">
                <h4>Gender</h4>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes('Men')}
                    onChange={() => handleGenderChange('Men')}
                  />
                  Men
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes('Women')}
                    onChange={() => handleGenderChange('Women')}
                  />
                  Women
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes('Unisex')}
                    onChange={() => handleGenderChange('Unisex')}
                  />
                  Unisex
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="admin-products-main">
            <div className="admin-header">
              <h2>All Products</h2>
            </div>
            
            <div className="admin-products-grid">
              {filteredProducts.map(product => (
                <div key={product._id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} />
                  </div>
                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p className="product-desc">{product.description?.substring(0, 50)}...</p>
                    <div className="product-price-info">
                      <span className="price">₹ {product.price.toLocaleString()}</span>
                      {product.discount > 0 && (
                        <span className="discount">{product.discount}% off</span>
                      )}
                    </div>
                    <div className="admin-product-actions">
                      <Link to={`/admin/products/edit/${product._id}`} className="btn-update-small">
                        Update
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn-delete-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
