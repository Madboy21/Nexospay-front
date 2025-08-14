import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskProgress from "./components/TaskProgress";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const totalTasks = 20;

  // Monetag SDK লোড করার জন্য
  useEffect(() => {
    // Telegram WebApp ready
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const telegramUser = tg.initDataUnsafe?.user;
    setUser(telegramUser);

    // Monetag SDK script inject
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = "9712298";
    script.dataset.sdk = "show_9712298";
    script.async = true;
    script.onload = () => {
      console.log("✅ Monetag SDK loaded");
    };
    document.body.appendChild(script);
  }, []);

  // Task complete & balance update
  const handleComplete = () => {
    setCompleted(prev => prev + 1);
    setBalance(prev => prev + 1);
  };

  // Monetag এড দেখানোর হ্যান্ডলার
  const handleAdClick = () => {
    if (typeof window.show_9712298 === "function") {
      window.show_9712298()
        .then(() => {
          handleComplete();
          alert("✅ Ad watched! 1 VET added.");
        })
        .catch((err) => {
          console.error("Ad failed:", err);
          alert("Ad could not be shown. Please try again later.");
        });
    } else {
      alert("Ad system not loaded yet. Try again in a moment.");
    }
  };

  if (!user) return (
    <div style={{ paddingTop: 40, color: "#fff", background: "#121212", height: "100vh", textAlign: "center" }}>
      Loading...
    </div>
  );

  return (
    <div style={{ paddingBottom: 70, color: "#fff", background: "#121212", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", paddingTop: 20, paddingLeft: 20, paddingRight: 20, boxSizing: "border-box" }}>
      <Header user={user} balance={balance} />
      <TaskProgress total={totalTasks} completed={completed} />
      {completed < totalTasks ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            style={{ background: "#0af", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
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
      <Navbar />
    </div>
  );
}

export default App;
