import "./HistoryItem.css";
import React from "react";
import profile from "../assets/icon-profile.png";
import rename from "../assets/icon-rename.png";
import duplicate from "../assets/icon-duplicate.png";
import share from "../assets/icon-share.png";
import deleteIcon from "../assets/icon-delete.png"; 

function HistoryItem({ name, date, size, duration }) {
  return (
    <div className="history-item">
      <div className="item-left">
        <img src={profile} alt="Profile" className="profile-img"/>
        <div className="item-info">
          <p className="item-name">{name}</p>
          <p className="item-date">Date Modified {date}</p>
          <p className="item-size">
            {size} | {duration}
          </p>
        </div>
      </div>
      <div className="item-right">
        <div className="item-button-container flex-row">
          <button className="item-button">
            <img src={rename} alt="Rename" className="button-icon" /> Rename
          </button>
          <button className="item-button">
            <img src={duplicate} alt="Duplicate" className="button-icon" /> Duplicate
          </button>
          <button className="item-button">
            <img src={share} alt="Share" className="button-icon" /> Share
          </button>
          <button className="item-button">
            <img src={deleteIcon} alt="Delete" className="button-icon" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;
