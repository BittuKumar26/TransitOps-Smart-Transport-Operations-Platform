import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import VehicleForm from '../components/vehicle/VehicleForm.jsx';
import client from '../api/axios.js';
import { updateVehicle } from '../api/vehicleApi.js';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await client.get(`/vehicles/${id}`);
        if (active) {
          setVehicle(response.data.data ?? response.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || 'Failed to load vehicle');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      setSaving(true);
      setError('');

      await updateVehicle(id, {
        ...form,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer || 0),
        cost: Number(form.cost || 0)
      });

      navigate('/vehicles');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Fleet management</p>
        <h2 className="mt-2 text-3xl font-semibold">Edit Vehicle</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="max-w-2xl">
        {loading ? <div className="flex min-h-64 items-center justify-center"><Loader /></div> : vehicle ? <VehicleForm initialValues={vehicle} submitLabel="Update Vehicle" loading={saving} onSubmit={handleSubmit} /> : null}
      </Card>
    </div>
  );
}
