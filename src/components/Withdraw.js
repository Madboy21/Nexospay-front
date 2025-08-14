import { useState } from "react";

export default function Withdraw({onWithdraw, minWithdraw}){
  const [amount, setAmount] = useState("");
  const [binanceUID, setBinanceUID] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!amount) return alert("Enter withdraw amount");
    if(!binanceUID) return alert("Enter Binance UID");
    onWithdraw({amount: Number(amount), binanceUID});
    setAmount("");
    setBinanceUID("");
  };

  return (
    <div style={{padding:"10px"}}>
      <h3>Withdraw Tokens</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          placeholder={`Min ${minWithdraw}`} 
          value={amount} 
          onChange={e=>setAmount(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Your Binance UID" 
          value={binanceUID} 
          onChange={e=>setBinanceUID(e.target.value)} 
        />
        <button type="submit">Request Withdraw</button>
      </form>
    </div>
  );
}
