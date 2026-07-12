import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import TripForm from '../components/trip/TripForm.jsx';
import { getVehicles } from '../api/vehicleApi.js';
import { getDrivers } from '../api/driverApi.js';
import { getTripById, updateTrip } from '../api/tripApi.js';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const availableVehicles = useMemo(() => {
    if (!trip) return vehicles.filter((vehicle) => vehicle.status === 'Available');
    return vehicles.filter((vehicle) => vehicle.status === 'Available' || vehicle._id === trip.vehicleId);
  }, [vehicles, trip]);

  const availableDrivers = useMemo(() => {
    if (!trip) return drivers.filter((driver) => driver.status === 'Available');
    return drivers.filter((driver) => driver.status === 'Available' || driver._id === trip.driverId);
  }, [drivers, trip]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [tripResponse, vehicleResponse, driverResponse] = await Promise.all([getTripById(id), getVehicles(), getDrivers()]);
        const tripData = tripResponse.data.data ?? tripResponse.data;

        if (active) {
          setTrip({
            ...tripData,
            vehicleId: tripData.vehicleId?._id || tripData.vehicleId,
            driverId: tripData.driverId?._id || tripData.driverId
          });
          setVehicles(vehicleResponse.data.data ?? vehicleResponse.data);
          setDrivers(driverResponse.data.data ?? driverResponse.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || 'Failed to load trip');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      setSaving(true);
      setError('');

      await updateTrip(id, {
        ...form,
        weight: Number(form.weight),
        distance: Number(form.distance || 0),
        fuel: Number(form.fuel || 0)
      });

      navigate('/trips');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to update trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Trip management</p>
        <h2 className="mt-2 text-3xl font-semibold">Edit Trip</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="max-w-3xl">
        {loading ? <div className="flex min-h-64 items-center justify-center"><Loader /></div> : trip ? <TripForm vehicles={availableVehicles} drivers={availableDrivers} initialValues={trip} submitLabel="Update Trip" loading={saving} onSubmit={handleSubmit} /> : null}
      </Card>
    </div>
  );
}