import { env } from '../config/env.js';
import { storage } from './storage.js';

const KEY = 'session';
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Swap these methods with real API calls (fetch/axios) when you add a backend.
export const authService = {
  async login({ email, password }) {
    await wait();
    const validEmail = (env.demoEmail || 'admin@rojmel.app').toLowerCase();
    const validPassword = env.demoPassword || 'Admin@123';

    if (email.trim().toLowerCase() === validEmail && password === validPassword) {
      const session = {
        token: crypto.randomUUID(),
        user: { name: 'Admin', email: validEmail },
      };
      storage.set(KEY, session);
      return session;
    }
    throw new Error('Email or password is incorrect');
  },
  logout: () => storage.remove(KEY),
  current: () => storage.get(KEY, null),
};
