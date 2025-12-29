import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const { success, error } = await login(form);
      if (success) {
        navigate('/');
      } else {
        setError(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // Rest of your component remains the same
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', border: '1px solid #eee', padding: 24, borderRadius: 8 }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {/* Rest of your JSX */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            style={{ width: '100%', padding: 8, marginTop: 6 }}
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
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </div>

        <button type="submit" disabled={busy} style={{ padding: '10px 14px' }}>
          {busy ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}