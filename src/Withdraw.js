import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';

function Withdraw({ user, balance }) {
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!user || balance < 10) return alert('Min withdrawal: 10 $CLAIM');
    const confirmed = window.confirm('Watch ad to process withdrawal?');
    if (!confirmed) return;

    // Simuleeri ad vaatamist
    alert('🟡 Ad watched!');
    setWithdrawing(true);

    await updateDoc(doc(firestore, 'users', user.uid), {
      balance: 0,
      lastWithdrawal: Date.now(),
    });

    setWithdrawing(false);
    alert('Withdrawal request submitted!');
  };

  return (
    <div>
      <h3>Withdraw your $CLAIM</h3>
      <p>Min withdrawal: 10 $CLAIM</p>
      <button onClick={handleWithdraw} disabled={withdrawing || balance < 10}>
        {withdrawing ? 'Processing...' : 'Withdraw'}
      </button>
    </div>
  );
}

export default Withdraw;
