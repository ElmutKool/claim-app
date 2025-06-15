import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

export default function Withdraw({ user, balance }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [status, setStatus] = useState('');

  const handleWithdraw = async () => {
    if (!user) return;

    if (balance < 10) {
      setStatus('❌ Minimum withdrawal is 10 $CLAIM.');
      return;
    }

    const confirmed = window.confirm('🎬 Watch a short ad to confirm your withdrawal?');
    if (!confirmed) return;

    // Reklaami simuleerimine
    alert('✅ Ad watched!');
    setWithdrawing(true);
    setStatus('⏳ Submitting withdrawal request...');

    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        balance: 0,
        lastWithdrawal: Date.now(),
      });
      setStatus('✅ Withdrawal request submitted successfully!');
    } catch (err) {
      console.error('Withdrawal failed:', err);
      setStatus('❌ Something went wrong. Try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div style={{ marginTop: 40, padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>💸 Withdraw your $CLAIM</h3>
      <p style={{ marginBottom: 12 }}>Minimum withdrawal: <strong>10 $CLAIM</strong></p>

      <button
        onClick={handleWithdraw}
        disabled={withdrawing || balance < 10}
        style={{
          padding: '10px 24px',
          fontSize: '16px',
          backgroundColor: balance >= 10 ? '#111' : '#888',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: balance >= 10 && !withdrawing ? 'pointer' : 'not-allowed'
        }}
      >
        {withdrawing ? 'Processing...' : 'Withdraw'}
      </button>

      {status && (
        <p style={{ marginTop: 12, color: status.includes('❌') ? 'red' : 'green' }}>{status}</p>
      )}
    </div>
  );
}
