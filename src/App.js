// App.js
import React, { useEffect, useState } from "react";
import api, { getUserStats, registerUser, updateUserProgress } from "./utils/api";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

// Home Component
function Home({ user, stats, handleAdClick }) {
  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;

  if (!stats) return <p style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>Loading stats...</p>;

  const tasksRemaining = stats.dailyLimit - stats.tasksToday;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: 20 }}>
      <Header user={user} balance={stats.tokens || 0} />
      <TaskProgress total={stats.dailyLimit} completed={stats.tasksToday} />

      <div style={{ marginTop: 20 }}>
        {tasksRemaining > 0 ? (
          <button
            style={{
              background: "#0af",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={handleAdClick}
          >
            🎯 Watch Ad & Earn {stats.tokenPerTask} VET
          </button>
        ) : (
          <p style={{ color: "#0f0", marginTop: 20 }}>
            ✅ All {stats.dailyLimit} tasks completed today!
          </p>
        )}
      </div>

      {/* Referral Section */}
      <div style={{ marginTop: 30, textAlign: "left" }}>
        <p style={{ color: "#fff" }}>Referral Link (Earn {stats.referralBonus}% bonus):</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={referralLink}
            readOnly
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 5,
              border: "1px solid #0af",
              background: "#111",
              color: "#fff",
            }}
          />
          <button
            style={{
              marginLeft: 10,
              padding: "8px 12px",
              background: "#0af",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
            onClick={() => navigator.clipboard.writeText(referralLink)}
          >
            Copy
          </button>
        </div>
      </div>

      <p style={{ marginTop: 20, color: "#ff0" }}>💰 Minimum Withdraw: {stats.minWithdraw} VET</p>
    </div>
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
        padding: "12px 0",
        color: "#0af",
        fontWeight: "bold",
        boxSizing: "border-box",
      }}
    >
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>🏠 Home</Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none" }}>💸 Withdraw</Link>
    </nav>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [adsReady, setAdsReady] = useState(false);

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

    registerUser({
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      referredBy: null,
    })
      .then(() => getUserStats(telegramUser.id))
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAdClick = () => {
    if (!adsReady) return alert("Ad system loading... wait a moment");
    if (typeof window.show_9712298 === "function") {
      window.show_9712298()
        .then(() => {
          updateUserProgress(user.id)
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  if (!user) return <div style={{ color: "#fff", paddingTop: 50, textAlign: "center" }}>Loading...</div>;

  return (
    <Router>
      <div style={{ paddingBottom: 70, color: "#fff", background: "#121212", minHeight: "100vh", boxSizing: "border-box" }}>
        <Routes>
          <Route path="/" element={<Home user={user} stats={stats} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
