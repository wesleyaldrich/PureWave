import './Community.css'
import Post from '../Components/Post'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Community(){
    const [posts, setPosts] = useState([]);

    const API_BASE_URL = 'http://localhost:8080'

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/data/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
          }
        };
    
        fetchPosts();
    }, []);

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
                {posts.length > 0 ? (
                    posts.map(
                        (post) => (
                            <Post content={post.content}/>
                            // <div key={post.id} className="post">
                            //     <h3>{post.name}</h3>
                            //     <p>{post.content}</p>
                            //     <img src={post.picture} alt={`${post.name}'s profile`} />
                            // </div>
                        )
                    )
                ) : (<p>No posts available</p>)
                }
            </div>
        </div>
    </>)
}

export default Community