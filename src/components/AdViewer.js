import React, { useState } from 'react';

const AdViewer = ({ onComplete }) => {
  const [viewing, setViewing] = useState(false);

  const handleWatch = () => {
    setViewing(true);
    setTimeout(() => {
      setViewing(false);
      onComplete(); // Increase task count
    }, 5000); // simulate 5s ad
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <button onClick={handleWatch}>▶ Start Task</button>

      {viewing && (
        <div style={{ marginTop: 20, padding: 20, border: '1px solid #888' }}>
          <p>📺 Watching Ad... Please wait</p>
        </div>
      )}
    </div>
  );
};

export default AdViewer;
