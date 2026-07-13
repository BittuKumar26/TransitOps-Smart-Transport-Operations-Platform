import { useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Loader from '../components/common/Loader.jsx';
import { createMaintenance, closeMaintenance as closeMaintenanceApi, deleteMaintenance, getMaintenance } from '../api/maintenanceApi.js';
import { getVehicles } from '../api/vehicleApi.js';

export default function Maintenance() {
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '' });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '' });
  const [totalPages, setTotalPages] = useState(1);

  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status !== 'Inactive'), [vehicles]);

  const loadData = async (query = filters) => {
    try {
      setError('');
      setLoading(true);
      const [maintenanceResponse, vehicleResponse] = await Promise.all([getMaintenance(query), getVehicles({ page: 1, limit: 100 })]);
      setItems(maintenanceResponse.data.data ?? maintenanceResponse.data);
      setVehicles(vehicleResponse.data.data ?? vehicleResponse.data);
      const totalCount = Number(maintenanceResponse.headers['x-total-count'] || 0);
      setTotalPages(Math.max(1, Math.ceil(totalCount / Number(query.limit || 10))));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await createMaintenance({ ...form, cost: Number(form.cost || 0) });
      setForm({ vehicleId: '', description: '', cost: '' });
      await loadData({ ...filters, page: 1 });
      setFilters((current) => ({ ...current, page: 1 }));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to create maintenance');
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (fn, id) => {
    try {
      setError('');
      await fn(id);
      await loadData();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Workshop operations</p>
        <h2 className="mt-2 text-3xl font-semibold">Maintenance</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <h3 className="text-lg font-semibold text-ink">Create maintenance ticket</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate">
              <span>Vehicle</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent"
                value={form.vehicleId}
                onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))}
              >
                <option value="">Select vehicle</option>
                {availableVehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleName} ({vehicle.registrationNo})
                  </option>
                ))}
              </select>
            </label>
            <Input label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            <Input label="Cost" type="number" min="0" value={form.cost} onChange={(event) => setForm((current) => ({ ...current, cost: event.target.value }))} />
            <Button type="submit" className="w-full bg-teal-600" disabled={submitting}>
              {submitting ? 'Saving...' : 'Create Ticket'}
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-ink">Maintenance tickets</h3>
            <div className="mt-3 w-full md:w-52">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}
              >
                <option value="">All statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
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
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Cost</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-slate-500" colSpan={5}>No maintenance records found.</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{item.vehicleId?.vehicleName || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{item.description}</td>
                        <td className="px-4 py-3 text-slate-700">{item.cost}</td>
                        <td className="px-4 py-3 text-slate-700">{item.status}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {item.status === 'Open' && (
                              <Button type="button" className="bg-cyan-600 px-3 py-1.5 text-xs" onClick={() => runAction(closeMaintenanceApi, item._id)}>
                                Close
                              </Button>
                            )}
                            <Button type="button" className="bg-red-600 px-3 py-1.5 text-xs" onClick={() => runAction(deleteMaintenance, item._id)}>
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
      </section>
    </div>
  );
}
