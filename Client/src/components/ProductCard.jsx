import { Link } from 'react-router-dom';
import '../styles/products.css';

const ProductCard = ({ product }) => {
  const discount = product.discount || 0;
  const originalPrice = product.price;
  const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} alt={product.name} />
        {discount > 0 && (
          <div className="product-discount-badge">{discount}% off</div>
        )}
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description?.substring(0, 60)}
          {product.description?.length > 60 ? '...' : ''}
        </p>
        <div className="product-pricing">
          <span className="product-price">₹ {discountedPrice.toLocaleString()}</span>
          {discount > 0 && (
            <span className="product-original-price">₹ {originalPrice.toLocaleString()}</span>
          )}
          {discount > 0 && (
            <span className="product-discount-text">({discount}% off)</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
