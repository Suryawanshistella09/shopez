import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../services/productService';
import { toast } from 'react-toastify';
import '../styles/products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Filter states
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync URL category param with checkbox state
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && selectedCategories.length === 0) {
      // Auto-select the category from URL
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, selectedCategories, selectedGenders, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      // Calculate category counts
      const counts = {};
      data.forEach(product => {
        if (product.category) {
          counts[product.category] = (counts[product.category] || 0) + 1;
        }
      });
      setCategoryCounts(counts);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter - prioritize checkboxes over URL param
    const categoryParam = searchParams.get('category');
    if (selectedCategories.length > 0) {
      // Use checkbox selection
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    } else if (categoryParam) {
      // Use URL parameter only if no checkboxes are selected
      filtered = filtered.filter(p => p.category === categoryParam);
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    // Sort
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
        // popular - keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // Clear URL category parameter when manually changing checkboxes
      if (searchParams.get('category')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('category');
        window.history.replaceState({}, '', `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`);
      }
      
      return updated;
    });
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSortBy('popular');
    
    // Clear URL parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('search');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const hasActiveFilters = () => {
    return selectedCategories.length > 0 || selectedGenders.length > 0 || sortBy !== 'popular';
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-section">
              <div className="filters-header">
                <h3>Filters</h3>
                {hasActiveFilters() && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                )}
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
                      <span className="filter-label">
                        {formatCategoryName(category)}
                        <span className="filter-count">({categoryCounts[category] || 0})</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

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
                  Popular
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
          <main className="products-main">
            <div className="products-header">
              <h2 className="products-title">All Products</h2>
              <p className="products-count">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found</p>
                {hasActiveFilters() && (
                  <button className="btn btn-primary" onClick={clearAllFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
