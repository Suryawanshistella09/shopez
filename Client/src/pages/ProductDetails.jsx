import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../services/productService';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import '../styles/productDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setSelectedImage(data.image);
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please login to continue');
      navigate('/login');
      return;
    }

    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="product-not-found">
            <h2>Product not found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.discount || 0;
  const originalPrice = product.price;
  const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
  const savings = originalPrice - discountedPrice;

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-details-layout">
          {/* Product Images */}
          <div className="product-images-section">
            <div className="main-image">
              <img src={selectedImage || product.image} alt={product.name} />
              {discount > 0 && (
                <div className="discount-badge">{discount}% OFF</div>
              )}
            </div>
            
            {/* Thumbnail images - showing same image multiple times as example */}
            <div className="thumbnail-images">
              <img 
                src={product.image} 
                alt={product.name}
                className={selectedImage === product.image ? 'active' : ''}
                onClick={() => setSelectedImage(product.image)}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="rating-stars">
                {'★'.repeat(Math.floor(product.rating || 4))}
                {'☆'.repeat(5 - Math.floor(product.rating || 4))}
              </div>
              <span className="rating-text">({product.rating || 4} / 5)</span>
            </div>

            <div className="product-pricing-section">
              <div className="price-display">
                <span className="current-price">₹ {discountedPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="original-price">₹ {originalPrice.toLocaleString()}</span>
                    <span className="discount-percent">{discount}% off</span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="savings-text">You save ₹ {savings.toLocaleString()}</p>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-details-info">
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{product.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Stock:</span>
                <span className="info-value stock-status">
                  {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="delivery-info">
              <div className="info-box">
                <h4>🚚 Free Delivery</h4>
                <p>Free shipping on orders above ₹500</p>
              </div>
              <div className="info-box">
                <h4>↩️ Easy Returns</h4>
                <p>7 days return policy</p>
              </div>
              <div className="info-box">
                <h4>💳 Secure Payment</h4>
                <p>100% secure transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
