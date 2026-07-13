import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

const defaultForm = {
  registrationNo: '',
  vehicleName: '',
  type: '',
  capacity: '',
  odometer: '',
  cost: '',
  status: 'Available'
};

export default function VehicleForm({ initialValues = defaultForm, submitLabel = 'Save Vehicle', onSubmit, loading = false }) {
  const [form, setForm] = useState({ ...defaultForm, ...initialValues });

  useEffect(() => {
    setForm({ ...defaultForm, ...initialValues });
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
      <Input label="Registration No" value={form.registrationNo} onChange={handleChange('registrationNo')} />
      <Input label="Vehicle Name" value={form.vehicleName} onChange={handleChange('vehicleName')} />
      <Input label="Type" value={form.type} onChange={handleChange('type')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Capacity" type="number" min="0" value={form.capacity} onChange={handleChange('capacity')} />
        <Input label="Odometer" type="number" min="0" value={form.odometer} onChange={handleChange('odometer')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Cost" type="number" min="0" value={form.cost} onChange={handleChange('cost')} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate">
          <span>Status</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent"
            value={form.status}
            onChange={handleChange('status')}
          >
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
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