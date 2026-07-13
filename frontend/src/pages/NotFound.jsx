import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <Link className="mt-6 inline-flex rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
