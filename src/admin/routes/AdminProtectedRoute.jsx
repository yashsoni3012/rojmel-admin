import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminProtectedRoute() {
  const { isAdminAuthed } = useAdminAuth();
  const location = useLocation();

  if (!isAdminAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

