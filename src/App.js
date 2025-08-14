import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";
import { getUserStats, updateUserProgress } from "./utils/api";

function Home({ user, stats, handleAdClick }) {
  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;

  return (
    <>
      <Header user={user} balance={stats.tokens} />
      <TaskProgress total={stats.dailyLimit} completed={stats.tasksToday} />

      {stats.tasksToday < stats.dailyLimit && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            style={{
              background: "#0af",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={handleAdClick}
          >
            🎯 Watch Ad & Earn
          </button>
        </div>
      )}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>📢 Referral Link (Earn 10% from friend):</p>
        <input
          type="text"
          value={referralLink}
          readOnly
          style={{
            width: "80%",
            padding: 8,
            borderRadius: 5,
            border: "1px solid #0af",
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
      <Link to="/" style={{ color: "#0af", textDecoration: "none", padding: 10 }}>
        🏠 Home
      </Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none", padding: 10 }}>
        💸 Withdraw
      </Link>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [adsReady, setAdsReady] = useState(false);

  const backendUrl = "http://localhost:5000"; // Change to your backend
  const totalTasks = 20;

  // Load Monetag SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298"; // Your Monetag zone ID
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => {
      console.log("✅ Monetag SDK loaded");
      setAdsReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Telegram user init + fetch stats
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
      getUserStats(telegramUser.id).then((res) => setStats(res.data));
    }
  }, []);

  // Ad click handler
  const handleAdClick = async () => {
    if (!adsReady) return alert("Ad system loading...");
    if (!user) return;

    if (typeof window.show_9712298 === "function") {
      window
        .show_9712298()
        .then(async () => {
          await updateUserProgress(user.id, "ad_watch");
          const res = await getUserStats(user.id);
          setStats(res.data);
          alert("✅ Ad watched! VET earned.");
        })
        .catch((err) => {
          console.error("Ad failed:", err);
          alert("Ad could not be shown.");
        });
    } else {
      alert("Ad function not available yet.");
    }
  };

  if (!user || !stats)
    return (
      <div
        style={{
          paddingTop: 50,
          textAlign: "center",
          color: "#fff",
          background: "#121212",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );

  return (
    <Router>
      <div style={{ paddingBottom: 70, paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <Routes>
          <Route path="/" element={<Home user={user} stats={stats} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}
