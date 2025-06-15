import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const q = query(collection(firestore, 'users'), orderBy('balance', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      setLeaders(snapshot.docs.map(doc => doc.data()));
    };
    fetchLeaders();
  }, []);

  return (
    <div>
      <h3>Top $CLAIMers</h3>
      <ol>
        {leaders.map((u, i) => (
          <li key={i}>
            {u.email || 'Anonymous'} — {u.balance} $CLAIM
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
