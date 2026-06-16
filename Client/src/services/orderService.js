import api from './api';

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get('/orders');
  return data.orders || [];
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order || data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}`, { status });
  return data.order || data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
};
