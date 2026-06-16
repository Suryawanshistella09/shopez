import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column">
              <h3 className="footer-logo">ShopEZ</h3>
              <p className="footer-description">
                Your one-stop destination for quality products across multiple categories. 
                Shop with confidence and enjoy amazing deals every day!
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/orders">Orders</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-column">
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-links">
                <li><Link to="/products?category=Mobiles">Mobiles</Link></li>
                <li><Link to="/products?category=Electronics">Electronics</Link></li>
                <li><Link to="/products?category=Fashion">Fashion</Link></li>
                <li><Link to="/products?category=Sports-Equipment">Sports</Link></li>
                <li><Link to="/products?category=Groceries">Groceries</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt />
                  <span>123 Shopping Street, City, Country</span>
                </li>
                <li>
                  <FaPhone />
                  <span>+1 234 567 8900</span>
                </li>
                <li>
                  <FaEnvelope />
                  <span>support@shopez.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} ShopEZ. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
