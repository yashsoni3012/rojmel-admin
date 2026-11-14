import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageSkeleton from '../components/common/PageSkeleton.jsx';

export default function ProtectedRoute() {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageSkeleton />;
  }

  return isAuthed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
