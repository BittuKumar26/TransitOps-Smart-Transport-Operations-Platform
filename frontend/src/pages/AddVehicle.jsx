import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import VehicleForm from '../components/vehicle/VehicleForm.jsx';
import { createVehicle } from '../api/vehicleApi.js';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    try {
      setLoading(true);
      setError('');

      await createVehicle({
        ...form,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer || 0),
        cost: Number(form.cost || 0)
      });

      navigate('/vehicles');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Fleet management</p>
        <h2 className="mt-2 text-3xl font-semibold">Add Vehicle</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="max-w-2xl">
        <VehicleForm submitLabel="Create Vehicle" loading={loading} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
