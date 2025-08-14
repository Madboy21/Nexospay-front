import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import api, { getUserStats, updateUserProgress } from "./utils/api";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

// Home Component
function Home({ user, stats, handleAdClick }) {
  if (!stats) return <p style={{ textAlign: "center", color: "#fff" }}>Loading stats...</p>;

  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;

  return (
    <>
      <Header user={user} balance={stats.tokens} />
      <TaskProgress total={stats.dailyLimit} completed={stats.tasksToday} />

      {stats.tasksToday < stats.dailyLimit ? (
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

          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#fff" }}>📢 Share your referral link and earn 10% from friends!</p>
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
        <p style={{ textAlign: "center", marginTop: 20, color: "#0af" }}>
          ✅ All {stats.dailyLimit} tasks completed today!
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
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    const telegramUser = tg?.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) fetchStats(telegramUser.id);
  }, []);

  const fetchStats = async (telegramId) => {
    try {
      const res = await getUserStats(telegramId);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleAdClick = async () => {
    if (!adsReady) return alert("Ad system loading... Please wait a few seconds.");
    if (!user) return;

    if (typeof window.show_9712298 === "function") {
      window
        .show_9712298()
        .then(async () => {
          try {
            await updateUserProgress(user.id, "Ad Task");
            fetchStats(user.id); // refresh stats
            alert("✅ Ad watched! 1 VET added.");
          } catch (err) {
            console.error(err);
            alert("Failed to update task.");
          }
        })
        .catch((err) => {
          console.error("Ad failed:", err);
          alert("Ad could not be shown. Try again later.");
        });
    } else {
      alert("Ad function not available yet.");
    }
  };

  if (!user) return <div style={{ paddingTop: 40, color: "#fff", background: "#121212", height: "100vh", textAlign: "center" }}>Loading...</div>;

  return (
    <Router>
      <div style={{ paddingBottom: 70, color: "#fff", background: "#121212", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", paddingTop: 20, paddingLeft: 20, paddingRight: 20, boxSizing: "border-box" }}>
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
