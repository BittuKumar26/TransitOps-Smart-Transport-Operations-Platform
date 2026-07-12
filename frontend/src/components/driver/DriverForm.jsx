import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

const defaultForm = {
  name: '',
  license: '',
  expiry: '',
  status: 'Available',
  safetyScore: 100
};

export default function DriverForm({ initialValues = defaultForm, submitLabel = 'Save Driver', onSubmit, loading = false }) {
  const [form, setForm] = useState({ ...defaultForm, ...initialValues });

  useEffect(() => {
    setForm({
      ...defaultForm,
      ...initialValues,
      expiry: initialValues.expiry ? String(initialValues.expiry).slice(0, 10) : ''
    });
  }, [initialValues]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Driver Name" value={form.name} onChange={handleChange('name')} />
      <Input label="License No" value={form.license} onChange={handleChange('license')} />
      <Input label="License Expiry" type="date" value={form.expiry} onChange={handleChange('expiry')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Safety Score" type="number" min="0" max="100" value={form.safetyScore} onChange={handleChange('safetyScore')} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate">
          <span>Status</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent"
            value={form.status}
            onChange={handleChange('status')}
          >
            <option>Available</option>
            <option>On Trip</option>
            <option>Suspended</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>
      <Button type="submit" className="w-full bg-teal-600" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}