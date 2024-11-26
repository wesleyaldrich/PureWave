import './Community.css'
import Post from '../Components/Post'

function Community(){
    return (<>
        <div className="community-page container-fluid flex-col">
            <h1 className="title firacode">PUREWAVE</h1>
            <div className="buttons container-fluid row gurajada">
                <div className="button col-4">
                    <a>ENHANCE YOUR AUDIO</a>
                </div>
                <div className="button col">
                    <a>CREATE POST</a>
                </div>
            </div>
            <div className="posts container-fluid">
                <Post
                    author="Naufal Dimas" 
                    content="Check out my new rap album, y'all! It's lit af, I rapped with my whole soul!"/>
            </div>
        </div>
    </>)
}

export default Community