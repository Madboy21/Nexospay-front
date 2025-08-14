import React from "react";

export default function TaskProgress({ total, completed }) {
  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <p>
        📊 Tasks Completed: {completed}/{total}
      </p>
    </div>
  );
}
