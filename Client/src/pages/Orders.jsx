import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getOrders, deleteOrder } from '../services/orderService';
import Loader from '../components/Loader';
import '../styles/orders.css';

const Orders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
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
    <div className="orders-page">
      <div className="container">
        <div className="orders-layout">
          {/* User Profile Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <h3>Username: {user?.name || 'User'}</h3>
              <p>Email: {user?.email || 'email@example.com'}</p>
              <p>Orders: {orders.length}</p>
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </aside>

          {/* Orders List */}
          <main className="orders-main">
            <h2 className="orders-title">Orders</h2>
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders found</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-images">
                      {order.items?.slice(0, 1).map((item, idx) => (
                        <img 
                          key={idx}
                          src={item.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} 
                          alt={item.product?.name}
                          className="order-main-image"
                        />
                      ))}
                      {order.items?.length > 1 && (
                        <div className="order-thumbnails">
                          {order.items.slice(1, 5).map((item, idx) => (
                            <img 
                              key={idx}
                              src={item.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60'} 
                              alt={item.product?.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="order-details">
                      <h3>{order.items?.[0]?.product?.name || 'Product'}</h3>
                      <div className="order-info">
                        <p><strong>Quantity:</strong> {order.items?.[0]?.quantity || 1}</p>
                        <p><strong>Price:</strong> ₹ {order.totalPrice?.toLocaleString() || '0'}</p>
                        <p><strong>Payment method:</strong> {order.paymentMethod || 'cash_on_delivery'}</p>
                      </div>
                      <div className="order-meta">
                        <p><strong>Address:</strong> {order.shippingAddress || 'N/A'}</p>
                        <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="order-status">
                        <strong>Order status:</strong> {order.status || 'pending'}
                      </p>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Orders;
