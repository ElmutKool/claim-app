import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '32px' }}>$CLAIM</h1>

      <button
        onClick={() => navigate('/confirm')}
        style={{
          fontSize: '28px',
          padding: '18px 36px',
          borderRadius: '12px',
          backgroundColor: '#00cc88',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        Claim Now
      </button>

      <p style={{ marginTop: '24px', fontSize: '16px', color: '#555' }}>
        We made it stupid simple.<br />
        Just tap to claim your first <strong>10 $CLAIM</strong>.
      </p>

      <p style={{ marginTop: '40px', fontSize: '14px', color: '#777' }}>
        Already have an account?{' '}
        <span
          onClick={() => navigate('/dashboard')}
          style={{
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
