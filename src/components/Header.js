import React from "react";

export default function Header({ user, balance }) {
  return (
    <header style={{ marginBottom: 20, textAlign: "center" }}>
      <h2>Welcome, {user?.first_name || "User"}</h2>
      <p>💰 VET Balance: {balance}</p>
    </header>
  );
}
