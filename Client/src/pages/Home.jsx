import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts } from '../services/productService';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import '../styles/home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const products = await getProducts();
      
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      // Get featured products (first 4 products, or random selection)
      const featured = products.slice(0, 4);
      setFeaturedProducts(featured);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const defaultCategories = ['Fashion', 'Electronics', 'Mobiles', 'Groceries', 'Sports-Equipment'];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="home-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="container">
            <h1 className="welcome-title">Welcome to ShopEZ</h1>
            <p className="welcome-text">
              Discover amazing products across multiple categories. Shop from electronics, fashion, sports equipment, and more!
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Browse through our diverse range of categories</p>
            </div>
            <div className="categories-grid">
              {displayCategories.map((category) => (
                <CategoryCard key={category} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="featured-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Featured Products</h2>
                <Link to="/products" className="view-all-link">
                  View All →
                </Link>
              </div>
              <div className="featured-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banners */}
        <section className="promo-section">
          <div className="container">
            <div className="promo-grid">
              <div className="promo-card promo-primary">
                <div className="promo-content">
                  <h3>Flash Sale</h3>
                  <p>Up to 50% off on selected items</p>
                  <Link to="/products?sort=discount" className="promo-btn">
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="promo-card promo-secondary">
                <div className="promo-content">
                  <h3>New Arrivals</h3>
                  <p>Check out the latest products</p>
                  <Link to="/products" className="promo-btn">
                    Explore
                  </Link>
                </div>
              </div>
              <div className="promo-card promo-tertiary">
                <div className="promo-content">
                  <h3>Free Delivery</h3>
                  <p>On orders above ₹1000</p>
                  <Link to="/products" className="promo-btn">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable shipping on all orders</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💯</div>
                <h3>Quality Products</h3>
                <p>100% authentic products guaranteed</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Payment</h3>
                <p>Your payment information is safe with us</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎁</div>
                <h3>Great Offers</h3>
                <p>Amazing deals and discounts every day</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
