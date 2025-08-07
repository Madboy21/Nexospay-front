import React, { useState } from 'react';
import API from '../utils/api';

export default function Withdraw({ user, onWithdrawSuccess }) {
  const [wallet, setWallet] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post('/withdraw', {
        telegramId: user.telegramId,
        wallet,
        amount: 100,  
      });
      alert('Withdraw request sent!');
      onWithdrawSuccess();
    } catch {
      alert('Withdraw failed!');
    }
  };

  return (
    <div>
      <input
        placeholder="Enter wallet address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
      />
      <button onClick={handleSubmit}>Withdraw</button>
    </div>
  );
}
