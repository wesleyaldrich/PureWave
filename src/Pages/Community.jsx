import './Community.css'
import Post from '../Components/Post'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";

function Community(){
    const [posts, setPosts] = useState([]);

    const API_BASE_URL = 'http://localhost:8080'


    /*
        Sample data test for UI development.
    */
    let sampleData = [
        {
            "_id": {
            "$oid": "674feac1f9d00407ace3a7b8"
            },
            "userId": "wesleylim08@gmail.com",
            "name": "Wesley",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocJKgQG1OgrKcoR29TaaHrIZ2tlxMC6sffIES4kZI71BAivd2btv=s96-c",
            "content": "Trial 1",
            "_class": "com.purewave.model.Post"
        },
        {
            "_id": {
            "$oid": "674febe45c455866a168cc95"
            },
            "userId": "wesleylim08@gmail.com",
            "name": "Wesley",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocJKgQG1OgrKcoR29TaaHrIZ2tlxMC6sffIES4kZI71BAivd2btv=s96-c",
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aliquam ad consequuntur provident labore, quo ex? Nobis excepturi dolor ad adipisci reprehenderit quis expedita explicabo quod, perspiciatis voluptas ab mollitia vero voluptates. Perferendis magni ab officia ad optio quam fugiat dolore ullam esse officiis consectetur quidem omnis recusandae, odit deleniti.",
            "_class": "com.purewave.model.Post"
        },
        {
            "_id": {
            "$oid": "674fec055c455866a168cc96"
            },
            "userId": "wesleylim08@gmail.com",
            "name": "Wesley",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocJKgQG1OgrKcoR29TaaHrIZ2tlxMC6sffIES4kZI71BAivd2btv=s96-c",
            "content": "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur sit similique nostrum quo eligendi qui ad asperiores provident iure autem vitae alias culpa magnam nobis repudiandae numquam nihil deserunt, excepturi accusantium eum officiis modi, sequi consectetur error. Nisi veritatis impedit porro ipsum iusto magnam cumque ipsa laboriosam deserunt reprehenderit magni reiciendis voluptas earum fugit adipisci nesciunt distinctio, dolor repudiandae. Voluptatibus, quis expedita esse eius suscipit, ipsa numquam odit deleniti nam, earum ea incidunt commodi veritatis cupiditate architecto doloribus quisquam eos autem eveniet dolores ut perspiciatis tempore odio natus. Nobis atque deserunt, laboriosam veniam, quo amet at quos nesciunt accusamus adipisci suscipit illum rem voluptatem eligendi mollitia impedit voluptate molestias. Eum, aperiam tempore? Dignissimos animi voluptatibus harum natus voluptate doloremque, obcaecati adipisci sed repellat cupiditate qui beatae officiis quibusdam sit veritatis error deleniti quisquam esse? Tenetur, culpa molestiae exercitationem accusantium laudantium doloribus accusamus sit vitae in voluptates amet cupiditate ducimus assumenda id unde tempora aperiam excepturi omnis ea. Omnis quisquam tenetur, illo voluptatum obcaecati quis debitis cum quasi, beatae quibusdam quos, eos distinctio libero totam ducimus assumenda dolorum? Quis perferendis culpa, explicabo maxime ipsam eligendi tempora, nobis ratione, voluptatibus incidunt aliquid? Ab tempora veniam quidem, quisquam necessitatibus at laudantium ipsum vero culpa minima quos, vel earum saepe quod id? Recusandae eligendi, delectus tempora ad perspiciatis ratione accusamus in maiores veniam libero dolorem consectetur ut excepturi aspernatur rerum soluta sequi obcaecati inventore aliquid quaerat fugiat, consequatur nam. Libero nobis tempore debitis, ducimus quasi, quaerat cumque suscipit deserunt quae facere, distinctio eligendi quia.",
            "_class": "com.purewave.model.Post"
        },
        {
            "_id": {
            "$oid": "674fec515c455866a168cc97"
            },
            "userId": "wesleylim08@gmail.com",
            "name": "Wesley",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocJKgQG1OgrKcoR29TaaHrIZ2tlxMC6sffIES4kZI71BAivd2btv=s96-c",
            "content": "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur sit similique nostrum quo eligendi qui ad asperiores provident iure autem vitae alias culpa magnam nobis repudiandae numquam nihil deserunt, excepturi accusantium eum officiis modi, sequi consectetur error. Nisi veritatis impedit porro ipsum iusto magnam cumque ipsa laboriosam deserunt reprehenderit magni reiciendis voluptas earum fugit adipisci nesciunt distinctio, dolor repudiandae. Voluptatibus, quis expedita esse eius suscipit, ipsa numquam odit deleniti nam, earum ea incidunt commodi veritatis cupiditate architecto doloribus quisquam eos autem eveniet dolores ut perspiciatis tempore odio natus. Nobis atque deserunt, laboriosam veniam, quo amet at quos nesciunt accusamus adipisci suscipit illum rem voluptatem eligendi mollitia impedit voluptate molestias. Eum, aperiam tempore? Dignissimos animi voluptatibus harum natus voluptate doloremque, obcaecati adipisci sed repellat cupiditate qui beatae officiis quibusdam sit veritatis error deleniti quisquam esse? Tenetur, culpa molestiae exercitationem accusantium laudantium doloribus accusamus sit vitae in voluptates amet cupiditate ducimus assumenda id unde tempora aperiam excepturi omnis ea. Omnis quisquam tenetur, illo voluptatum obcaecati quis debitis cum quasi, beatae quibusdam quos, eos distinctio libero totam ducimus assumenda dolorum? Quis perferendis culpa, explicabo maxime ipsam eligendi tempora, nobis ratione, voluptatibus incidunt aliquid? Ab tempora veniam quidem, quisquam necessitatibus at laudantium ipsum vero culpa minima quos, vel earum saepe quod id? Recusandae eligendi, delectus tempora ad perspiciatis ratione accusamus in maiores veniam libero dolorem consectetur ut excepturi aspernatur rerum soluta sequi obcaecati inventore aliquid quaerat fugiat, consequatur nam. Libero nobis tempore debitis, ducimus quasi, quaerat cumque suscipit deserunt quae facere, distinctio eligendi quia.",
            "_class": "com.purewave.model.Post"
        }
    ]


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/data/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
          }
        };
    
        setPosts(sampleData) // For static demonstration purposes only
        // fetchPosts();
    }, []);

    return (<>
        <div className="community-page container-fluid flex-col">
            <h1 className="title firacode">COMMUNITY</h1>
            <div className="buttons container-fluid row gurajada">
                <NavLink to="/lab" className="button col-4" end>
                    <span className="iconHistory">+</span>
                    <a>ENHANCE YOUR AUDIO</a> 
                </NavLink>
                <NavLink to="/create" className="button col" end>
                    <a>CREATE POST</a> 
                </NavLink>
            </div>
            <div className="posts container-fluid">
                {/* {posts.length > 0 ? (
                    posts.map(
                        (post) => (
                            <Post
                                picture={post.picture}
                                author={post.name}
                                content={post.content} />
                        )
                    )
                ) : (<p>No posts available</p>)
                } */}
                {posts.length > 0 ? (
                    posts.map(
                        (post) => (
                            <Post
                                picture={post.picture}
                                author={post.name}
                                content={post.content} />
                        )
                    )
                ) : (<p>No posts available</p>)
                }
            </div>
        </div>
    </>)
}

export default Community