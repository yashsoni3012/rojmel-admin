import { env } from '../config/env.js';
import { storage } from './storage.js';

const KEY = 'session';

// Clean up any legacy registered_users key from localStorage if it exists
try {
  storage.remove('registered_users');
} catch {
  // ignore
}

export const authService = {
  /**
   * Login API: POST /api/auth/login
   * Format:
   * {
   *   "email": "yash@gmail.com",
   *   "password": "Strong@123"
   * }
   */
  async login({ email, password }) {
    const payload = {
      email: (email || '').trim().toLowerCase(),
      password,
    };

    const endpoint = (env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '') + '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const session = {
          token: data.token || data.data?.token || data.accessToken || crypto.randomUUID(),
          user: data.user || data.data?.user || {
            name: data.ownerName || data.name || payload.email.split('@')[0],
            email: payload.email,
            shopName: data.shopName,
            businessType: data.businessType,
            city: data.city,
          },
        };
        // Store only the active auth session (JWT/token) in storage
        storage.set(KEY, session);
        return session;
      }

      // Handle backend error responses (400, 401, 403, 404, 500)
      const errData = await res.json().catch(() => null);
      const errorMessage =
        errData?.message ||
        errData?.error ||
        (res.status === 401 ? 'Invalid email or password' : 'Login failed');
      throw new Error(errorMessage);
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  /**
   * Register API: POST /api/auth/register
   * Format:
   * {
   *   "ownerName": "Yash Ranpura",
   *   "email": "yash@gmail.com",
   *   "mobile": "9876543210",
   *   "password": "Strong@123",
   *   "confirmPassword": "Strong@123",
   *   "shopName": "Yash General Store",
   *   "businessType": "Grocery",
   *   "city": "Ahmedabad"
   * }
   */
  async register(data) {
    const payload = {
      ownerName: (data.ownerName || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      mobile: (data.mobile || '').trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      shopName: (data.shopName || '').trim(),
      businessType: (data.businessType || '').trim(),
      city: (data.city || '').trim(),
    };

    const endpoint = (env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '') + '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        // Strictly return API response - DO NOT store user in localStorage
        return resData;
      }

      // Handle backend error responses (400, 409, etc.)
      const errData = await res.json().catch(() => null);
      const errorMessage =
        errData?.message ||
        errData?.error ||
        (res.status === 409 ? 'Email or mobile is already registered' : 'Registration failed');
      throw new Error(errorMessage);
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  logout: () => storage.remove(KEY),
  current: () => storage.get(KEY, null),
};
