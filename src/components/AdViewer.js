import React from "react";

export default function AdViewer({ handleAdClick }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button
        style={{
          background: "#0af",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: 5,
          cursor: "pointer",
        }}
        onClick={handleAdClick}
      >
        🎯 Watch Ad & Earn
      </button>
    </div>
  );
}
