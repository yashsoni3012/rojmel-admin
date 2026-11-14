import { env } from '../config/env.js';
import { storage } from './storage.js';

const KEY = 'session';
const REGISTERED_USERS_KEY = 'registered_users';

const DEFAULT_USERS = [
  {
    ownerName: 'Yash Ranpura',
    email: 'yash@gmail.com',
    mobile: '9876543210',
    password: 'Strong@123',
    confirmPassword: 'Strong@123',
    shopName: 'Yash General Store',
    businessType: 'Grocery',
    city: 'Ahmedabad',
  },
];

function getRegisteredUsers() {
  const users = storage.get(REGISTERED_USERS_KEY, null);
  if (!users) {
    storage.set(REGISTERED_USERS_KEY, DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  // Ensure default demo user exists
  if (!users.some((u) => u.email?.toLowerCase() === 'yash@gmail.com')) {
    users.unshift(...DEFAULT_USERS);
    storage.set(REGISTERED_USERS_KEY, users);
  }
  return users;
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.email?.toLowerCase() === user.email?.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  storage.set(REGISTERED_USERS_KEY, users);
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
          token: data.token || data.data?.token || crypto.randomUUID(),
          user: data.user || data.data?.user || {
            name: data.ownerName || data.name || payload.email.split('@')[0],
            email: payload.email,
            shopName: data.shopName,
            businessType: data.businessType,
            city: data.city,
          },
        };
        storage.set(KEY, session);
        return session;
      }

      // If server returned 401 with a specific backend message
      if (res.status === 401) {
        const errData = await res.json().catch(() => null);
        if (errData?.message) {
          throw new Error(errData.message);
        }
      }
    } catch (err) {
      if (
        err.message &&
        err.message !== 'Failed to fetch' &&
        !err.message.includes('NetworkError') &&
        err.message !== 'Load failed' &&
        !err.message.includes('404')
      ) {
        throw err;
      }
    }

    // Client-side fallback for development / offline / demo verification:
    const registeredUsers = getRegisteredUsers();
    const matched = registeredUsers.find(
      (u) => u.email?.toLowerCase() === payload.email && u.password === payload.password
    );

    if (matched) {
      const session = {
        token: crypto.randomUUID(),
        user: {
          name: matched.ownerName || matched.shopName || matched.email.split('@')[0],
          email: matched.email,
          mobile: matched.mobile,
          shopName: matched.shopName,
          businessType: matched.businessType,
          city: matched.city,
        },
      };
      storage.set(KEY, session);
      return session;
    }

    // Check Yash Ranpura credentials
    if (payload.email === 'yash@gmail.com' && payload.password === 'Strong@123') {
      const session = {
        token: crypto.randomUUID(),
        user: {
          name: 'Yash Ranpura',
          email: 'yash@gmail.com',
          mobile: '9876543210',
          shopName: 'Yash General Store',
          businessType: 'Grocery',
          city: 'Ahmedabad',
        },
      };
      storage.set(KEY, session);
      return session;
    }

    // Check predefined demo credentials
    const validEmail = (env.demoEmail || 'admin@rojmel.app').toLowerCase();
    const validPassword = env.demoPassword || 'Admin@123';

    if (payload.email === validEmail && payload.password === validPassword) {
      const session = {
        token: crypto.randomUUID(),
        user: { name: 'Admin', email: validEmail, shopName: 'Rojmel Demo Store' },
      };
      storage.set(KEY, session);
      return session;
    }

    throw new Error('Email or password is incorrect');
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
        saveRegisteredUser(payload);
        return resData;
      }

      const errData = await res.json().catch(() => null);
      if (res.status === 400 || res.status === 409) {
        throw new Error(errData?.message || errData?.error || 'Registration failed. Email or mobile may already be in use.');
      }
    } catch (err) {
      if (
        err.message &&
        err.message !== 'Failed to fetch' &&
        !err.message.includes('NetworkError') &&
        err.message !== 'Load failed' &&
        !err.message.includes('404')
      ) {
        throw err;
      }
    }

    // Persist registered user so they can immediately log in
    saveRegisteredUser(payload);
    return {
      success: true,
      message: 'Account registered successfully',
      data: payload,
    };
  },

  logout: () => storage.remove(KEY),
  current: () => storage.get(KEY, null),
  getRegisteredUsers,
};
