import { env } from '../config/env.js';
import { storage } from './storage.js';

const KEY = 'session';
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));

// Swap these methods with real API calls (fetch/axios) when you add a backend.
export const authService = {
  async login({ email, password }) {
    await wait();
    if (email.trim().toLowerCase() === env.demoEmail && password === env.demoPassword) {
      const session = { token: crypto.randomUUID(), user: { name: 'Admin', email: env.demoEmail } };
      storage.set(KEY, session);
      return session;
    }
    throw new Error('Email or password is incorrect');
  },
  logout: () => storage.remove(KEY),
  current: () => storage.get(KEY, null),
};
