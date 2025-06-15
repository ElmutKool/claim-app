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

  // Kontrolli kasutajat ja loe Firestore andmed
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

  // Arvuta cooldown millisekundites
  const updateCooldown = (last) => {
    if (!last) return;
    const now = Date.now();
    const lastTime = new Date(last).getTime();
    const remaining = 86400000 - (now - lastTime);
    setCooldown(remaining > 0 ? remaining : 0);
  };

  // BURP-i nõudmine
  const handleClaim = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const newBalance = balance + 10;
    const now = new Date();
    await updateDoc(userRef, {
      balance: newBalance,
      lastClaim: now,
    });
    setBalance(newBalance);
    setLastClaim(now);
    updateCooldown(now);
  };

  // Google login
  const handleLogin = async () => {
    await signInWithGoogle();
  };

  // Cooldowni vormindamine
  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ padding: 24 }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <p><strong>Wallet:</strong> {wallet || 'Not linked yet'}</p>
          <p><strong>Balance:</strong> {balance} BURP</p>
          <p><strong>Last Claim:</strong> {lastClaim ? lastClaim.toString() : 'Never'}</p>

          {cooldown > 0 ? (
            <p>⏳ Next claim in: {formatTime(cooldown)}</p>
          ) : (
            <button onClick={handleClaim}>Claim 10 BURP</button>
          )}
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}
