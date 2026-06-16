import api from './api';

export const getCartItems = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart', { productId, quantity });
  return data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const { data } = await api.put(`/cart/${cartItemId}`, { quantity });
  return data;
};

export const removeCartItem = async (cartItemId) => {
  const { data } = await api.delete(`/cart/${cartItemId}`);
  return data;
};
