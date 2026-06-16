import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('shopezUser');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('shopezToken');
    localStorage.removeItem('shopezUser');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <header className="app-header-new">
      <div className="header-top">
        <div className="brand-new" onClick={() => navigate('/')}>ShopEz</div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Electronics, Fashion, mobiles, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        {!userName && (
          <Link to="/login" className="login-btn">Login</Link>
        )}
        {userName && (
          <button type="button" className="login-btn" onClick={handleLogout}>
            {userName} (Logout)
          </button>
        )}
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        {!userName && <Link to="/register">Register</Link>}
      </nav>
    </header>
  );
}
