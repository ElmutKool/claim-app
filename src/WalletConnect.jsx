import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

export default function WalletConnect({ user, wallet }) {
  const [newWallet, setNewWallet] = useState(wallet || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const saveWallet = async () => {
    if (!user || !newWallet.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        wallet: newWallet.trim(),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to save wallet', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 32, padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>🔗 Connect your wallet</h3>
      <p style={{ marginBottom: 8 }}>Enter your Solana wallet to enable future withdrawals.</p>

      <input
        type="text"
        placeholder="e.g. 9xQeWv...T8Hy"
        value={newWallet}
        onChange={(e) => {
          setNewWallet(e.target.value);
          setSuccess(false);
        }}
        style={{
          padding: '10px',
          width: '100%',
          maxWidth: '400px',
          fontSize: '16px',
          marginBottom: '12px',
          border: '1px solid #ccc',
          borderRadius: '6px',
        }}
      />

      <br />

      <button
        onClick={saveWallet}
        disabled={saving}
        style={{
          padding: '10px 24px',
          fontSize: '16px',
          backgroundColor: '#111',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {saving ? 'Saving...' : 'Save Wallet'}
      </button>

      {success && (
        <p style={{ color: 'green', marginTop: 10 }}>
          ✅ Wallet linked successfully!
        </p>
      )}
    </div>
  );
}
