import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import AdViewer from "./components/AdViewer";
import Withdraw from "./components/Withdraw";

function Home({ user, balance, completed, totalTasks, handleComplete }) {
  return (
    <>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />
      {completed < totalTasks ? (
        <AdViewer onComplete={handleComplete} />
      ) : (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          ✅ All 20 tasks completed today!
        </p>
      )}
    </>
  );
}

function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#222",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        color: "#0af",
        fontWeight: "bold",
      }}
    >
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>
        🏠 Home
      </Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none" }}>
        💸 Withdraw
      </Link>
      <Link to="/settings" style={{ color: "#0af", textDecoration: "none" }}>
        ⚙️ Settings
      </Link>
    </nav>
  );
}

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
    setCompleted((prev) => prev + 1);
    setBalance((prev) => prev + 1); // 1 VET per ad
  };

  if (!user)
    return (
      <div
        style={{
          paddingTop: 40,
          color: "#fff",
          background: "#121212",
          height: "100vh",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );

  return (
    <Router>
      <div
        style={{
          paddingBottom: 70,
          color: "#fff",
          background: "#121212",
          minHeight: "100vh",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                balance={balance}
                completed={completed}
                totalTasks={totalTasks}
                handleComplete={handleComplete}
              />
            }
          />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} />} />
          <Route
            path="/settings"
            element={
              <div style={{ textAlign: "center" }}>
                <h2>Settings page coming soon!</h2>
              </div>
            }
          />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
