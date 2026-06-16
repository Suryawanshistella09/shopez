import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="page-section profile-page">
      <div className="profile-card">
        <h1>Account profile</h1>
        <div className="profile-row">
          <span>Name</span>
          <strong>{user?.name || 'N/A'}</strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{user?.email || 'N/A'}</strong>
        </div>
        <div className="profile-row">
          <span>Member since</span>
          <strong>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</strong>
        </div>
        <button type="button" className="button button-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </section>
  );
}
