import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.jsx';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const toast = useToast();
  const [session, setSession] = useState(() => authService.current());

  const value = useMemo(() => ({
    user: session?.user,
    isAuthed: !!session,
    async login(credentials) {
      const s = await authService.login(credentials);
      setSession(s);
      toast.success(`Welcome back, ${s.user.name}`);
      return s;
    },
    async register(data) {
      const res = await authService.register(data);
      return res;
    },
    logout() {
      authService.logout();
      setSession(null);
      toast.info('You have been logged out');
    },
  }), [session, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
