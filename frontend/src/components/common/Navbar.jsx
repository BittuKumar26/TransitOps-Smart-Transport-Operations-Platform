import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-teal-600">TransitOps</p>
        <h1 className="text-xl font-semibold text-ink">Smart Transport Operations Platform</h1>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700">
            {user.name}
          </span>
          <Link
            to="/profile"
            title="Profile"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
            type="button"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
