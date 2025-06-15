import React, { useEffect, useState } from 'react';
import { auth, db, signInWithGoogle } from './firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);

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
          setLastClaim(data.lastClaim?.toDate?.() || null);
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

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div style={{ padding: 24 }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <p><strong>Wallet:</strong> {wallet || 'Not linked yet'}</p>
          <p><strong>Balance:</strong> {balance} BURP</p>
          <p><strong>Last Claim:</strong> {lastClaim ? lastClaim.toString() : 'Never'}</p>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}
