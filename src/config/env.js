const e = import.meta.env;
export const env = {
  appName: e.VITE_APP_NAME || 'Rojmel',
  storagePrefix: e.VITE_STORAGE_PREFIX || 'rojmel-',
  apiUrl: e.VITE_API_URL || '',
  demoEmail: (e.VITE_DEMO_EMAIL || '').toLowerCase(),
  demoPassword: e.VITE_DEMO_PASSWORD || '',
};
