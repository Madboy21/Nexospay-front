import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import AdViewer from "./components/AdViewer";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const totalTasks = 20;

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);
  }, []);

  const handleComplete = () => {
    setCompleted(prev => prev + 1);
    setBalance(prev => prev + 1); // 1 VET per ad
  };

  return (
    <div style={{ paddingBottom: 70, color: '#fff', background: '#121212', minHeight: '100vh' }}>
      {user ? (
        <>
          <Header user={user} balance={balance} />
          <TaskProgress total={totalTasks} completed={completed} />
          {completed < totalTasks ? (
            <AdViewer onComplete={handleComplete} />
          ) : (
            <p style={{ textAlign: 'center' }}>✅ All 20 tasks completed today!</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
      <Navbar />
    </div>
  );
}

export default App;

