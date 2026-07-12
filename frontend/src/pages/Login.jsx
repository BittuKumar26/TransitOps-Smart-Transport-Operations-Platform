import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Card from '../components/common/Card.jsx';
import { login as loginApi } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      const response = await loginApi(form);
      login(response.data.token, response.data);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card className="border-white/20 bg-white/95 text-ink shadow-2xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-teal-600">TransitOps</p>
        <h2 className="mt-2 text-3xl font-semibold">Sign in</h2>
        <p className="mt-2 text-sm text-slate-500">Access fleet operations, dispatch, and analytics.</p>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" className="w-full bg-teal-600">Login</Button>
      </form>
    </Card>
  );
}
