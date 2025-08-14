export default function Navbar({stats, onCompleteTask, onWithdraw}){
  return (
    <nav style={{padding:"10px", display:"flex", justifyContent:"space-around", background:"#333", color:"#fff"}}>
      <button onClick={onCompleteTask}>Complete Task</button>
      <button onClick={onWithdraw}>Withdraw</button>
      <div>Tokens: {stats?.tokens || 0}</div>
      <div>Completed: {stats?.completedTasks || 0}</div>
    </nav>
  );
}

