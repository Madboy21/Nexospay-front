import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";
import { getUserStats, completeTask, registerUser } from "./utils/api";

function Home({ user }) {
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const totalTasks = 20;
  const [adsReady, setAdsReady] = useState(false);

  // Monetag SDK load
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298";
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => setAdsReady(true);
    document.body.appendChild(script);
  }, []);

  // Fetch user stats
  useEffect(() => {
    if (!user) return;
    registerUser({ telegramId: user.id, username: user.username, firstName: user.first_name, lastName: user.last_name })
      .then(() => getUserStats(user.id))
      .then(res => {
        setBalance(res.data.tokens);
        setCompleted(res.data.tasksToday);
      });
  }, [user]);

  const handleAdClick = async () => {
    if (!adsReady) return alert("Ads loading...");
    if (typeof window.show_9712298 === "function") {
      try {
        await window.show_9712298();
        const res = await completeTask(user.id);
        setBalance(res.data.tokens);
        setCompleted(res.data.tasksToday);
        alert("✅ Ad watched! +1 VET");
      } catch {
        alert("❌ Ad failed");
      }
    }
  };

  const referralLink = `https://t.me/Nexospay_bot?start=${user?.id}`;

  return (
    <div>
      <Header user={user} balance={balance} />
      <TaskProgress completed={completed} total={totalTasks} />
      {completed < totalTasks && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={handleAdClick}
            style={{ padding: "10px 20px", background: "#0af", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}
          >
            🎯 Watch Ad & Earn
          </button>
          <div style={{ marginTop: 20 }}>
            <p>📢 Referral Link:</p>
            <input type="text" readOnly value={referralLink} style={{ width: "80%", padding: 8, borderRadius: 5 }} />
            <button onClick={() => navigator.clipboard.writeText(referralLink)} style={{ marginLeft: 10, padding: 8, background: "#0af", color: "#fff", border: "none", borderRadius: 5 }}>
              Copy
            </button>
          </div>
        </div>
      )}
      {completed >= totalTasks && <p style={{ textAlign: "center", marginTop: 20 }}>✅ All {totalTasks} tasks completed today!</p>}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/withdraw" element={<Withdraw telegramId={user?.id} />} />
      </Routes>
      <nav style={{ position: "fixed", bottom: 0, width: "100%", display: "flex", justifyContent: "space-around", background: "#222", color: "#0af", padding: 10 }}>
        <Link to="/" style={{ color: "#0af" }}>🏠 Home</Link>
        <Link to="/" style={{ color: "#0af" }}>💰 Earn</Link>
        <Link to="/withdraw" style={{ color: "#0af" }}>💸 Withdraw</Link>
      </nav>
    </Router>
  );
}
