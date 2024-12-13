import './History.css'
import HistoryItem from '../Components/HistoryItem'
import addEnhance from "../assets/icon-addEnhance.png";

function History() {
  const data = [
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
  ];

  return (
    <div className="history-page container-fluid">
      <h1 className="title firacode">HISTORY</h1>
      <div className="buttons flex-row justify-content-between gurajada">
          <div className="button col-4">
            <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon"/>
            <a>ENHANCE YOUR AUDIO</a> 
          </div>
      </div>

      <div className="history-list container-fluid">
        {data.map((item, index) => (
          <HistoryItem
            key={index}
            name={item.name}
            date={item.date}
            size={item.size}
            duration={item.duration}
          />
        ))}
      </div>
      <p className='copyright center-content cambria'>copyrights©2024 Reserved by PureWave</p>
    </div>
  );
}

export default History;
