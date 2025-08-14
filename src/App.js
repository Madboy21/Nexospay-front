import React, { useEffect, useState } from "react";
import { getUserStats } from "./utils/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(()=>{
    const tg = window.Telegram?.WebApp;
    console.log("Telegram WebApp:", tg);
    console.log("User data:", tg?.initDataUnsafe?.user);

    if(tg?.initDataUnsafe?.user){
      const telegramUser = tg.initDataUnsafe.user;
      setUser(telegramUser);

      getUserStats(telegramUser.id).then(res=>{
        setStats(res.data);
      });
    }
  },[]);

  if(!user || !stats) return <div style={{paddingTop:50,textAlign:"center"}}>Loading...</div>;

  return (
    <div style={{textAlign:"center", paddingTop:50}}>
      <h1>Hello, {user.first_name}</h1>
      <p>VET Tokens: {stats.tokens}</p>
      <p>Tasks Today: {stats.tasksToday}</p>
      <p>Referral Link: <input readOnly value={`https://t.me/Nexospay_bot?start=${user.id}`} /></p>
      <button onClick={()=>alert("Ad watched! Token added.")}>🎯 Watch Ad & Earn</button>
    </div>
  );
}
