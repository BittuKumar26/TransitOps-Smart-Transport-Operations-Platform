import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.92),_rgba(14,116,144,0.85))] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <Outlet />
      </div>
    </div>
  );
}
