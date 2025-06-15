import React, { useEffect, useState } from 'react';
import { auth, db, signInWithGoogle } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const COOLDOWN_TIME = 3 * 60 * 60 * 1000; // 3 hours in ms

  // Live update every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateCooldown(lastClaim);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastClaim]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setWallet(data.wallet || '');
          setBalance(data.balance || 0);
          const claimTime = data.lastClaim?.toDate?.() || null;
          setLastClaim(claimTime);
          updateCooldown(claimTime);
        } else {
          await setDoc(userRef, {
            wallet: '',
            balance: 0,
            lastClaim: null,
          });
        }
      }
    });
  }, []);

  const updateCooldown = (last) => {
    if (!last) {
      setCooldown(0);
      return;
    }
    const now = Date.now();
    const lastTime = new Date(last).getTime();
    const remaining = COOLDOWN_TIME - (now - lastTime);
    setCooldown(remaining > 0 ? remaining : 0);
  };

  const handleClaim = async () => {
    if (!user) return;
    const now = new Date();
    const userRef = doc(db, 'users', user.uid);
    const newBalance = balance + 10;
    await updateDoc(userRef, {
      balance: newBalance,
      lastClaim: now,
    });
    setBalance(newBalance);
    setLastClaim(now);
    updateCooldown(now);
  };

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <p><strong>Wallet:</strong> {wallet || 'Not linked yet'}</p>
          <p><strong>Balance:</strong> {balance} $CLAIM</p>
          <p><strong>Next Claim In:</strong> {formatTime(cooldown)}</p>

          {cooldown <= 0 ? (
            <button
              onClick={handleClaim}
              style={{
                marginTop: 24,
                padding: '12px 24px',
                fontSize: 18,
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              🎁 Claim 10 $CLAIM
            </button>
          ) : (
            <button
              disabled
              style={{
                marginTop: 24,
                padding: '12px 24px',
                fontSize: 18,
                backgroundColor: '#ccc',
                color: '#666',
                border: 'none',
                borderRadius: 8,
                cursor: 'not-allowed',
              }}
            >
              ⏳ Claim available in {formatTime(cooldown)}
            </button>
          )}
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}
