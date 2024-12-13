import "./Reply.css";
import icon_reply from "../assets/icon-reply.png";

function Reply({ picture, author, content, onReply }) {
    return (
        <div className="replyView flex-row">
            <div className="pic-container">
                <img src={picture} alt={`${author}'s profile`} />
            </div>
            <div className="data flex-col">
                <h2>{author}</h2>
                <p>{content}</p>
            </div>
        </div>
    );
}

export default Reply;