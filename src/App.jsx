import React, { useEffect, useState } from 'react';
import './App.css';
import { auth, firestore, signInWithGoogle } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import WalletConnect from './WalletConnect.jsx';
import Withdraw from './Withdraw';
import Leaderboard from './Leaderboard';

const CLAIM_INTERVAL = 3 * 60 * 60 * 1000; // 3h

function App() {
  const [user, setUser] = useState(null);
  const [lastClaimTime, setLastClaimTime] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userRef = doc(firestore, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            balance: 5, // registreerimisboonus
            lastClaim: Date.now(),
            created: serverTimestamp()
          });
          setBalance(5);
          setLastClaimTime(Date.now());
        } else {
          setBalance(userSnap.data().balance || 0);
          setLastClaimTime(userSnap.data().lastClaim || 0);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const canClaim = Date.now() - lastClaimTime > CLAIM_INTERVAL;

  const handleClaim = async (multiplier = 1) => {
    if (!user || !canClaim) return;
    const reward = 1 * multiplier;
    const userRef = doc(firestore, 'users', user.uid);
    await updateDoc(userRef, {
      balance: balance + reward,
      lastClaim: Date.now(),
    });
    setBalance(balance + reward);
    setLastClaimTime(Date.now());
  };

  const showCountdown = () => {
    const timeLeft = CLAIM_INTERVAL - (Date.now() - lastClaimTime);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <h1>$CLAIM</h1>
    {loading ? (
      <p>Loading...</p>
    ) : user ? (
      <>
        <p>Hi, {user.displayName}!</p>
        <p>Balance: <strong>{balance}</strong> $CLAIM</p>
        {canClaim ? (
          <>
            <button onClick={() => handleClaim(1)}>Claim</button>
            <button onClick={() => handleClaim(2)}>Claim x2 (Ad)</button>
          </>
        ) : (
          <p>Next claim in: {showCountdown()}</p>
        )}
        <br />
        <button onClick={() => signOut(auth)}>Log out</button>

        <hr style={{ margin: '30px 0' }} />
        <Withdraw user={user} balance={balance} />
        <WalletConnect user={user} wallet={userSnap?.data()?.wallet} />
        <Leaderboard />
      </>
    ) : (
      <>
        <p>Log in to start claiming free $CLAIM every 3h</p>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </>
    )}
  </div>
);
}

export default App;
