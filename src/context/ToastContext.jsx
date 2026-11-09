import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const Ctx = createContext(null);

export function ToastProvider({ children }) {
  const [t, setT] = useState({ open: false, msg: '', type: 'success' });
  const show = useCallback((type) => (msg) => setT({ open: true, msg, type }), []);
  const api = useMemo(() => ({ success: show('success'), error: show('error'), info: show('info') }), [show]);
  const close = (_, reason) => reason !== 'clickaway' && setT((p) => ({ ...p, open: false }));

  return (
    <Ctx.Provider value={api}>
      {children}
      <Snackbar open={t.open} autoHideDuration={3500} onClose={close} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert variant="filled" severity={t.type} onClose={close} sx={{ fontWeight: 600 }}>{t.msg}</Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}
export const useToast = () => useContext(Ctx);
