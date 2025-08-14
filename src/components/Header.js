import React from "react";

function Header({ user, balance }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#222",
        padding: "15px 20px",
        borderRadius: "8px",
        marginBottom: "20px",
        color: "#0af",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "18px" }}>👤 {user?.first_name || "User"}</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#fff" }}>Telegram ID: {user?.id}</p>
      </div>

      <div style={{ textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>💰 {balance || 0} VET</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#fff" }}>Balance</p>
      </div>
    </div>
  );
}

export default Header;

