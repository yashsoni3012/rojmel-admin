import { env } from '../config/env.js';

let currentUserInMemory = null;

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

// Clean up any user profile, session, or token previously stored in Local Storage
try {
  localStorage.removeItem('rojmel-user_profile');
  localStorage.removeItem('rojmel-session');
  localStorage.removeItem('rojmel-token');
  localStorage.removeItem('rojmel-registered_users');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('session');
  localStorage.removeItem('token');
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

        // Keep user in memory only (NEVER in localStorage)
        currentUserInMemory = user;

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
   *   "city": "Ahmedabad",
   *   "address": "Maninagar, Ahmedabad"
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
      address: (data.address || '').trim(),
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
   * Forgot Password API: POST /api/auth/forgot-password
   * Format: { email: "user@example.com" }
   */
  async forgotPassword(email) {
    const payload = {
      email: (email || '').trim().toLowerCase(),
    };

    const endpoint = (env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '') + '/api/auth/forgot-password';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return await res.json().catch(() => ({ success: true }));
      }

      const errData = await res.json().catch(() => null);
      const errorMessage =
        errData?.message ||
        errData?.error ||
        'Failed to send password reset email. Please verify your email address.';
      throw new Error(errorMessage);
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  /**
   * Reset Password API: POST /api/auth/reset-password/:token
   * Format: { password: "...", confirmPassword: "..." }
   */
  async resetPassword(token, password, confirmPassword) {
    const payload = {
      password,
      newPassword: password,
      confirmPassword: confirmPassword || password,
    };

    const cleanToken = encodeURIComponent((token || '').trim());
    const base = env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '';
    const endpoint = `${base}/api/auth/reset-password/${cleanToken}`;

    try {
      let res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // If server only accepts PUT for reset-password, fallback to PUT
      if (res.status === 405) {
        res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        return await res.json().catch(() => ({ success: true }));
      }

      const errData = await res.json().catch(() => null);
      const errorMessage =
        errData?.message ||
        errData?.error ||
        (res.status === 400 || res.status === 404
          ? 'Reset token is invalid or has expired. Please request a new link.'
          : 'Failed to reset password');
      throw new Error(errorMessage);
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  /**
   * Get User Profile API: GET /api/auth/profile
   */
  async getProfile() {
    const base = env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '';
    let endpoint = `${base}/api/auth/profile`;

    try {
      let res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      // Fallback to /api/auth/me if /api/auth/profile returns 404
      if (res.status === 404) {
        endpoint = `${base}/api/auth/me`;
        res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      }

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const rawUser = data.data || data.user || data;
        const user = {
          _id: rawUser._id,
          name: rawUser.name || rawUser.ownerName || '',
          ownerName: rawUser.ownerName || rawUser.name || '',
          email: rawUser.email || '',
          mobile: rawUser.mobile || '',
          shopName: rawUser.shopName || '',
          businessType: rawUser.businessType || '',
          city: rawUser.city || '',
          address: rawUser.address || '',
          role: rawUser.role || 'owner',
          profileImage: rawUser.profileImage || null,
        };
        // Keep in-memory only (NEVER in localStorage)
        currentUserInMemory = user;
        return user;
      }

      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || 'Failed to fetch profile');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  /**
   * Update User Profile API: PATCH /api/auth/profile
   * Format:
   * {
   *   "ownerName": "Yash Ranpura",
   *   "mobile": "9876543210",
   *   "shopName": "Yash General Store",
   *   "businessType": "Kirana",
   *   "city": "Ahmedabad",
   *   "address": "Maninagar, Ahmedabad"
   * }
   */
  async updateProfile(profileData) {
    const effectiveName = (profileData.name || profileData.ownerName || '').trim();
    const payload = {
      name: effectiveName,
      ownerName: effectiveName,
      mobile: (profileData.mobile || '').trim(),
      shopName: (profileData.shopName || '').trim(),
      businessType: (profileData.businessType || '').trim(),
      city: (profileData.city || '').trim(),
      address: (profileData.address || '').trim(),
      profileImage: profileData.profileImage !== undefined ? profileData.profileImage : null,
    };

    const base = env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '';
    const endpoint = `${base}/api/auth/profile`;

    try {
      let res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // Fallback to PUT if PATCH not supported
      if (res.status === 405) {
        res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const rawUser = data.data || data.user || data;
        const currentUser = currentUserInMemory || {};
        const updatedUser = {
          ...currentUser,
          ...payload,
          _id: rawUser._id || currentUser._id,
          name: payload.name || currentUser.name,
          ownerName: payload.ownerName || currentUser.ownerName,
          email: rawUser.email || currentUser.email,
          role: rawUser.role || currentUser.role || 'owner',
          profileImage: rawUser.profileImage !== undefined ? rawUser.profileImage : payload.profileImage,
        };
        // Keep in-memory only (NEVER in localStorage)
        currentUserInMemory = updatedUser;
        return updatedUser;
      }

      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || 'Failed to update profile');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message === 'Load failed') {
        throw new Error('Unable to connect to backend server. Please verify your backend API is running.');
      }
      throw err;
    }
  },

  /**
   * Change Password API: PATCH /api/auth/change-password
   * Format:
   * {
   *   "currentPassword": "OldPassword@123",
   *   "newPassword": "NewPassword@123",
   *   "confirmPassword": "NewPassword@123"
   * }
   */
  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const payload = {
      currentPassword,
      newPassword,
      confirmPassword: confirmPassword || newPassword,
    };

    const base = env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '';
    const endpoint = `${base}/api/auth/change-password`;

    try {
      let res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // Fallback to POST if server prefers POST for change-password
      if (res.status === 405) {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        return await res.json().catch(() => ({ success: true }));
      }

      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || 'Failed to change password. Please check your current password.');
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

    // Reset in-memory user
    currentUserInMemory = null;

    // Purge any local storage keys if any exist
    try {
      localStorage.removeItem('rojmel-user_profile');
      localStorage.removeItem('rojmel-session');
      localStorage.removeItem('rojmel-token');
      localStorage.removeItem('rojmel-registered_users');
    } catch {
      // ignore
    }
  },

  /**
   * Get current authenticated user (in-memory only, NEVER from localStorage)
   */
  current() {
    return currentUserInMemory ? { user: currentUserInMemory } : null;
  },
};
