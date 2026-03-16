// ============================================================
// 📡  api.js  —  Frontend API Service
// src/services/api.js
// ============================================================

const BASE_URL = "http://localhost:5000/api";

// ── Helper ───────────────────────────────────────────────
const getToken = () => localStorage.getItem("swiggy_token");

const req = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ============================================================
// 🔐 AUTH
// ============================================================
export const authAPI = {
  // Register new user
  register: (name, email, password) =>
    req("/auth/register", "POST", { name, email, password }),

  // Login
  login: (email, password) =>
    req("/auth/login", "POST", { email, password }),

  // Save token to localStorage
  saveToken: (token) => localStorage.setItem("swiggy_token", token),

  // Remove token
  logout: () => localStorage.removeItem("swiggy_token"),

  // Check if logged in
  isLoggedIn: () => !!getToken(),
};

// ============================================================
// 👤 USER PROFILE
// ============================================================
export const userAPI = {
  // Get my profile
  getProfile: () => req("/user/profile"),

  // Update name, phone, dob, city
  updateProfile: (data) => req("/user/profile", "PUT", data),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    req("/user/password", "PUT", { currentPassword, newPassword }),
};

// ============================================================
// 📍 ADDRESSES
// ============================================================
export const addressAPI = {
  // Get all my addresses
  getAll: () => req("/user/addresses"),

  // Add new address
  add: (data) => req("/user/addresses", "POST", data),

  // Update address
  update: (id, data) => req(`/user/addresses/${id}`, "PUT", data),

  // Delete address
  delete: (id) => req(`/user/addresses/${id}`, "DELETE"),
};

// ============================================================
// 🛒 CART
// ============================================================
export const cartAPI = {
  // Get saved cart from DB
  get: () => req("/cart"),

  // Save full cart to DB
  save: (items) => req("/cart/save", "POST", { items }),

  // Clear cart
  clear: () => req("/cart", "DELETE"),
};

// ============================================================
// 📦 ORDERS
// ============================================================
export const orderAPI = {
  // Place new order
  place: (orderData) => req("/orders", "POST", orderData),

  // Get my order history
  getAll: () => req("/orders"),

  // Get single order details
  getOne: (id) => req(`/orders/${id}`),
};

// ============================================================
// 🛠️ ADMIN
// ============================================================
export const adminAPI = {
  // Dashboard stats
  getStats: () => req("/admin/stats"),

  // All users
  getUsers: () => req("/admin/users"),

  // All orders
  getOrders: () => req("/admin/orders"),

  // Update order status
  updateOrderStatus: (id, status) =>
    req(`/admin/orders/${id}/status`, "PUT", { status }),
};
