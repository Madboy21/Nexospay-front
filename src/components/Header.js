import React from 'react';

const Header = ({ user, balance }) => {
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>👋 Welcome, {user?.first_name}</h2>
      <p>💰 Balance: <strong>{balance} VET</strong></p>
    </div>
  );
};

export default Header;
