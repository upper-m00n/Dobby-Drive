import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/ui/InputField';
import AuthButton from '../components/ui/AuthButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields.');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your Dobby Vault"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Create one free"
    >
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <InputField
          label="Email address"
          id="email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="pt-2">
          <AuthButton type="submit" loading={loading}>
            Sign In
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}
