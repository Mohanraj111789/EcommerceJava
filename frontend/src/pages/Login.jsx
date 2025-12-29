import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setBusy(true);

    try {
      const result = await login(form);
      if (result.success) {
        setSuccess(true);
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        // Handle different error formats from backend
        if (typeof result.error === 'object') {
          const errorMessages = Object.values(result.error).join(', ');
          setError(errorMessages);
        } else if (typeof result.error === 'string') {
          setError(result.error);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', border: '1px solid #eee', padding: 24, borderRadius: 8 }}>
      <h2>Login</h2>

      {/* Success Message */}
      {success && (
        <div style={{
          color: '#155724',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          padding: 12,
          marginBottom: 12,
          borderRadius: 4
        }}>
          ✓ Login successful! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          color: '#721c24',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          padding: 12,
          marginBottom: 12,
          borderRadius: 4
        }}>
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            style={{ width: '100%', padding: 8, marginTop: 6, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            type="password"
            style={{ width: '100%', padding: 8, marginTop: 6, boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '10px 14px',
            backgroundColor: busy ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: busy ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {busy ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: 12, textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff' }}>Register</Link>
      </p>
    </div>
  );
}
