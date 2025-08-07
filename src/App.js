import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
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
          ✅ All {totalTasks} tasks completed today!
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
        boxSizing: "border-box",
      }}
    >
      <Link to="/" style={{ color: "#0af", textDecoration: "none", padding: "10px" }}>
        🏠 Home
      </Link>
      <Link to="/" style={{ color: "#0af", textDecoration: "none", padding: "10px" }}>
        💰 Earn
      </Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none", padding: "10px" }}>
        💸 Withdraw
      </Link>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const totalTasks = 20;
  const backendUrl = "http://localhost:5000"; // Change this to your backend URL

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
      // Fetch user data from backend
      axios
        .get(`${backendUrl}/api/user/${telegramUser.id}`)
        .then((res) => {
          if (res.data) {
            setBalance(res.data.balance || 0);
            setCompleted(res.data.completed || 0);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, []);

  const saveProgress = (newCompleted, newBalance) => {
    if (!user) return;
    axios
      .post(`${backendUrl}/api/user/update`, {
        telegramId: user.id,
        completed: newCompleted,
        balance: newBalance,
      })
      .catch((err) => {
        console.error("Failed to save progress:", err);
      });
  };

  const handleComplete = () => {
    const newCompleted = completed + 1;
    const newBalance = balance + 1;

    setCompleted(newCompleted);
    setBalance(newBalance);

    saveProgress(newCompleted, newBalance);
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
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} backendUrl={backendUrl} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
