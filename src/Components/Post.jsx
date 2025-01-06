import "./Post.css";
import React, { useState } from "react";
import icon_reply from "../assets/icon-reply.png";
import icon_delete from "../assets/icon-delete-2.png"
import icon_edit from "../assets/icon-edit.png"


function Post({ picture, author, content, onReply, onDelete }) {
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    
    // Fungsi untuk toggle visibilitas tombol
    const toggleButtonVisibility = () => {
        setIsButtonVisible(prevState => !prevState);
    };

    return (
        <div className="post flex-row">
            <div className="pic-container">
                <img src={picture} alt={`${author}'s profile`} />
            </div>
            <div className="data flex-col">
                <h2>{author}</h2>
                <p>{content}</p>

                <div className="reply flex-row" onClick={onReply}>
                    <img src={icon_reply} alt="icon reply" />
                    <p className="gurajada">Reply</p>
                </div>
                <hr />
            </div>

            <div className="dropdown">
                {/* Tombol titik tiga horizontal */}
                <div className="dot-menu flex-row" onClick={toggleButtonVisibility}>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>

                {/* Tombol kecil yang muncul di bawah setelah titik tiga diklik */}
                {isButtonVisible && (
                    <div className="option gurajada flex-row">
                        <div className="edit flex-row">
                            <img src= {icon_edit} alt="icon edit" className="iconDropDown"/>
                            <p className="gurajada">Edit</p>
                        </div>

                        <div className="deletePost flex-row" onClick={onDelete}>
                            <img src= {icon_delete} alt="icon delete" className="iconDropDown" />
                            <p className="gurajada">Delete</p>
                        </div>
                    </div>

                )}
            </div>      

        </div>
    );
}

export default Post;