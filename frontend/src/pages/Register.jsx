import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const { success, error } = await register(form);
      if (success) {
        navigate('/');
      } else {
        setError(error || 'Registration failed. Please try again.');
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
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {/* Rest of your JSX */}
      <form>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </div>

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
            minLength={6}
            type="password"
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </div>

        <button type="submit" disabled={busy} style={{ padding: '10px 14px' }}>
          {busy ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}