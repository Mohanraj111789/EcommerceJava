import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setBusy(true);

    try {
      const result = await register(form);

      if (result.success) {
        setSuccess(true);

        // Clear form after success
        setForm({ name: '', email: '', password: '' });

        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        if (typeof result.error === 'object') {
          setError(Object.values(result.error).join(', '));
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">

          {/* ===== HEADER ===== */}
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">
              Join us and start shopping smarter
            </p>
          </div>

          {/* ===== ALERTS ===== */}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">✗</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== FORM ===== */}
          <form
            onSubmit={handleSubmit}
            className="register-form"
            autoComplete="off"
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a strong password"
                minLength={6}
                autoComplete="new-password"
                required
              />
              <small className="form-hint">
                Minimum 6 characters
              </small>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={busy}
            >
              {busy && <span className="spinner"></span>}
              {busy ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* ===== FOOTER ===== */}
          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
