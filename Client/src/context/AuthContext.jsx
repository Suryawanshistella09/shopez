import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('shopezToken');
      if (token) {
        const data = await fetchProfile();
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('shopezToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('shopezToken', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    localStorage.setItem('shopezToken', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shopezToken');
    setUser(null);
    // Cart will be automatically cleared by CartContext when user becomes null
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
