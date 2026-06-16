const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data || {};
  } catch (error) {
    console.error(`API request failed for ${path}:`, error);
    throw error;
  }
}

function getToken() {
  return localStorage.getItem('shopezToken');
}

export function getProducts() {
  return request('/products');
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerUser(credentials) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function createOrder(order) {
  return request('/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(order),
  });
}
