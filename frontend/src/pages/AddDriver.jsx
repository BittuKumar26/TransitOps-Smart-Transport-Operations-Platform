import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import DriverForm from '../components/driver/DriverForm.jsx';
import { createDriver } from '../api/driverApi.js';

export default function AddDriver() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    try {
      setLoading(true);
      setError('');

      await createDriver({
        ...form,
        safetyScore: Number(form.safetyScore || 0)
      });

      navigate('/drivers');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Driver management</p>
        <h2 className="mt-2 text-3xl font-semibold">Add Driver</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="max-w-2xl">
        <DriverForm submitLabel="Create Driver" loading={loading} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}