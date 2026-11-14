import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.jsx';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const toast = useToast();
  const [session, setSession] = useState(() => authService.current());
  const [loading, setLoading] = useState(true);

  // Authenticate via HttpOnly cookie session and get fresh user profile from API
  useEffect(() => {
    let mounted = true;
    authService
      .getProfile()
      .then((userData) => {
        if (mounted && userData) {
          setSession({ user: userData });
        }
      })
      .catch(() => {
        if (mounted) {
          setSession(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    user: session?.user,
    isAuthed: !!session?.user,
    loading,
    async login(credentials) {
      const s = await authService.login(credentials);
      setSession(s);
      toast.success(`Welcome back, ${s.user.name || s.user.ownerName || 'User'}`);
      return s;
    },
    async register(data) {
      const res = await authService.register(data);
      return res;
    },
    updateUser(updatedUser) {
      setSession((prev) => ({
        ...prev,
        user: { ...prev?.user, ...updatedUser },
      }));
    },
    async fetchProfile() {
      try {
        const u = await authService.getProfile();
        setSession({ user: u });
        return u;
      } catch {
        return session?.user;
      }
    },
    async logout() {
      await authService.logout();
      setSession(null);
      toast.info('You have been logged out');
    },
  }), [session, loading, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
