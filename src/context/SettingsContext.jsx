import { createContext, useContext, useState } from 'react';
import { storage } from '../services/storage.js';

const Ctx = createContext(null);
const DEFAULTS = { compactRows: false, confirmDelete: true };

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...storage.get('settings', {}) }));
  const update = (key, value) =>
    setSettings((p) => { const n = { ...p, [key]: value }; storage.set('settings', n); return n; });
  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
}
export const useSettings = () => useContext(Ctx);
