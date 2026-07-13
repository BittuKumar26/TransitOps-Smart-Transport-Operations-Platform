import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Card from '../components/common/Card.jsx';
import { register as registerApi } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      const response = await registerApi({ ...form, role: 'Admin' });
      login(response.data.token, response.data);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Card className="border-white/20 bg-white/95 text-ink shadow-2xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-teal-600">TransitOps</p>
        <h2 className="mt-2 text-3xl font-semibold">Create account</h2>
        <p className="mt-2 text-sm text-slate-500">Register to access fleet operations, dispatch, and analytics.</p>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" className="w-full bg-teal-600">Register</Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
