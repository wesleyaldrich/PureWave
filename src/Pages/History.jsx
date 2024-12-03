import './History.css'
import HistoryItem from '../Components/HistoryItem'

function History() {
  const data = [
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
    { name: "Deydey LopLop Project", date: "11/10/2024 18:00", size: "100MB", duration: "50:30" },
  ];

  return (
    <div className="history-page container-fluid">
      <h1 className="title firacode">HISTORY</h1>
      <div className="buttons container-fluid row gurajada">
          <div className="button col-4">
              <span className="iconHistory">+</span>
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
    </div>
  );
}

export default History;
