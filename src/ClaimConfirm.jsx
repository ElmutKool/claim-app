import React from 'react';
import { signInWithGoogle } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function ClaimConfirm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div style={{ padding: '48px', textAlign: 'center' }}>
      <h2>Let’s lock in your $CLAIM.</h2>

      <button
        onClick={handleLogin}
        style={{ marginTop: '24px', fontSize: '18px', padding: '12px 24px' }}
      >
        ✅ Login with Google to confirm your $CLAIM
      </button>

      <p style={{ margin: '20px 0', fontSize: '16px' }}>or</p>

      <button
        onClick={() => alert('Show ad here')} // Reklaami trigger (hiljem asendada)
        style={{ fontSize: '18px', padding: '12px 24px' }}
      >
        🎬 Watch short ad to double your $CLAIM to $20
      </button>
    </div>
  );
}
