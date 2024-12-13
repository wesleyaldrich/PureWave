import "./ReplyList.css";
import icon_reply from "../assets/icon-reply.png";

function ReplyList({ picture, author, content, onReply }) {
    return (
        <div className="replyList flex-row">
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
            </div>
        </div>
    );
}

export default ReplyList;