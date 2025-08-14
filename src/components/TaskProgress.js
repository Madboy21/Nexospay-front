import React from "react";

export default function TaskProgress({ total, completed }) {
  const percent = Math.floor((completed / total) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <p>
        Tasks Completed: {completed} / {total} ({percent}%)
      </p>
      <div style={{ background: "#333", borderRadius: 5, overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: 20,
            background: "#0af",
          }}
        ></div>
      </div>
    </div>
  );
}
