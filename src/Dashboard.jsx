import React, { useEffect, useState } from 'react';
import { auth, firestore } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Withdraw from './Withdraw';
import WalletConnect from './WalletConnect';
import Leaderboard from './Leaderboard';

const CLAIM_INTERVAL = 3 * 60 * 60 * 1000; // 3h

export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser);
  const [balance, setBalance] = useState(0);
  const [lastClaimTime, setLastClaimTime] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      const ref = doc(firestore, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setBalance(data.balance || 0);
        setLastClaimTime(data.lastClaim || 0);
        setWallet(data.wallet || null);
      }
      setLoading(false);
    };
    loadUserData();
  }, [user]);

  const canClaim = Date.now() - lastClaimTime > CLAIM_INTERVAL;

  const handleClaim = async (multiplier = 1) => {
    if (!user || !canClaim) return;
    const reward = 10 * multiplier;
    const ref = doc(firestore, 'users', user.uid);
    await updateDoc(ref, {
      balance: balance + reward,
      lastClaim: Date.now(),
    });
    setBalance(balance + reward);
    setLastClaimTime(Date.now());
  };

  const showCountdown = () => {
    const timeLeft = CLAIM_INTERVAL - (Date.now() - lastClaimTime);
    const h = Math.floor(timeLeft / (1000 * 60 * 60));
    const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  if (loading) return <p style={{ color: 'white' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>$CLAIM Dashboard</h1>
      <p style={styles.greeting}>Welcome, {user.displayName}</p>
      <p style={styles.wallet}>
        <strong>Wallet:</strong>{' '}
        {wallet ? wallet : <span style={{ color: '#ff8888' }}>Not linked yet</span>}
      </p>

      <div style={styles.section}>
        <h2>Balance: {balance} $CLAIM</h2>
        <p>Next Claim In: {showCountdown()}</p>
        {canClaim ? (
          <>
            <button style={styles.button} onClick={() => handleClaim(1)}>
              Claim 10 $CLAIM
            </button>
            <button style={styles.button} onClick={() => handleClaim(2)}>
              🎬 Watch Ad to Claim 20 $CLAIM
            </button>
          </>
        ) : (
          <button style={{ ...styles.button, opacity: 0.5 }} disabled>
            ⏳ Claim available in {showCountdown()}
          </button>
        )}
      </div>

      <div style={styles.section}>
        <Withdraw user={user} balance={balance} />
      </div>

      <div style={styles.section}>
        <WalletConnect user={user} wallet={wallet} />
      </div>

      <div style={styles.section}>
        <Leaderboard />
      </div>

      <div style={{ marginTop: '40px' }}>
        <button style={styles.logoutButton} onClick={() => signOut(auth)}>Log out</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#0a0a0a',
    color: 'white',
    minHeight: '100vh',
    padding: '32px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  greeting: {
    fontSize: '18px',
    marginBottom: '4px',
  },
  wallet: {
    fontSize: '14px',
    marginBottom: '24px',
  },
  section: {
    background: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    margin: '24px auto',
    maxWidth: '400px',
    boxShadow: '0 0 12px rgba(0,255,200,0.1)',
  },
  button: {
    backgroundColor: '#00ffcc',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '12px',
    margin: '8px',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
