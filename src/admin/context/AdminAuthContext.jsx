import { createContext, useContext, useMemo, useState } from 'react';
import { adminAuthService } from '../services/adminAuthService.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminAuthCtx = createContext(null);

export function AdminAuthProvider({ children }) {
  const toast = useToast();
  const [adminSession, setAdminSession] = useState(() => adminAuthService.current());

  const value = useMemo(
    () => ({
      adminUser: adminSession?.user,
      isAdminAuthed: !!adminSession,
      async login(credentials) {
        const session = await adminAuthService.login(credentials);
        setAdminSession(session);
        toast.success(`Super Admin logged in successfully!`);
        return session;
      },
      logout() {
        adminAuthService.logout();
        setAdminSession(null);
        toast.info('Super Admin logged out');
      },
    }),
    [adminSession, toast]
  );

  return <AdminAuthCtx.Provider value={value}>{children}</AdminAuthCtx.Provider>;
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthCtx);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
};

