import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

function Home({ user, balance, completed, totalTasks, handleAdClick }) {
  return (
    <>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />
      {completed < totalTasks ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={handleAdClick} style={{padding:'10px 20px', borderRadius:5, background:'#0af', color:'#fff'}}>
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

function Navbar() {
  return (
    <nav style={{position:'fixed', bottom:0, width:'100%', display:'flex', justifyContent:'space-around', background:'#222', padding:'10px 0', color:'#0af'}}>
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>🏠 Home</Link>
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>💰 Earn</Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none" }}>💸 Withdraw</Link>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [adsReady, setAdsReady] = useState(false);
  const totalTasks = 20;
  const backendUrl = "https://your-backend-domain.com"; // change accordingly

  // Load Monetag script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://a.monetag.com/tag/9712298.js"; 
    script.async = true;
    script.onload = () => setAdsReady(true);
    document.body.appendChild(script);
  }, []);

  // Telegram user register
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
      // Check if referral exists
      const params = new URLSearchParams(window.location.search);
      const referredBy = params.get("ref");

      axios.post(`${backendUrl}/api/user/register`, {
        telegramId: telegramUser.id,
        first_name: telegramUser.first_name,
        username: telegramUser.username,
        referredBy,
      }).then(res => {
        setBalance(res.data.balance || 0);
        setCompleted(res.data.completed || 0);
      }).catch(console.error);
    }
  }, []);

  const saveProgress = (newCompleted, newBalance) => {
    if (!user) return;
    axios.post(`${backendUrl}/api/user/update`, {
      telegramId: user.id,
      completed: newCompleted,
      balance: newBalance,
    }).catch(console.error);
  };

  const handleComplete = () => {
    const newCompleted = completed + 1;
    const newBalance = balance + 1;
    setCompleted(newCompleted);
    setBalance(newBalance);
    saveProgress(newCompleted, newBalance);
  };

  const handleAdClick = () => {
    if (!adsReady) { alert("Ad loading..."); return; }
    if (typeof window.show_9712298 === "function") {
      window.show_9712298()
        .then(() => { handleComplete(); alert("✅ Ad watched! 1 VET added."); })
        .catch(err => { console.error(err); alert("Ad failed"); });
    } else {
      alert("Ad not ready");
    }
  };

  if (!user) return <div style={{ paddingTop: 40, color: "#fff", background: "#121212", height: "100vh", textAlign: "center" }}>Loading...</div>;

  return (
    <Router>
      <div style={{paddingBottom:70, color:'#fff', background:'#121212', minHeight:'100vh', padding:20, boxSizing:'border-box'}}>
        <Routes>
          <Route path="/" element={<Home user={user} balance={balance} completed={completed} totalTasks={totalTasks} handleAdClick={handleAdClick} />} />
          <Route path="/withdraw" element={<Withdraw telegramId={user.id} backendUrl={backendUrl} />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
