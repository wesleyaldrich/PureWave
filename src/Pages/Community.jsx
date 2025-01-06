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

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/data/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
      }
    };

    const fetchReplies = async () => {
        if (!reply || !reply.id) {
            console.log(reply + "|" + reply.id);
            console.error('Reply is null or undefined');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/data/posts/${reply.id}`);
            setReplyList(response.data);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleReplyOpen = (post) => {
        console.log(post);
        setReply(post);
        setIsReplyOpen(true);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (isReplyOpen && reply) {
            fetchReplies();
        }
    }, [reply, isReplyOpen]);

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

        fetchPosts();
    };
    
    const handleReplySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/data/posts/${reply.id}`, {
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

        fetchReplies();
    };

    const deletePost = async (post) => {
        try {
          const response = await axios.delete(`${API_BASE_URL}/data/posts/${post.id}`);
          alert("Post deleted successfully!");
          fetchPosts();
          fetchReplies();
        } catch (error) {
          console.error("Error deleting post:", error);
      
          // Show a user-friendly error message
          if (error.response) {
            alert(`Failed to delete post: ${error.response.data.message || "Unknown error"}`);
          } else if (error.request) {
            alert("No response from the server. Please try again.");
          } else {
            alert("Error occurred: " + error.message);
          }
        }
      };

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
                                    onReply={() => handleReplyOpen(post)}
                                    onDelete={() => deletePost(post)}
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
                                    onReply={() => handleReplyOpen(replylist)}
                                    onDelete={() => deletePost(replylist)}
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

                            <hr />

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