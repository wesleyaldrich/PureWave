import "./Post.css";
import icon_reply from "../assets/icon-reply.png";

function Post({ picture, author, content }){
    return (<>
        <div className="post flex-row">
            <div className="pic-container">
                <img src={picture} alt={`${author}'s profile`} />
            </div>
            <div className="data flex-col">
                <h2>{ author }</h2>
                <p>{ content }</p>

                <div className="reply flex-row">
                    <img src={icon_reply} alt="icon reply" />
                    <p className="gurajada">Reply</p>
                </div>
                <hr/>
            </div>
        </div>
    </>)
}

export default Post