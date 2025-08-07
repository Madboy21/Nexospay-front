import React from 'react';

const TaskProgress = ({ total, completed }) => {
  const remaining = total - completed;
  const percent = Math.round((completed / total) * 100);

  return (
    <div style={{ padding: 20 }}>
      <h3>🎯 Daily Tasks</h3>
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Remaining: {remaining}</p>
      <div style={{ background: '#333', height: 10, borderRadius: 5 }}>
        <div style={{
          width: `${percent}%`,
          background: '#4caf50',
          height: '100%',
          borderRadius: 5
        }}></div>
      </div>
    </div>
  );
};

export default TaskProgress;
