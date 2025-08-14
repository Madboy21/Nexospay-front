import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";
import AdViewer from "./components/AdViewer";
import { getUserStats, updateUserProgress } from "./utils/api";

function Home({ user, stats, handleAdClick }) {
  const referralLink = `https://t.me/Nexospay_bot?start=${user.id}`;
  return (
    <>
      <Header user={user} balance={stats.tokens} />
      <TaskProgress total={stats.dailyLimit} completed={stats.tasksToday} />
      {stats.tasksToday < stats.dailyLimit && <AdViewer handleAdClick={handleAdClick} />}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>📢 Referral Link:</p>
        <input readOnly value={referralLink} style={{ width: "80%", padding: 5 }} />
        <button
          style={{ marginLeft: 5, padding: 5 }}
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
    <nav style={{ position: "fixed", bottom: 0, width: "100%", background: "#222", display: "flex", justifyContent: "space-around", padding: 10 }}>
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>🏠 Home</Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none" }}>💸 Withdraw</Link>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const totalTasks = 20;

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
      getUserStats(telegramUser.id).then(res => setStats(res.data));
    }
  }, []);

  const handleAdClick = async () => {
    if (!user) return;
    await updateUserProgress(user.id, "ad_watch");
    const res = await getUserStats(user.id);
    setStats(res.data);
    alert("✅ VET earned!");
  };

  if (!user || !stats) return <div style={{ textAlign: "center", paddingTop: 50 }}>Loading...</div>;

  return (
    <Router>
      <div style={{ paddingBottom: 70, paddingTop: 20 }}>
        <Routes>
          <Route path="/" element={<Home user={user} stats={stats} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}
