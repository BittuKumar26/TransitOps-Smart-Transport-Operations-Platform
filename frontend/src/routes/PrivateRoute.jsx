import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

export default function PrivateRoute() {
  const { token, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
