import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageSkeleton from '../components/common/PageSkeleton.jsx';

export default function ProtectedRoute() {
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return <PageSkeleton />;
  }

  // Always redirect to /login cleanly without saving prior page in state
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
