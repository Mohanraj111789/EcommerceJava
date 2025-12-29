import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const result = await login(form);
    setBusy(false);

    if (result.success) {
      navigate('/');
    } else {
      // server might return string or object with field errors
      setError(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', border: '1px solid #eee', padding: 24, borderRadius: 8 }}>
      <h2>Login</h2>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

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

      <p style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
