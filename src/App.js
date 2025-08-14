import React, { useEffect, useState } from "react";
import axios from "./api"; // aita api.js file import
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

// Home Component
function Home({ user, stats, handleAdClick }) {
  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;

  return (
    <div style={{ textAlign: "center" }}>
      <Header user={user} balance={stats?.tokens || 0} />
      <TaskProgress
        total={stats?.dailyLimit || 20}
        completed={stats?.tasksToday || 0}
      />

      {stats?.tasksToday < stats?.dailyLimit ? (
        <div style={{ marginTop: 20 }}>
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

          <div style={{ marginTop: 20 }}>
            <p>📢 Share your referral link and earn 10% bonus!</p>
            <input
              type="text"
              value={referralLink}
              readOnly
              style={{
                width: "80%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #0af",
              }}
            />
            <button
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                background: "#0af",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => navigator.clipboard.writeText(referralLink)}
            >
              Copy
            </button>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: 20 }}>
          ✅ All {stats?.dailyLimit} tasks completed today!
        </p>
      )}
    </div>
  );
}

// Navbar
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
    </nav>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [adsReady, setAdsReady] = useState(false);

  const backendUrl = "https://nexospay-backend.vercel.app";

  // Load Monetag SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298";
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => setAdsReady(true);
    document.body.appendChild(script);
  }, []);

  // Telegram user init + fetch stats
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    if (!telegramUser) return;
    setUser(telegramUser);

    // register & fetch stats
    axios
      .post("/api/users/register", {
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        referredBy: null,
      })
      .then(() => axios.post("/api/users/stats", { telegramId: telegramUser.id }))
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAdClick = () => {
    if (!adsReady) return alert("Ad system loading... wait a moment");
    if (typeof window.show_9712298 === "function") {
      window
        .show_9712298()
        .then(() => {
          // update backend after ad watched
          axios
            .post("/api/tasks/complete-task", { telegramId: user.id })
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  if (!user) return <div style={{ color: "#fff", paddingTop: 40 }}>Loading...</div>;

  return (
    <Router>
      <div
        style={{
          paddingBottom: 70,
          color: "#fff",
          background: "#121212",
          minHeight: "100vh",
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Routes>
          <Route path="/" element={<Home user={user} stats={stats} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} backendUrl={backendUrl} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
