export default function TaskList({stats}){
  return (
    <div style={{padding:"10px"}}>
      <h3>Stats:</h3>
      <p>Tokens: {stats?.tokens}</p>
      <p>Completed Tasks: {stats?.completedTasks}</p>
      <p>Referrals: {stats?.referrals}</p>
      <p>Referral Bonus Tokens: {stats?.referralBonusTokens}</p>
      <p>Tasks Remaining Today: {stats?.remainingToday}</p>
    </div>
  );
}
