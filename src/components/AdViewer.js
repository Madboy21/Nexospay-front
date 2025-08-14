export default function AdViewer({onCompleteTask}){
  const handleClick = ()=>{
    onCompleteTask("Ad Task");
  };

  return (
    <div style={{padding:"10px"}}>
      <h3>Watch Ad / Complete Task</h3>
      <button onClick={handleClick}>Complete Task & Earn Tokens</button>
    </div>
  );
}
