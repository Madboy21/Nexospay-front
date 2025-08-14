import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Withdraw from "./components/Withdraw";

// Home Component
function Home({ user, balance, completed, totalTasks, handleAdClick, referralLink }) {
  return (
    <>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />

      {/* Referral Section */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <p>📢 Share your referral link and earn 8% from friends!</p>
        <input
          type="text"
          value={referralLink}
          readOnly
          style={{ width: "80%", padding: "8px", borderRadius: "5px", border: "1px solid #0af" }}
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
  const [referralLink, setReferralLink] = useState("");
  const totalTasks = 20;
  const backendUrl = "http://localhost:5000"; // Update backend URL

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

  // Telegram user init + fetch backend
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    if (telegramUser) {
      // Referral link
      setReferralLink(`${window.location.origin}/?ref=${telegramUser.id}`);

      axios
        .get(`${backendUrl}/api/users/${telegramUser.id}`)
        .then((res) => {
          if (res.data) {
            setBalance(res.data.balance || 0);
            setCompleted(res.data.completed || 0);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Save progress
  const saveProgress = (newCompleted, newBalance) => {
    if (!user) return;
    axios
      .post(`${backendUrl}/api/users/update`, {
        telegramId: user.id,
        completed: newCompleted,
        balance: newBalance,
      })
      .catch((err) => console.error(err));
  };

  const handleComplete = () => {
    const newCompleted = completed + 1;
    const newBalance = balance + 1;

    setCompleted(newCompleted);
    setBalance(newBalance);
    saveProgress(newCompleted, newBalance);

    // If there is a referrer in URL, reward them
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get("ref");
    if (refId && refId !== user.id) {
      axios.post(`${backendUrl}/api/users/referral`, { referrerId: refId, reward: 0.08 }).catch(console.error);
    }
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
          alert("Ad could not be shown. Try again later.");
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
                referralLink={referralLink}
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
