import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/ui/InputField';
import AuthButton from '../components/ui/AuthButton';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email) return 'Email is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const strength =
    form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your free Dobby Vault today"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            id="name"
            name="name"
            icon={User}
            placeholder="John Doe"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
          />
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
        </div>
        
        <div>
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
          />
          {form.password && (
            <div className="flex items-center gap-2 pt-2 px-1">
              <div className="flex gap-1.5 flex-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
              <span className="text-[12px] font-medium" style={{ color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        <InputField
          label="Confirm Password"
          id="confirm"
          name="confirm"
          type="password"
          icon={Lock}
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={handleChange}
          error={form.confirm && form.confirm !== form.password ? 'Passwords do not match' : null}
        />

        <div className="pt-2">
          <AuthButton type="submit" loading={loading}>
            Create Account
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}
