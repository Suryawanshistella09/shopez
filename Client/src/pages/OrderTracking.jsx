import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from '../components/Loader';
import { FaCheckCircle, FaCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import '../styles/tracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}/tracking`);
      setTracking(data.tracking);
    } catch (error) {
      toast.error('Failed to load tracking information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fbbf24',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status, isActive) => {
    if (isActive || status === 'delivered') {
      return <FaCheckCircle />;
    }
    return <FaCircle />;
  };

  if (loading) {
    return <Loader />;
  }

  if (!tracking) {
    return (
      <div className="tracking-page">
        <div className="container">
          <p>Tracking information not found</p>
        </div>
      </div>
    );
  }

  const sortedHistory = [...(tracking.trackingHistory || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="tracking-page">
      <div className="container">
        <button className="btn btn-secondary mb-20" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </button>

        <div className="tracking-card">
          {/* Header */}
          <div className="tracking-header">
            <h1>Order Tracking</h1>
            <div className="tracking-number">
              <strong>Tracking Number:</strong> {tracking.trackingNumber}
            </div>
          </div>

          {/* Status Overview */}
          <div className="status-overview">
            <div className="current-status">
              <h3>Current Status</h3>
              <span 
                className="status-badge-large" 
                style={{ backgroundColor: getStatusColor(tracking.status) }}
              >
                {tracking.status?.toUpperCase()}
              </span>
            </div>

            {tracking.estimatedDelivery && !tracking.actualDelivery && (
              <div className="delivery-info">
                <FaClock />
                <div>
                  <strong>Estimated Delivery</strong>
                  <p>{new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            )}

            {tracking.actualDelivery && (
              <div className="delivery-info delivered">
                <FaCheckCircle />
                <div>
                  <strong>Delivered On</strong>
                  <p>{new Date(tracking.actualDelivery).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="shipping-address">
            <FaMapMarkerAlt />
            <div>
              <strong>Shipping Address</strong>
              <p>{tracking.shippingAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          {tracking.items && tracking.items.length > 0 && (
            <div className="order-items">
              <h3>Order Items</h3>
              <div className="items-grid">
                {tracking.items.map((item, idx) => (
                  <div key={idx} className="item-card">
                    <img 
                      src={item.product?.image || 'https://via.placeholder.com/100'} 
                      alt={item.product?.name}
                    />
                    <div className="item-details">
                      <h4>{item.product?.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total:</strong> ₹{tracking.totalPrice?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="tracking-timeline">
            <h3>Tracking History</h3>
            <div className="timeline">
              {sortedHistory.map((entry, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-icon" style={{ color: getStatusColor(entry.status) }}>
                    {getStatusIcon(entry.status, idx === 0)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-status">{entry.status?.toUpperCase()}</span>
                      <span className="timeline-time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {entry.location && (
                      <div className="timeline-location">
                        <FaMapMarkerAlt /> {entry.location}
                      </div>
                    )}
                    {entry.description && (
                      <p className="timeline-description">{entry.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
