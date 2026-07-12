import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import TripForm from '../components/trip/TripForm.jsx';
import { getVehicles } from '../api/vehicleApi.js';
import { getDrivers } from '../api/driverApi.js';
import { cancelTrip, completeTrip, createTrip, deleteTrip, dispatchTrip, getTrips } from '../api/tripApi.js';

const statusBadge = {
  Draft: 'bg-slate-100 text-slate-700',
  Dispatched: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-rose-100 text-rose-700'
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '' });
  const [totalPages, setTotalPages] = useState(1);

  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status === 'Available'), [vehicles]);
  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.status === 'Available'), [drivers]);

  const loadData = async (query = filters) => {
    try {
      setLoading(true);
      setError('');

      const [tripsResponse, vehiclesResponse, driversResponse] = await Promise.all([
        getTrips(query),
        getVehicles({ page: 1, limit: 100, status: 'Available' }),
        getDrivers({ page: 1, limit: 100, status: 'Available' })
      ]);
      setTrips(tripsResponse.data.data ?? tripsResponse.data);
      setVehicles(vehiclesResponse.data.data ?? vehiclesResponse.data);
      setDrivers(driversResponse.data.data ?? driversResponse.data);
      const totalCount = Number(tripsResponse.headers['x-total-count'] || 0);
      setTotalPages(Math.max(1, Math.ceil(totalCount / Number(query.limit || 10))));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleCreateTrip = async (form) => {
    try {
      setSubmitting(true);
      setError('');

      await createTrip({
        ...form,
        weight: Number(form.weight),
        distance: Number(form.distance || 0),
        fuel: Number(form.fuel || 0)
      });

      await loadData({ ...filters, page: 1 });
      setFilters((current) => ({ ...current, page: 1 }));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  const runTripAction = async (actionFn, id) => {
    try {
      setError('');
      await actionFn(id);
      await loadData();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Trip action failed');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Trip management</p>
        <h2 className="mt-2 text-3xl font-semibold">Trips</h2>
        <p className="mt-2 max-w-2xl text-slate-300">Create dispatch-ready trips, enforce fleet constraints, and control trip lifecycle transitions.</p>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <Card>
          <h3 className="text-lg font-semibold text-ink">Create Trip</h3>
          <div className="mt-4">
            <TripForm vehicles={availableVehicles} drivers={availableDrivers} submitLabel="Create Trip" loading={submitting} onSubmit={handleCreateTrip} />
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-ink">Trip list</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_220px]">
              <input
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent"
                placeholder="Search source or destination"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
              />
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-accent"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}
              >
                <option value="">All statuses</option>
                <option value="Draft">Draft</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
                    <th className="px-4 py-3 font-medium">Route</th>
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">Weight</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-slate-500" colSpan={6}>
                        No trips found.
                      </td>
                    </tr>
                  ) : (
                    trips.map((trip) => (
                      <tr key={trip._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{trip.source} to {trip.destination}</td>
                        <td className="px-4 py-3 text-slate-700">{trip.vehicleId?.vehicleName || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{trip.driverId?.name || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{trip.weight}</td>
                        <td className="px-4 py-3 text-slate-700">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[trip.status] || 'bg-slate-100 text-slate-700'}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/trips/${trip._id}/edit`} className="inline-flex rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90">
                              Edit
                            </Link>
                            {trip.status === 'Draft' && (
                              <Button type="button" className="bg-cyan-600 px-3 py-1.5 text-xs" onClick={() => runTripAction(dispatchTrip, trip._id)}>
                                Dispatch
                              </Button>
                            )}
                            {trip.status === 'Dispatched' && (
                              <Button type="button" className="bg-green-600 px-3 py-1.5 text-xs" onClick={() => runTripAction(completeTrip, trip._id)}>
                                Complete
                              </Button>
                            )}
                            {(trip.status === 'Draft' || trip.status === 'Dispatched') && (
                              <Button type="button" className="bg-amber-600 px-3 py-1.5 text-xs" onClick={() => runTripAction(cancelTrip, trip._id)}>
                                Cancel
                              </Button>
                            )}
                            {trip.status !== 'Dispatched' && (
                              <Button type="button" className="bg-red-600 px-3 py-1.5 text-xs" onClick={() => runTripAction(deleteTrip, trip._id)}>
                                Delete
                              </Button>
                            )}
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
