import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

// Restaurant API
export const restaurantApi = {
  create: async (data) => {
    const response = await api.post("/api/onboarding/restaurant", data);
    return response.data;
  },
  getMyRestaurant: async () => {
    const response = await api.get("/api/onboarding/my-restaurant");
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/onboarding/restaurant/${id}`, data);
    return response.data;
  },
};

// Menu API
export const menuApi = {
  getAll: async () => {
    const response = await api.get("/api/menus");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/api/menus", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/menus/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/menus/${id}`);
    return response.data;
  },
  uploadMenu: async (file) => {
    const formData = new FormData();
    formData.append("menu", file);
    const response = await api.post("/api/menus/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  getAll: async (filters = {}) => {
    const response = await api.get("/api/orders", { params: filters });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data;
  },
  getKitchenOrders: async () => {
    const response = await api.get("/api/orders/kitchen/active");
    return response.data;
  },
};

// Customers API
export const customersApi = {
  getAll: async () => {
    const response = await api.get("/api/customers");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get("/api/customers/analytics");
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async () => {
    const response = await api.get("/api/analytics/dashboard");
    return response.data;
  },
  getSales: async (params) => {
    const response = await api.get("/api/analytics/sales", { params });
    return response.data;
  },
  getItems: async () => {
    const response = await api.get("/api/analytics/items");
    return response.data;
  },
};

// Inventory API
export const inventoryApi = {
  getAll: async () => {
    const response = await api.get("/api/inventory");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/api/inventory", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/inventory/${id}`, data);
    return response.data;
  },
  getAlerts: async () => {
    const response = await api.get("/api/inventory/alerts");
    return response.data;
  },
};

// Deployment API
export const deploymentApi = {
  deployToVercel: async (restaurantId, config) => {
    const response = await api.post("/api/deployments/deploy-vercel", {
      restaurantId,
      config,
    });
    return response.data;
  },
};

export { api };
// named export
export default api; // default export
