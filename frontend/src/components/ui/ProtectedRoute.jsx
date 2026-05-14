import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full spin"
            style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading Dobby Vault…</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
