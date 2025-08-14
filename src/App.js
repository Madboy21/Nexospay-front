import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

// Home Component
function Home({ user, balance, completed, totalTasks, handleAdClick }) {
  return (
    <>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />
      {completed < totalTasks ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            style={{
              background: "#0af",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={handleAdClick}
          >
            🎯 Watch Ad & Earn
          </button>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          ✅ All {totalTasks} tasks completed today!
        </p>
      )}
    </>
  );
}

// Navbar Component
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

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [adsReady, setAdsReady] = useState(false);
  const totalTasks = 20;
  const backendUrl = "http://localhost:5000"; // Change to your backend URL

  // Load Monetag SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298";
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => {
      console.log("✅ Monetag SDK loaded");
      setAdsReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Telegram user init + fetch from backend
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
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

  // Save task progress to backend
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

  // Task complete handler
  const handleComplete = () => {
    const newCompleted = completed + 1;
    const newBalance = balance + 1;

    setCompleted(newCompleted);
    setBalance(newBalance);

    saveProgress(newCompleted, newBalance);
  };

  // Referral reward (08%)
  const handleReferralReward = (referrerId) => {
    if (!referrerId) return;
    axios
      .post(`${backendUrl}/api/user/referral`, {
        referrerId,
        reward: 0.08, // 8% reward
      })
      .then(() => console.log("Referral rewarded"))
      .catch((err) => console.error(err));
  };

  // Watch Ad button
  const handleAdClick = () => {
    if (!adsReady) {
      alert("Ad system loading... Please wait a few seconds.");
      return;
    }

    if (typeof window.show_9712298 === "function") {
      window
        .show_9712298()
        .then(() => {
          handleComplete();
          alert("✅ Ad watched! 1 VET added.");
        })
        .catch((err) => {
          console.error("Ad failed:", err);
          alert("Ad could not be shown. Please try again later.");
        });
    } else {
      alert("Ad function not available yet.");
    }
  };

  if (!user)
    return (
      <div style={{ paddingTop: 40, color: "#fff", background: "#121212", height: "100vh", textAlign: "center" }}>
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
                handleAdClick={handleAdClick}
              />
            }
          />
          <Route
            path="/withdraw"
            element={<Withdraw telegramId={user.id} backendUrl={backendUrl} />}
          />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
