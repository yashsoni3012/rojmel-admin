import { env } from '../config/env.js';

const p = env.storagePrefix;
export const storage = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(p + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: (key, value) => localStorage.setItem(p + key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(p + key),
};
