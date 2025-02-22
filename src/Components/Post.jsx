import "./Post.css";
import React, { useState, useEffect, useRef } from "react";
import icon_reply from "../assets/icon-reply.png";
import icon_delete from "../assets/icon-delete-2.png";
import icon_edit from "../assets/icon-edit.png";

function Post({ picture, author, content, attachment, replyCount, onReply, onDelete, onEdit }) {
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    if (!replyCount) replyCount = 0;

    const attachmentBoxRef = useRef(null);
    const attachmentTitleRef = useRef(null);
    const dropdownRef = useRef(null);

    const toggleButtonVisibility = () => setIsButtonVisible(!isButtonVisible);

    useEffect(() => {
        if (!attachmentBoxRef.current || !attachmentTitleRef.current) {
            console.warn("Elements not found in the DOM");
            return;
        }

        if (attachment) {
            attachmentBoxRef.current.style.display = "flex";
            attachmentTitleRef.current.innerHTML = attachment;
        } else {
            attachmentBoxRef.current.style.display = "none";
        }
    }, [attachment]);  

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                toggleButtonVisibility(); 
            }
        };

        if (isButtonVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isButtonVisible]);

    const handleClick = (e) => {
        if(!isButtonVisible){
            e.preventDefault();
            toggleButtonVisibility(); 
        }
    };

    return (
        <div className="post flex-row">
            <div className="pic-container">
                <img src={picture} alt={`${author}'s profile`} />
            </div>
            <div className="data flex-col">
                <h2>{author}</h2>
                <p class="textContent" onContextMenu={handleClick}>{content}</p>

                <div ref={attachmentBoxRef} className="attachment-box center-content gurajada" style={{ display: "none" }}>
                    <a href={attachment} target="_blank">
                        <p ref={attachmentTitleRef}>Bug in attachment, this shouldn't be visible.</p>
                    </a>
                </div>

                <div className="reply flex-row">
                    <div className="replyItem flex-row" onClick={onReply}>
                        <img src={icon_reply} alt="icon reply"/>
                        <p className="gurajada">Reply ({replyCount})</p>
                    </div>
                </div>
                <hr />
            </div>

            <div className="dropdown" ref={dropdownRef}>
                <div className="dot-menu center-content flex-row" onClick={toggleButtonVisibility}>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>

                {isButtonVisible && (
                    <div className="option gurajada flex-row">
                        <div className="edit flex-row" onClick={() => {
                            toggleButtonVisibility();
                            onEdit();
                        }}>
                            <img src={icon_edit} alt="icon edit" className="iconDropDown" />
                            <p className="gurajada">Edit</p>
                        </div>

                        <div className="deletePost flex-row" onClick={() => {
                            toggleButtonVisibility();
                            onDelete();
                        }}>
                            <img src={icon_delete} alt="icon delete" className="iconDropDown" />
                            <p className="gurajada">Delete</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Post;
