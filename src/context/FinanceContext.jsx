import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { transactionService } from '../services/transactionService.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const Ctx = createContext(null);

export function FinanceProvider({ children }) {
  const { isAuthed } = useAuth();
  const toast = useToast();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed) { setEntries([]); return; }
    transactionService.list().then(setEntries).finally(() => setLoading(false));
  }, [isAuthed]);

  const api = useMemo(() => ({
    entries, loading,
    async save(entry) {
      try {
        await transactionService.save(entry);
        setEntries(await transactionService.list());
        toast.success(entry.id ? 'Entry updated' : 'Entry added');
      } catch { toast.error('Could not save the entry'); }
    },
    async remove(id) {
      try {
        await transactionService.remove(id);
        setEntries(await transactionService.list());
        toast.success('Entry deleted');
      } catch { toast.error('Could not delete the entry'); }
    },
  }), [entries, loading, toast]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export const useFinance = () => useContext(Ctx);
