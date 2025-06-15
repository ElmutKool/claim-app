import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '48px', textAlign: 'center' }}>
      <button
        onClick={() => navigate('/confirm')}
        style={{ fontSize: '32px', padding: '20px 40px' }}
      >
        $CLAIM
      </button>

      <p style={{ marginTop: '24px', fontSize: '16px' }}>
        We made it stupid simple.<br />
        Just tap to claim your first 10 $CLAIM.
      </p>

      <p style={{ marginTop: '40px', fontSize: '14px' }}>
        Already have an account?{' '}
        <span
          onClick={() => navigate('/dashboard')}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
