import React, { useEffect } from 'react';
import { signInWithGoogle, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function ClaimConfirm() {
  const navigate = useNavigate();

  // Kui juba logitud sisse, suuna kohe dashboardile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // login triggerib useEffecti kaudu navigeerimise
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleAdWatch = () => {
    alert('🎬 Simuleerime reklaami... pärast logime sisse ja saame $20');
    handleLogin(); // tulevikus asendame selle: esmalt näita ad, siis logi
  };

  return (
    <div style={{ padding: '48px', textAlign: 'center' }}>
      <h2>Let’s lock in your $CLAIM.</h2>
      <p>Choose how you want to confirm your reward:</p>

      <button
        onClick={handleLogin}
        style={{ marginTop: '24px', fontSize: '18px', padding: '12px 24px' }}
      >
        ✅ Login with Google to confirm your $CLAIM
      </button>

      <p style={{ margin: '20px 0', fontSize: '16px' }}>or</p>

      <button
        onClick={handleAdWatch}
        style={{ fontSize: '18px', padding: '12px 24px' }}
      >
        🎬 Watch short ad to double your $CLAIM to $20
      </button>
    </div>
  );
}
