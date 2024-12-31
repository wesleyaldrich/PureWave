import './Community.css'
import Post from '../Components/Post'
import Reply from '../Components/Reply'
import ReplyList from '../Components/ReplyList'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import addEnhance from "../assets/icon-addEnhance.png";
import cancelIcon from "../assets/icon-cancel.png"
import iconAttachment from "../assets/icon-attachment.png"
import iconSend from "../assets/icon-send.png"

function Community(){
    const [posts, setPosts] = useState([]);
    const [reply, setReply] = useState(null);
    const [replyLists, setReplyList] = useState([]);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [content, setContent] = useState("");
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);
    const [file, setFile] = useState(null); // State untuk file yang diunggah
    const fileInputRef = useRef(null); // Referensi untuk elemen input file

    const API_BASE_URL = 'http://localhost:8080'

    // Fungsi untuk menangani file upload
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile); // Simpan file ke state
        console.log("Uploaded file:", uploadedFile);
    };

    // Fungsi untuk membuka dialog file upload
    const handleAttachmentClick = () => {
        fileInputRef.current.click(); // Trigger klik pada input file
    };

    const handleCancelUploadFile = () => {
        setFile(null); // Reset file ke null
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/data/posts`, {
                content
            });
            setContent(""); // Reset input form
            setIsCreatePostOpen(false); // Tutup modal
            setNotificationSuccess("Successfully created!"); // Tampilkan notifikasi
            setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
        } catch (error) {
            console.error("Error creating post:", error);
            setNotificationFailed("Failed to create a post. Please try again.");
            setTimeout(() => setNotificationFailed(null), 2500);
        }
    };
    
    const handleReplySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/data/posts/${reply._id.$oid}`, {
                content: replyContent
            });
            setReplyContent(""); // Reset input form
            setNotificationSuccess("Successfully replied!"); // Tampilkan notifikasi
            setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
        } catch (error) {
            console.error("Error creating reply:", error);
            setNotificationFailed("Failed to create a reply. Please try again."); // Tampilkan pesan error
            setTimeout(() => setNotificationFailed(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
        }
    };

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

    let sampleReply = [
        {
            "_id": {
            "$oid": "674febe45c455866a168cc95"
            },
            "userId": "wesleylim08@gmail.com",
            "name": "Wesley",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocJKgQG1OgrKcoR29TaaHrIZ2tlxMC6sffIES4kZI71BAivd2btv=s96-c",
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aliquam ad consequuntur provident labore, quo ex? Nobis excepturi dolor ad adipisci reprehenderit quis expedita explicabo quod, perspiciatis voluptas ab mollitia vero voluptates. Perferendis magni ab officia ad optio quam fugiat dolore ullam esse officiis consectetur quidem omnis recusandae, odit deleniti.",
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
        setReply(sampleReply)
        setReplyList(sampleData)
        // fetchPosts();
    }, []);

    return (<>
        <div className="community-page container-fluid flex-col">
            <h1 className="title firacode">COMMUNITY</h1>
            <div className="buttons flex-row justify-content-between gurajada ">
                <NavLink to="/lab" className="button col-4" end>
                    <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon"/>
                    <a>ENHANCE YOUR AUDIO</a> 
                </NavLink>
                <div className="button col" onClick={() => setIsCreatePostOpen(true)}>
                    <a>CREATE POST</a> 
                </div>
            </div>

            
            <div className="posts container-fluid">
                <div className="wrapper">
                    {posts.length > 0 ? (
                        posts.map(
                            (post) => (
                                <Post
                                    picture={post.picture}
                                    author={post.name}
                                    content={post.content} 
                                    onReply={() => {
                                        setIsReplyOpen(true);
                                        setReply(post);
                                    }}
                                    />
                            )
                        )
                    ) : (<p>No posts available</p>)
                    }
                </div>
            </div>

            <p className='copyright center-content cambria'>copyrights©2024 Reserved by PureWave</p>
        </div>

        {isCreatePostOpen && (
            <div className="create-post flex-col">
                <div className="close" onClick={() => setIsCreatePostOpen(false)}>
                    <img src={cancelIcon} alt="cancel icon" />
                </div>

                <div className="posting cambria">
                    {file && 
                        <div className="information d-flex justify-content-between">
                            <p className='uploadedFile cambria'>File uploaded: {file.name}</p>
                            <div className="cancelUploadFile" onClick={handleCancelUploadFile}  >
                                <img src={cancelIcon} alt="cancel icon" />
                            </div>
                        </div>
                    }

                    <form onSubmit={handleSubmit}>
                        <div className="formAtt d-flex justify-content-between">
                        <div className="attachment" onClick={handleAttachmentClick}>
                            <img src={iconAttachment} alt="attachment icon" className="icon-form" />
                            {/* Hidden Input */}
                            <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange} // Handle file selection
                                    key={file ? 'file-uploaded' : 'file-reset'} // Memaksa render ulang ketika file dibatalkan
                            />
                        </div>

                            <textarea
                                id="content"
                                name="content"
                                value={content}
                                className="input"
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Buat Postingan Baru Disini"
                            />
                            <br />
                            <br />

                                <div className="send">
                                    <button type="submit" className="icon-form-btn">
                                        <img src={iconSend} alt="send icon" className="icon-form" />
                                    </button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isReplyOpen && (
            <div className="create-reply flex-col">
                <div className="close" onClick={() => setIsReplyOpen(false)}>
                    <img src={cancelIcon} alt="cancel icon" />
                </div>

                <div className="RepliedReply">
                    <Reply
                        picture={reply.picture}
                        author={reply.name}
                        content={reply.content} 
                        onReply={() => {
                            setIsReplyOpen(true);
                            setReplyingToPostId(reply._id.$oid);  // Set ID postingan yang dibalas
                        }}
                        />
                </div>

                <div className="ListReply">
                    {replyLists.length > 0 ? (
                        replyLists.map(
                            (replylist) => (
                                <ReplyList
                                    picture={replylist.picture}
                                    author={replylist.name}
                                    content={replylist.content} 
                                    onReply={() => {
                                        setIsReplyOpen(true);
                                        setReplyingToPostId(post._id.$oid);  // Set ID postingan yang dibalas
                                    }}
                                />
                            )
                        )
                    ) : (<p>No posts available</p>)
                    }
                </div>         

                <div className="replyArea cambria">
                    {file && 
                        <div className="information d-flex justify-content-between">
                            <p className='uploadedFile cambria'>File uploaded: {file.name}</p>
                            <div className="cancelUploadFile" onClick={handleCancelUploadFile}  >
                                <img src={cancelIcon} alt="cancel icon" />
                            </div>
                        </div>
                    }

                    <form onSubmit={handleReplySubmit}>
                        <div className="formAtt d-flex justify-content-between">
                        <div className="attachment" onClick={handleAttachmentClick}>
                            <img src={iconAttachment} alt="attachment icon" className="icon-form" />
                            {/* Hidden Input */}
                            <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange} // Handle file selection
                                    key={file ? 'file-uploaded' : 'file-reset'} // Memaksa render ulang ketika file dibatalkan
                            />
                        </div>

                            <div className="PostyangDireply">

                            </div>
                            <hr />
                            <div className="ListRepydariPostyangDireply"></div>

                            <textarea
                                id="content"
                                name="content"
                                value={replyContent}
                                className="input"
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Buat Reply Baru Disini"
                            />
                            <br />
                            <br />

                            <div className="send">
                                <button type="submit" className="icon-form-btn">
                                    <img src={iconSend} alt="send icon" className="icon-form" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {notificationSuccess && (
            <div className="notificationSuccess">
                {notificationSuccess}
            </div>
        )}

        {notificationFailed && (
            <div className="notificationFailed">
                {notificationFailed}
            </div>
        )}
    </>)
}

export default Community