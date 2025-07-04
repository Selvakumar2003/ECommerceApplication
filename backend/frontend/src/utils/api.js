import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  
  // Updated search method to handle all filters
  search: (searchParams = {}) => {
    const params = {};
    
    // Add search query
    if (searchParams.query) {
      params.search = searchParams.query;
    }
    
    // Add category filter
    if (searchParams.category) {
      params.category = searchParams.category;
    }
    
    // Add price range filters
    if (searchParams.minPrice !== undefined && searchParams.minPrice !== null) {
      params.minPrice = searchParams.minPrice;
    }
    if (searchParams.maxPrice !== undefined && searchParams.maxPrice !== null) {
      params.maxPrice = searchParams.maxPrice;
    }
    
    // Add sorting
    if (searchParams.sortBy) {
      params.sortBy = searchParams.sortBy;
    }
    
    return api.get('/products', { params });
  },
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders/create', orderData),
  confirm: (orderId) => api.post(`/orders/${orderId}/confirm`),
  cancel: (orderId) => api.post(`/orders/${orderId}/cancel`),
};

export const paymentAPI = {
  getMethods: () => {
    return Promise.resolve({
      data: {
        methods: [
          {
            id: 'card',
            name: 'Debit/Credit Card',
            description: 'Pay using your bank card',
            icon: '💳',
            processingFee: 0,
            estimatedDelivery: '3-4 days'
          },
          {
            id: 'upi',
            name: 'UPI Payment',
            description: 'Pay using UPI (Google Pay, PhonePe, Paytm)',
            icon: '📱',
            processingFee: 0,
            estimatedDelivery: '3-4 days'
          },
          {
            id: 'cod',
            name: 'Cash on Delivery',
            description: 'Pay when your order is delivered',
            icon: '💵',
            processingFee: 40,
            estimatedDelivery: '5-7 days'
          }
        ]
      }
    });
  },
  validateCard: (accountNumber, pin) => api.post('/payment/validate-card', { accountNumber, pin }),
  validateUPI: (upiId, pin) => api.post('/payment/validate-upi', { upiId, pin }),
  processPayment: (orderId, paymentMethod, paymentDetails) => 
    api.post(`/payment/process/${orderId}`, { paymentMethod, paymentDetails }),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist/add', { productId }),
  remove: (productId) => api.delete(`/wishlist/remove/${productId}`),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (profileData) => api.put('/profile', profileData),
  changePassword: (passwordData) => api.put('/profile/password', passwordData),
  getOrders: (params = {}) => api.get('/profile/orders', { params }),
  getWishlist: () => api.get('/profile/wishlist'),
};

export default api;