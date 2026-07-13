import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import { deleteDriver, getDrivers } from '../api/driverApi.js';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '' });
  const [totalPages, setTotalPages] = useState(1);

  const loadDrivers = async (query = filters) => {
    try {
      setError('');
      setLoading(true);
      const response = await getDrivers(query);
      setDrivers(response.data.data ?? response.data);
      const totalCount = Number(response.headers['x-total-count'] || 0);
      setTotalPages(Math.max(1, Math.ceil(totalCount / Number(query.limit || 10))));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, [filters]);

  const handleDelete = async (driverId) => {
    try {
      setSubmitting(true);
      setError('');
      await deleteDriver(driverId);
      await loadDrivers();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to delete driver');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Driver management</p>
        <h2 className="mt-2 text-3xl font-semibold">Drivers</h2>
        <p className="mt-2 max-w-2xl text-slate-300">Manage driver records, license details, safety score, and operational status.</p>
        <div className="mt-4">
          <Link to="/drivers/new" className="inline-flex rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Add Driver
          </Link>
        </div>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-ink">Driver list</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent"
              placeholder="Search name or license"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
            />
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}
            >
              <option value="">All statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">License</th>
                  <th className="px-4 py-3 font-medium">Expiry</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Safety</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-slate-500" colSpan={6}>
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-700">{driver.name}</td>
                      <td className="px-4 py-3 text-slate-700">{driver.license}</td>
                      <td className="px-4 py-3 text-slate-700">{String(driver.expiry).slice(0, 10)}</td>
                      <td className="px-4 py-3 text-slate-700">{driver.status}</td>
                      <td className="px-4 py-3 text-slate-700">{driver.safetyScore}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/drivers/${driver._id}/edit`} className="inline-flex rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90">
                            Edit
                          </Link>
                          <Button type="button" className="bg-red-600 px-3 py-1.5 text-xs" disabled={submitting} onClick={() => handleDelete(driver._id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
          <span>Page {filters.page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button type="button" className="bg-slate-700 px-3 py-1.5 text-xs" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
              Previous
            </Button>
            <Button type="button" className="bg-slate-700 px-3 py-1.5 text-xs" disabled={filters.page >= totalPages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
