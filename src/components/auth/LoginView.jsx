import React, { useState } from 'react';
import { Icon } from '../common/Icons';

export const LoginView = ({ onLogin }) => {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      onLogin({ username, role: 'Super Admin' });
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername('superadmin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-viewport">
      {loading && (
        <div className="top-loading-bar-wrapper">
          <div className="top-loading-bar-indicator"></div>
        </div>
      )}

      <div className="login-card-box">
        {/* Brand Display */}
        <div className="login-brand-display">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="brand-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="box" size={26} color="#FFFFFF" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.08em', color: '#1E3A5F' }}>STACKLY</span>
                <span className="brand-badge">PRO</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock, Billing & Distribution ERP</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Sign in to access your inventory & billing dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="login-form-wrapper" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="login-field-group">
            <label className="login-label">Username</label>
            <div className="login-input-container">
              <span className="login-input-icon-left">
                <Icon name="user" size={18} />
              </span>
              <input
                type="text"
                required
                className="login-text-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="login-label">Password</label>
            </div>
            <div className="login-input-container">
              <span className="login-input-icon-left">
                <Icon name="lock" size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="login-text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="login-password-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ color: '#DC2626', fontSize: '0.82rem', textAlign: 'center', background: '#FEE2E2', padding: '0.5rem', borderRadius: '6px' }}>
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
            {!loading && <Icon name="arrowRight" size={18} />}
          </button>
        </form>

        {/* Demo credentials hint & quick fill */}
        <div className="login-demo-hint">
          <div style={{ marginBottom: '0.35rem' }}>
            Demo User: <strong>superadmin</strong> • Password: <strong>admin123</strong>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Auto-fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
