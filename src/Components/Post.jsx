import './Post.css'

function Post({ picture, author, content }){
    return (<>
        <div className="post flex-row">
            {/* <div className="pic-container">
                <img src={picture} alt={`${author}'s profile`} />
            </div> */}
            <div className="flex-col">
                {/* <h2>{ author }</h2> */}
                <p>{ content }</p>
                <hr/>
            </div>
        </div>
    </>)
}

export default Post