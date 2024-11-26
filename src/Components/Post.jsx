import './Post.css'

function Post({ author, content }){
    return (<>
        <div className="post flex-col">
            <h2>{ author }</h2>
            <p>{ content }</p>
        </div>
    </>)
}

export default Post