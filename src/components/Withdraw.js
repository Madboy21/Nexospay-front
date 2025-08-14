import React, { useState } from "react";
import { withdrawRequest } from "../utils/api";

export default function Withdraw({ telegramId }) {
  const [amount, setAmount] = useState("");
  const [binanceUID, setBinanceUID] = useState("");
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    if (!amount || !binanceUID) return setMessage("All fields are required");
    try {
      await withdrawRequest(telegramId, Number(amount), binanceUID);
      setMessage("✅ Withdraw request sent!");
      setAmount("");
      setBinanceUID("");
    } catch (err) {
      setMessage("❌ Error sending request");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h3>Withdraw VET Tokens</h3>
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ margin: 5, padding: 8 }}
      />
      <input
        placeholder="Binance UID"
        value={binanceUID}
        onChange={(e) => setBinanceUID(e.target.value)}
        style={{ margin: 5, padding: 8 }}
      />
      <button onClick={handleWithdraw} style={{ margin: 5, padding: "8px 12px", cursor: "pointer" }}>
        Withdraw
      </button>
      <p>{message}</p>
    </div>
  );
}
