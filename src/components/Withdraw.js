import React, { useState } from "react";
import { withdrawRequest } from "../utils/api";

export default function Withdraw({ telegramId, backendUrl }) {
  const [amount, setAmount] = useState("");
  const [binanceUID, setBinanceUID] = useState("");

  const handleWithdraw = async () => {
    if (!amount || !binanceUID) return alert("Fill all fields");
    try {
      const res = await withdrawRequest(telegramId, amount, binanceUID);
      alert(res.data.message || "Withdraw request sent!");
    } catch (err) {
      console.error(err);
      alert("Withdraw failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <h3>Withdraw VET</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ margin: 5, padding: 5 }}
      />
      <input
        type="text"
        placeholder="Binance UID"
        value={binanceUID}
        onChange={(e) => setBinanceUID(e.target.value)}
        style={{ margin: 5, padding: 5 }}
      />
      <button onClick={handleWithdraw} style={{ marginLeft: 10, padding: "5px 10px" }}>
        Withdraw
      </button>
    </div>
  );
}
