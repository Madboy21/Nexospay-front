import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Navbar from "./components/Navbar";
import Withdraw from "./components/Withdraw";
import { getUserStats } from "./utils/api";

function Home({ user }) {
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [adsReady, setAdsReady] = useState(false);
  const totalTasks = 20;

  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;

  // Monetag SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298";
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => setAdsReady(true);
    document.body.appendChild(script);
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getUserStats(user.id);
        setBalance(res.data.tokens);
        setCompleted(res.data.tasksToday);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [user.id]);

  const handleAdClick = () => {
    if (!adsReady) return alert("Ads loading...");
    if (typeof window.show_9712298 === "function") {
      window.show_9712298()
        .then(() => {
          setCompleted(prev => prev + 1);
          setBalance(prev => prev + 1);
          alert("✅ Ad watched! +1 VET");
        })
        .catch(() => alert("❌ Ad failed"));
    }
  };

  return (
    <div>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />
      {completed < totalTasks && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={handleAdClick} style={{ padding: "10px 20px", cursor: "pointer" }}>
            🎯 Watch Ad & Earn
          </button>
          <div style={{ marginTop: 20 }}>
            <p>📢 Share your referral link and earn 10%!</p>
            <input type="text" value={referralLink} readOnly style={{ width: "80%", padding: 8 }} />
            <button onClick={() => navigator.clipboard.writeText(referralLink)}>Copy</button>
          </div>
        </div>
      )}
      {completed >= totalTasks && <p style={{ textAlign: "center", marginTop: 20 }}>✅ All tasks completed today!</p>}
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

  if (!user) return <div style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/withdraw" element={<Withdraw telegramId={user.id} />} />
      </Routes>
      <Navbar />
    </Router>
  );
}
