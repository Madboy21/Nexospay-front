import React from 'react';

const Navbar = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#222',
      display: 'flex',
      justifyContent: 'space-around',
      padding: 10
    }}>
      <button>🏠 Home</button>
      <button>🎯 Earn</button>
      <button>💸 Withdraw</button>
      <button>👤 Profile</button>
    </div>
  );
};

export default Navbar;
