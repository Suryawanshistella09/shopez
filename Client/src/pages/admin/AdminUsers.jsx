import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';
import '../../styles/admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data.users || data || []);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-page-title">All Users</h2>
        
        {users.length === 0 ? (
          <div className="no-data">
            <p>No users found</p>
          </div>
        ) : (
          <div className="admin-users-grid">
            {users.map(user => (
              <div key={user._id} className="admin-user-card">
                <div className="user-avatar">
                  <div className="avatar-circle">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="user-info">
                  <h3>{user.name || 'User'}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className="user-role">Role: <strong>{user.role || 'Customer'}</strong></p>
                  <p className="user-date">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="user-actions">
                  <button 
                    className="btn-delete-user"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
