import './Community.css'
import Post from '../Components/Post'
import axios from 'axios';

function Community(){
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // const [posts, setPosts] = useState([]);

    // const getPosts = async () => {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/data/posts`);
    //         setPosts(response.data);
    //     } catch (error) {
    //         console.error('There was an error fetching the posts:', error);
    //     }
    // };

    return (<>
        <div className="community-page container-fluid flex-col">
            <h1 className="title firacode">COMMUNITY</h1>
            <div className="buttons container-fluid row gurajada">
                <div className="button col-4">
                    <span className="iconHistory">+</span>
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
                <Post
                    author="Elak Val" 
                    content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil fugiat optio veniam! Dolorum sit maxime enim dolorem similique reiciendis repudiandae, soluta dicta laudantium voluptatibus porro quam voluptas a est quaerat voluptate earum."/>
                <Post
                    author="Bos Theda" 
                    content="Woi ngapain woi?!?!?!"/>
                <Post
                    author="Timothy Ronald" 
                    content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias iste necessitatibus voluptas vel sunt quaerat mollitia tenetur totam libero velit beatae deserunt nesciunt ratione numquam rerum ullam impedit dolores facilis, assumenda asperiores ut, voluptatum non fuga? Itaque vel harum rem et quos a corporis laborum illo totam aspernatur quisquam quaerat placeat deserunt id magnam quo, beatae possimus ipsum ex laboriosam adipisci tempore molestiae sint? Delectus reprehenderit est unde officia laudantium, voluptas commodi similique animi quibusdam suscipit eum dolorem sunt, praesentium impedit! Fugiat obcaecati sapiente laborum reiciendis quas, corrupti facilis placeat vel numquam, aliquam quia repellendus architecto iure ipsam. Nostrum perspiciatis fugit optio sequi, voluptatibus voluptatum repellendus molestias placeat pariatur distinctio veniam praesentium, sunt nam unde, sapiente fugiat et iusto sed!"/>
                <Post
                    author="Naufal Dimas" 
                    content="Diem lu haters!"/>
            </div>
        </div>
    </>)
}

export default Community