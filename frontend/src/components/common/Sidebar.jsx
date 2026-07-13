import { NavLink } from 'react-router-dom';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Vehicles', '/vehicles'],
  ['Drivers', '/drivers'],
  ['Trips', '/trips'],
  ['Maintenance', '/maintenance'],
  ['Fuel', '/fuel'],
  ['Expenses', '/expenses'],
  ['Reports', '/reports']
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/85 p-4 lg:block">
      <nav className="space-y-2">
        {navItems.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
