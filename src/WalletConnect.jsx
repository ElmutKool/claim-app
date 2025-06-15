import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

function WalletConnect({ user, wallet }) {
  const [newWallet, setNewWallet] = useState(wallet || '');
  const [saving, setSaving] = useState(false);

  const saveWallet = async () => {
    if (!user || !newWallet) return;
    setSaving(true);
    await updateDoc(doc(firestore, 'users', user.uid), {
      wallet: newWallet,
    });
    setSaving(false);
    alert('Wallet linked!');
  };

  return (
    <div>
      <h3>Connect your wallet</h3>
      <input
        type="text"
        placeholder="Enter Solana wallet address"
        value={newWallet}
        onChange={(e) => setNewWallet(e.target.value)}
      />
      <button onClick={saveWallet} disabled={saving}>
        {saving ? 'Saving...' : 'Save Wallet'}
      </button>
    </div>
  );
}

export default WalletConnect;
