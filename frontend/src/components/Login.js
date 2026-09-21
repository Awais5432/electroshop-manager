import { useState } from 'react';

export default function Login({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default PIN is 1234 - can be changed in settings later
    if (pin === '1234') {
      onLogin();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
            GM Electric Store
          </h1>
          <p style={{ color: '#6b7280' }}>Enter your PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              maxLength={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              autoFocus
            />
            {error && (
              <p style={{ color: '#ef4444', marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          Default PIN: 1234
        </p>
      </div>
    </div>
  );
}
