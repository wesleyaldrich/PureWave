import React from 'react';
import './GetHelpItem.css';
import arrowup from "../assets/icon-arrowup.png";
import arrowdown from "../assets/icon-arrowdown.png";

function GetHelpItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'expanded' : ''}`}>
      <div className="faq-question" onClick={onToggle}>
        <span>{question}</span>
        <img 
          src={isOpen ? arrowup : arrowdown} 
          alt={isOpen ? 'Collapse' : 'Expand'} 
          className="faq-icon" 
        />
      </div>
      {isOpen && (
        <div className="faq-answer">
          {answer.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetHelpItem;
