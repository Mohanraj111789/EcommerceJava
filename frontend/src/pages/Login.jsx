import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Always start with empty fields
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  // 🔐 Hidden admin mode
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  /* ================= ALT + A ADMIN SHORTCUT ================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();

        // 🔥 Switch to admin mode
        setIsAdminLogin(true);

        // 🔥 CLEAR form fields & messages
        setForm({ email: '', password: '' });
        setError(null);
        setSuccess(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= LOGIN SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setBusy(true);

    try {
      const result = await login(form);

      if (result.success) {
        setSuccess(true);
        const userData = result.data?.user;
        localStorage.setItem("token", result.data?.token);

        // 🔒 Admin role validation
        if (isAdminLogin && userData?.role !== 'ADMIN') {
          setError('Access denied. Admin credentials required.');
          setBusy(false);
          return;
        }

        setTimeout(() => {
          if (userData?.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 500);
      } else {
        if (typeof result.error === 'object') {
          setError(Object.values(result.error).join(', '));
        } else {
          setError(result.error || 'Login failed. Please try again.');
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
    <div className="login-page">
      <div className="login-container">
        <div className={`login-card ${isAdminLogin ? 'admin-mode' : ''}`}>

          {/* ===== HEADER ===== */}
          <div className="login-header">
            <h2 className="login-title">
              {isAdminLogin ? '🔐 Admin Login' : 'Welcome Back'}
            </h2>
            <p className="login-subtitle">
              {isAdminLogin
                ? 'Sign in with admin credentials'
                : 'Sign in to continue to your account'}
            </p>
          </div>

          {/* ===== ALERTS ===== */}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">✗</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder={
                  isAdminLogin
                    ? 'admin@example.com'
                    : 'Enter your email'
                }
                autoComplete="off"
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
                placeholder="Enter your password"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={busy}>
              {busy && <span className="spinner"></span>}
              {busy
                ? 'Signing in...'
                : isAdminLogin
                ? 'Admin Sign In'
                : 'Sign In'}
            </button>
          </form>

          {/* ===== FOOTER (USER ONLY) ===== */}
          {!isAdminLogin && (
            <div className="login-footer">
              <p>
                Don't have an account? <Link to="/register">Create Account</Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
