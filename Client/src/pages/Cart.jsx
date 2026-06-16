import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import '../styles/cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const calculateTotals = () => {
    let totalMRP = 0;
    let totalDiscount = 0;

    cart.forEach(item => {
      const itemMRP = item.price * item.quantity;
      const itemDiscount = (item.price * (item.discount || 0) / 100) * item.quantity;
      totalMRP += itemMRP;
      totalDiscount += itemDiscount;
    });

    return {
      totalMRP,
      totalDiscount,
      deliveryCharges: 0,
      finalPrice: totalMRP - totalDiscount,
    };
  };

  const totals = calculateTotals();

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <h2 className="cart-title">Shopping Cart</h2>
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-info">
                    <span>Quantity: {item.quantity}</span>
                  </div>
                  <div className="cart-item-price">
                    <span className="current-price">Price: ₹ {item.price}</span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="cart-summary">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Total MRP:</span>
              <span>₹ {totals.totalMRP.toLocaleString()}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount on MRP:</span>
              <span>- ₹ {totals.totalDiscount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges:</span>
              <span className="free">+ ₹ {totals.deliveryCharges}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Final Price:</span>
              <span>₹ {totals.finalPrice.toLocaleString()}</span>
            </div>
            <button 
              className="btn btn-primary btn-lg checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
