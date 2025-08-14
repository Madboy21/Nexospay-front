export default function TaskProgress({stats}){
  const progress = stats ? (stats.tasksToday / stats.dailyLimit)*100 : 0;
  return (
    <div style={{padding:"10px"}}>
      <div>Daily Tasks: {stats?.tasksToday || 0}/{stats?.dailyLimit || 0}</div>
      <div style={{background:"#ccc", height:"10px", width:"100%"}}>
        <div style={{width:`${progress}%`, height:"10px", background:"#4caf50"}}></div>
      </div>
    </div>
  );
}
