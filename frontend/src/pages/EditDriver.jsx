import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import DriverForm from '../components/driver/DriverForm.jsx';
import { getDriverById, updateDriver } from '../api/driverApi.js';

export default function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDriver = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getDriverById(id);
        if (active) {
          setDriver(response.data.data ?? response.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || 'Failed to load driver');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDriver();

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      setSaving(true);
      setError('');

      await updateDriver(id, {
        ...form,
        safetyScore: Number(form.safetyScore || 0)
      });

      navigate('/drivers');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to update driver');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Driver management</p>
        <h2 className="mt-2 text-3xl font-semibold">Edit Driver</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Card className="max-w-2xl">
        {loading ? <div className="flex min-h-64 items-center justify-center"><Loader /></div> : driver ? <DriverForm initialValues={driver} submitLabel="Update Driver" loading={saving} onSubmit={handleSubmit} /> : null}
      </Card>
    </div>
  );
}