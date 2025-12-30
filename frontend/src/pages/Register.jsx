import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const result = await register(form);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        if (typeof result.error === 'object') {
          const errorMessages = Object.values(result.error).join(', ');
          setError(errorMessages);
        } else if (typeof result.error === 'string') {
          setError(result.error);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Join us today and start shopping</p>
          </div>

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>Registration successful! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">✗</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
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
                placeholder="Create a password"
                minLength={6}
                required
              />
              <small className="form-hint">Minimum 6 characters</small>
            </div>

            <button type="submit" className="btn-submit" disabled={busy}>
              {busy && <span className="spinner"></span>}
              {busy ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
