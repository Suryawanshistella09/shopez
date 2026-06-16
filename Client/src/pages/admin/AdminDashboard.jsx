import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users count
      const usersRes = await api.get('/admin/users');
      const productsRes = await api.get('/products');
      const ordersRes = await api.get('/admin/orders');

      setStats({
        totalUsers: usersRes.data?.users?.length || usersRes.data?.length || 0,
        totalProducts: productsRes.data?.products?.length || productsRes.data?.length || 0,
        totalOrders: ordersRes.data?.orders?.length || ordersRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1 className="admin-title">ShopEZ (admin)</h1>
        
        <div className="dashboard-grid">
          {/* Total Users Card */}
          <div className="stat-card">
            <div className="stat-content">
              <h3>Total users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <Link to="/admin/users" className="stat-btn">
              View all
            </Link>
          </div>

          {/* All Products Card */}
          <div className="stat-card">
            <div className="stat-content">
              <h3>All Products</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
            <Link to="/admin/products" className="stat-btn">
              View all
            </Link>
          </div>

          {/* All Orders Card */}
          <div className="stat-card">
            <div className="stat-content">
              <h3>All Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
            <Link to="/admin/orders" className="stat-btn">
              View all
            </Link>
          </div>

          {/* Add Product Card */}
          <div className="stat-card">
            <div className="stat-content">
              <h3>Add Product</h3>
              <p className="stat-subtitle">(new)</p>
            </div>
            <Link to="/admin/products/new" className="stat-btn">
              Add now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
