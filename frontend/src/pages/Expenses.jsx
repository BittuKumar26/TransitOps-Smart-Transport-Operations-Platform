import { useEffect, useState } from 'react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Loader from '../components/common/Loader.jsx';
import { createExpense, deleteExpense, getExpenses } from '../api/expenseApi.js';
import { getVehicles } from '../api/vehicleApi.js';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ vehicleId: '', type: '', amount: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [expenseResponse, vehicleResponse] = await Promise.all([getExpenses(), getVehicles()]);
      setExpenses(expenseResponse.data.data ?? expenseResponse.data);
      setVehicles(vehicleResponse.data.data ?? vehicleResponse.data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await createExpense({ ...form, amount: Number(form.amount) });
      setForm({ vehicleId: '', type: '', amount: '' });
      await loadData();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await deleteExpense(id);
      await loadData();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-ink px-6 py-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Finance</p>
        <h2 className="mt-2 text-3xl font-semibold">Expenses</h2>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <h3 className="text-lg font-semibold text-ink">Add expense</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate">
              <span>Vehicle (optional)</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent"
                value={form.vehicleId}
                onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))}
              >
                <option value="">No vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleName} ({vehicle.registrationNo})
                  </option>
                ))}
              </select>
            </label>
            <Input label="Type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
            <Input label="Amount" type="number" min="0" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
            <Button type="submit" className="w-full bg-teal-600" disabled={submitting}>
              {submitting ? 'Saving...' : 'Create Expense'}
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-ink">Expense records</h3>
          </div>

          {loading ? (
            <div className="flex min-h-80 items-center justify-center"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr><td className="px-4 py-8 text-slate-500" colSpan={5}>No expenses found.</td></tr>
                  ) : (
                    expenses.map((row) => (
                      <tr key={row._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{row.type}</td>
                        <td className="px-4 py-3 text-slate-700">{row.vehicleId?.vehicleName || '-'}</td>
                        <td className="px-4 py-3 text-slate-700">{row.amount}</td>
                        <td className="px-4 py-3 text-slate-700">{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <Button type="button" className="bg-red-600 px-3 py-1.5 text-xs" onClick={() => handleDelete(row._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
