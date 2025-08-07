import React, { useState } from "react";
import axios from "axios";

const Withdraw = ({ telegramId }) => {
  const [binanceUid, setBinanceUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!binanceUid.trim()) {
      setMessage({ type: "error", text: "Please enter your Binance UID." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Change URL to your backend withdraw API endpoint
      const response = await axios.post(
        "https://your-backend-domain.com/api/withdraw",
        {
          telegramId,
          wallet: binanceUid.trim(),
        }
      );

      setMessage({ type: "success", text: response.data.message || "Withdraw request sent!" });
      setBinanceUid("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto", color: "#fff" }}>
      <h2 style={{ marginBottom: 20 }}>Withdraw Your Balance</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="binanceUid" style={{ display: "block", marginBottom: 8 }}>
          Binance UID:
        </label>
        <input
          id="binanceUid"
          type="text"
          placeholder="Enter your Binance UID"
          value={binanceUid}
          onChange={(e) => setBinanceUid(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #555",
            marginBottom: 16,
            backgroundColor: "#222",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "none",
            backgroundColor: loading ? "#555" : "#0af",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Withdraw Request"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 20,
            color: message.type === "error" ? "red" : "lightgreen",
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Withdraw;
