import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <Link to="/admin" className="admin-logo">
          ShopEZ (admin)
        </Link>

        <div className="admin-nav-links">
          <Link to="/admin" className="admin-nav-link">
            Home
          </Link>
          <Link to="/admin/users" className="admin-nav-link">
            Users
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
          <Link to="/admin/products" className="admin-nav-link">
            Products
          </Link>
          <Link to="/admin/products/new" className="admin-nav-link">
            New Product
          </Link>
          <button onClick={handleLogout} className="admin-nav-link logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
