import { Link } from 'react-router-dom';
import '../styles/home.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content-wrapper">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to ShopEZ</h1>
            <p className="hero-subtitle">
              Your one-stop destination for quality products at unbeatable prices
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="hero-btn hero-btn-primary">
                Shop Now
              </Link>
              <Link to="/products?sort=discount" className="hero-btn hero-btn-secondary">
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
