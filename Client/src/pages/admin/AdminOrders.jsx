import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';
import '../../styles/admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'status' or 'tracking'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders || data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setModalType('status');
    setFormData({
      status: order.orderStatus || 'pending',
      location: '',
      description: '',
    });
    setShowModal(true);
  };

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
    setModalType('tracking');
    setFormData({
      status: order.orderStatus || 'pending',
      location: '',
      description: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setFormData({
      status: '',
      location: '',
      description: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!formData.location.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (modalType === 'status') {
        await api.put(`/admin/orders/${selectedOrder._id}`, { 
          orderStatus: formData.status,
          location: formData.location,
          description: formData.description
        });
        toast.success('Order status updated with tracking');
      } else {
        await api.post(`/admin/orders/${selectedOrder._id}/tracking`, {
          location: formData.location,
          description: formData.description
        });
        toast.success('Tracking update added');
      }
      
      fetchOrders();
      closeModal();
    } catch (error) {
      toast.error('Failed to update order');
      console.error(error);
    }
  };

  const viewTracking = (orderId) => {
    window.open(`/orders/${orderId}/tracking`, '_blank');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-page-title">Orders</h2>
        
        {orders.length === 0 ? (
          <div className="no-data">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map(order => (
              <div key={order._id} className="admin-order-card">
                <div className="order-images">
                  {order.products?.slice(0, 1).map((product, idx) => (
                    <img 
                      key={idx}
                      src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} 
                      alt={product.name}
                      className="order-main-image"
                    />
                  ))}
                  {order.products?.length > 1 && (
                    <div className="order-thumbnails">
                      {order.products.slice(1, 5).map((product, idx) => (
                        <img 
                          key={idx}
                          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} 
                          alt={product.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-order-details">
                  <h3>{order.products?.[0]?.name || 'Product'}</h3>
                  <p className="order-description">
                    {order.products?.[0]?.description || 'Quality product'}
                  </p>
                  
                  <div className="order-info-grid">
                    <div className="info-item">
                      <span className="label">Tracking:</span>
                      <span className="value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {order.trackingNumber || 'Pending'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Quantity:</span>
                      <span className="value">{order.products?.[0]?.quantity || 1}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Price:</span>
                      <span className="value">₹ {order.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Payment:</span>
                      <span className="value">{order.paymentMethod || 'netbanking'}</span>
                    </div>
                  </div>

                  <div className="order-meta-grid">
                    <div className="meta-item">
                      <span className="label">UserId:</span>
                      <span className="value">{order.user?._id || order.user}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Name:</span>
                      <span className="value">{order.user?.name || 'Customer'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Email:</span>
                      <span className="value">{order.user?.email || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Mobile:</span>
                      <span className="value">{order.user?.mobile || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="order-dates">
                    <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {order.shippingAddress?.street || order.shippingAddress || 'N/A'}</p>
                    <p><strong>Pincode:</strong> {order.shippingAddress?.postalCode || 'N/A'}</p>
                  </div>

                  <div className="order-status-section">
                    <p className="status-label">Order status: <strong>{order.orderStatus || order.status || 'pending'}</strong></p>
                    <div className="order-actions">
                      <button 
                        className="btn-update-order"
                        onClick={() => openStatusModal(order)}
                      >
                        Update Status
                      </button>
                      <button 
                        className="btn-update-order"
                        onClick={() => openTrackingModal(order)}
                      >
                        Add Tracking
                      </button>
                      <button 
                        className="btn-view-tracking"
                        onClick={() => viewTracking(order._id)}
                      >
                        View Tracking
                      </button>
                      <button 
                        className="btn-cancel-order"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Status Update and Tracking */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === 'status' ? 'Update Order Status' : 'Add Tracking Update'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {modalType === 'status' && (
                <div className="form-group">
                  <label htmlFor="status">Order Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Warehouse, Mumbai Hub, Out for Delivery"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Package has been received at sorting facility"
                  rows="3"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {modalType === 'status' ? 'Update Status' : 'Add Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
