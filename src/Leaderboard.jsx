import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const q = query(
        collection(firestore, 'users'),
        orderBy('balance', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      setLeaders(snapshot.docs.map(doc => doc.data()));
    };
    fetchLeaders();
  }, []);

  const obfuscateEmail = (email) => {
    if (!email) return 'Anonymous';
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return name.slice(0, 3) + '***@' + domain;
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h3>🏆 Top $CLAIMers</h3>
      <table style={{ width: '100%', maxWidth: 600, margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>User</th>
            <th style={{ textAlign: 'right', padding: '8px 12px' }}>$CLAIM</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((u, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px 12px' }}>{i + 1}</td>
              <td style={{ padding: '8px 12px' }}>{obfuscateEmail(u.email)}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{u.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
