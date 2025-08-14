import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { getUserStats, updateUserProgress } from "./utils/api";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

function Home({ user, stats, handleAdClick }) {
  const referralLink = `https://t.me/Nexospay_bot?start=${user.telegramId}`;

  return (
    <>
      <Header user={user} stats={stats} />
      <TaskProgress stats={stats} />

      {stats.remainingToday > 0 ? (
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
            <p>📢 Share your referral link and earn {stats.referralBonus}% bonus!</p>
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
        <p style={{ textAlign: "center", marginTop: 20 }}>
          ✅ All tasks completed today!
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
  const [stats, setStats] = useState(null);
  const [adsReady, setAdsReady] = useState(false);
  const backendUrl = "https://nexospay-backend.vercel.app/";

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

  // Mock Telegram user for desktop testing
  useEffect(() => {
    let telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user || {
      id: "123456",
      first_name: "Test",
      last_name: "User",
      username: "testuser",
      telegramId: "123456",
    };
    setUser(telegramUser);

    getUserStats(telegramUser.id)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  const handleAdClick = () => {
    if (!adsReady || !user || !stats) return alert("Please wait, ad system loading...");

    updateUserProgress(user.id, "watch_ad", stats.referredBy)
      .then((res) => {
        setStats(res.data);
        alert(`✅ Ad watched! +${res.data.tokenPerTask} VET`);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Error watching ad");
      });
  };

  if (!user || !stats)
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
          <Route path="/" element={<Home user={user} stats={stats} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.telegramId} backendUrl={backendUrl} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
