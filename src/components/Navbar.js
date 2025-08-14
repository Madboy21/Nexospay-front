import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        background: "#222",
        color: "#0af",
        fontWeight: "bold"
      }}
    >
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>🏠 Home</Link>
      <Link to="/" style={{ color: "#0af", textDecoration: "none" }}>💰 Earn</Link>
      <Link to="/withdraw" style={{ color: "#0af", textDecoration: "none" }}>💸 Withdraw</Link>
    </nav>
  );
}
