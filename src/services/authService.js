import { env } from '../config/env.js';
import { storage } from './storage.js';

const USER_KEY = 'user_profile';

// Helper to write to Cookie Storage
function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

// Helper to remove from Cookie Storage
function removeCookie(name) {
  try {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  } catch {
    // ignore
  }
}

// Clean up any token previously stored in Local Storage
try {
  storage.remove('registered_users');
  storage.remove('token');
  const legacySession = storage.get('session', null);
  if (legacySession) {
    if (legacySession.user) {
      storage.set(USER_KEY, legacySession.user);
    }
    storage.remove('session');
  }
} catch {
  // ignore
}

export const authService = {
  /**
   * Login API: POST /api/auth/login
   * - Token is handled via Cookies (HttpOnly from server Set-Cookie)
   * - Never stores token in localStorage
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
        credentials: 'include', // Enables receiving HttpOnly Set-Cookie from server
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        
        // If API returned a token in the body, store it in Cookie storage (NOT localStorage)
        const token = data.token || data.data?.token || data.accessToken;
        if (token) {
          setCookie('token', token, 7);
        }

        const user = data.user || data.data?.user || {
          name: data.ownerName || data.name || payload.email.split('@')[0],
          email: payload.email,
          shopName: data.shopName,
          businessType: data.businessType,
          city: data.city,
        };

        // Store ONLY user profile in storage (NO token in localStorage)
        storage.set(USER_KEY, user);

        return { user };
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
   * - Submits user registration to the database via API
   * - Never stores user or token in localStorage
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
        credentials: 'include', // Accepts HttpOnly cookies from server
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        // If server returns token on register, set it in Cookie storage (NOT localStorage)
        const token = resData.token || resData.data?.token;
        if (token) {
          setCookie('token', token, 7);
        }
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

  /**
   * Logout API: POST /api/auth/logout
   * - Clears cookies and removes user from client
   */
  async logout() {
    try {
      const endpoint = (env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '') + '/api/auth/logout';
      await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => null);
    } catch {
      // ignore
    }

    // Clear client-side cookie
    removeCookie('token');

    // Remove user profile from local storage
    storage.remove(USER_KEY);
    storage.remove('session');
    storage.remove('token');
  },

  /**
   * Get current authenticated user
   */
  current() {
    const user = storage.get(USER_KEY, null);
    return user ? { user } : null;
  },
};
