import { storage } from '../../services/storage.js';

const ADMIN_SESSION_KEY = 'super_admin_session';
const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '123456',
};

export const adminAuthService = {
  async login({ email, password }) {
    await wait();

    const normalizedInputEmail = (email || '').trim().toLowerCase();
    const expectedEmail = ADMIN_CREDENTIALS.email.toLowerCase();

    if (normalizedInputEmail === expectedEmail && password === ADMIN_CREDENTIALS.password) {
      const session = {
        token: `admin_jwt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        user: {
          id: 'admin-001',
          name: 'Super Admin',
          email: ADMIN_CREDENTIALS.email,
          role: 'Master Administrator',
          badge: 'Super Admin',
          lastLogin: new Date().toISOString(),
        },
      };
      storage.set(ADMIN_SESSION_KEY, session);
      return session;
    }

    throw new Error('Invalid Super Admin credentials. Use admin@gmail.com / 123456');
  },

  logout() {
    storage.remove(ADMIN_SESSION_KEY);
  },

  current() {
    return storage.get(ADMIN_SESSION_KEY, null);
  },
};

