import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';
import '../../styles/admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
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
                    <p><strong>Address:</strong> {order.shippingAddress?.street || 'N/A'}</p>
                    <p><strong>Pincode:</strong> {order.shippingAddress?.postalCode || 'N/A'}</p>
                  </div>

                  <div className="order-status-section">
                    <p className="status-label">Order status: <strong>{order.orderStatus || 'In-transit'}</strong></p>
                    <div className="order-actions">
                      <select 
                        className="status-select"
                        defaultValue={order.orderStatus || 'In-transit'}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="In-transit">In-transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button className="btn-update-order">Update</button>
                      <button 
                        className="btn-cancel-order"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
