import React, { useEffect, useRef } from 'react';
import './GetHelpItem.css';
import arrow from "../assets/icon-arrowup.png";

function GetHelpItem({ question, answer, isOpen, onToggle }) {
  const answerRef = useRef(null);

  useEffect(() => {
    if (isOpen && answerRef.current) {
      answerRef.current.style.maxHeight = `${answerRef.current.scrollHeight}px`;
    } else if (answerRef.current) {
      answerRef.current.style.maxHeight = '0px';
    }
  }, [isOpen]);

  return (
    <div className={`faq-item ${isOpen ? 'expanded' : ''}`}>
      <div className="faq-question" onClick={onToggle}>
        <span>{question}</span>
        <img 
          src={arrow} 
          alt={isOpen ? 'Collapse' : 'Expand'} 
          className={`faq-icon ${isOpen ? 'icon-rotate' : ''}`}
        />
      </div>
      
      <div className={`faq-answer ${isOpen ? 'open' : ''}`} ref={answerRef}>
        {answer.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default GetHelpItem;
  