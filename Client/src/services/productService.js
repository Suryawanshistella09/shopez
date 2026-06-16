import api from './api';

export const getProducts = async () => {
  const { data } = await api.get('/products');
  // Backend returns { message, products }
  return data.products || [];
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  // Backend returns { message, product }
  return data.product;
};

export const getCategories = (products) => {
  const categories = products
    .map((product) => product.category)
    .filter(Boolean);
  return [...new Set(categories)];
};
