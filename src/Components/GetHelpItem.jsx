import React, { useState } from 'react';
import './GetHelpItem.css';
import arrowup from "../assets/icon-arrowup.png";
import arrowdown from "../assets/icon-arrowdown.png";

function GetHelpItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`faq-item ${isOpen ? 'expanded' : ''}`}>
      <div className="faq-question" onClick={toggleOpen}>
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