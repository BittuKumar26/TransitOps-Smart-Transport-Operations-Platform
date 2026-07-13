import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/common/Card.jsx';
import KpiCard from '../components/dashboard/KpiCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { getDashboardSummary } from '../api/dashboardApi.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await getDashboardSummary();
        setDashboard(response.data.data ?? response.data);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const kpis = useMemo(() => {
    if (!dashboard) return [];

    return [
      ['Total Vehicles', dashboard.totalVehicles],
      ['Available Vehicles', dashboard.availableVehicles],
      ['Active Trips', dashboard.activeTrips],
      ['Drivers Available', dashboard.availableDrivers],
      ['Fleet Utilization', `${dashboard.fleetUtilization}%`],
      ['Operational Cost', formatCurrency(dashboard.totalOperationalCost)]
    ];
  }, [dashboard]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-10 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Operations snapshot</p>
        <h2 className="mt-3 text-4xl font-semibold">Fleet command center</h2>
        <p className="mt-3 max-w-2xl text-slate-300">Track vehicle status, active trips, fuel spend, and maintenance from one control surface.</p>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <KpiCard key={label} label={label} value={value} />
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="min-h-72">
          <h3 className="mb-4 text-lg font-semibold text-ink">Vehicle Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboard?.vehicleStatusChart || []} dataKey="count" nameKey="status" outerRadius={90} fill="#14b8a6" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="min-h-72">
          <h3 className="mb-4 text-lg font-semibold text-ink">Monthly Expenses</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.monthlyExpenseChart || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="min-h-72">
          <h3 className="mb-4 text-lg font-semibold text-ink">Recent Trips</h3>
          <div className="space-y-3 text-sm text-slate-700">
            {(dashboard?.latestTrips || []).map((trip) => (
              <div key={trip._id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-medium">{trip.source} to {trip.destination}</p>
                <p className="text-slate-500">{trip.vehicleId?.vehicleName || '-'} / {trip.driverId?.name || '-'} / {trip.status}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="min-h-72">
          <h3 className="mb-4 text-lg font-semibold text-ink">Recent Maintenance</h3>
          <div className="space-y-3 text-sm text-slate-700">
            {(dashboard?.recentMaintenance || []).map((record) => (
              <div key={record._id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-medium">{record.vehicleId?.vehicleName || '-'}</p>
                <p className="text-slate-500">{record.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
        </>
      )}
    </div>
  );
}
