import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

const defaultForm = {
  vehicleId: '',
  driverId: '',
  source: '',
  destination: '',
  weight: '',
  distance: '',
  fuel: ''
};

export default function TripForm({ vehicles = [], drivers = [], initialValues = defaultForm, submitLabel = 'Save Trip', onSubmit, loading = false }) {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate">
          <span>Vehicle</span>
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent" value={form.vehicleId} onChange={handleChange('vehicleId')}>
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.vehicleName} ({vehicle.registrationNo})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate">
          <span>Driver</span>
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent" value={form.driverId} onChange={handleChange('driverId')}>
            <option value="">Select driver</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name} ({driver.license})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Source" value={form.source} onChange={handleChange('source')} />
        <Input label="Destination" value={form.destination} onChange={handleChange('destination')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Weight" type="number" min="0" value={form.weight} onChange={handleChange('weight')} />
        <Input label="Distance" type="number" min="0" value={form.distance} onChange={handleChange('distance')} />
        <Input label="Fuel" type="number" min="0" value={form.fuel} onChange={handleChange('fuel')} />
      </div>
      <Button type="submit" className="w-full bg-teal-600" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}