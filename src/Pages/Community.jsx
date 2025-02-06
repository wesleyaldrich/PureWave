import './Community.css';
import Post from '../Components/Post';
import Reply from '../Components/Reply';
import ReplyList from '../Components/ReplyList';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import addEnhance from "../assets/icon-addEnhance.png";
import cancelIcon from "../assets/icon-cancel.png";
import iconAttachment from "../assets/icon-attachment.png";
import iconSend from "../assets/icon-send.png";

// Static demo
import dummy_pic from "../assets/icon-profile.png";

// Komponen Pop-up Peringatan
const WarningPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="warning-popup">
            <p>{message}</p>
            <div className="popup-buttons">
                <button className="no-btn" onClick={onCancel}>No</button>
                <button className="yes-btn" onClick={onConfirm}>Yes</button>
            </div>
        </div>
    );
};

function Community() {
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

    const [isEditing, setIsEditing] = useState(false);
    const [targetedPost, setTargetedPost] = useState(null);
    const [isWarningPopupOpen, setIsWarningPopupOpen] = useState(false); // State untuk pop-up
    const [postToDelete, setPostToDelete] = useState(null); // Post yang akan dihapus

    const API_BASE_URL = 'http://localhost:8080';

    // Fungsi untuk menangani file upload
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
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
            console.log("Uploaded posts: ", response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchReplies = async () => {
        if (!reply || !reply.id) {
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
        console.log("Replying to: " + post);
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

        if (isEditing) {
            try {
                const formData = new FormData();
                formData.append("content", targetedPost.content);
                formData.append("attachment", file);

                console.log("Editing: " + targetedPost);

                const response = await axios.put(`${API_BASE_URL}/data/posts/${targetedPost.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                setContent(""); // Reset input form
                setIsCreatePostOpen(false); // Tutup modal
                setNotificationSuccess("Successfully edited!"); // Tampilkan notifikasi
                setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
            } catch (error) {
                console.error("Error creating post:", error);
                setNotificationFailed("Failed to edit the post. Please try again.");
                setTimeout(() => setNotificationFailed(null), 2500);
            }

            setIsEditing(false);
            setTargetedPost(null);
        } else {
            try {
                const formData = new FormData();
                formData.append("content", content);
                formData.append("attachment", file);

                const response = await axios.post(`${API_BASE_URL}/data/posts`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
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
        }

        setFile(null); // Reset file
        fetchPosts();
        fetchReplies();
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("content", replyContent);
            formData.append("attachment", file);
            formData.append("attachedTo", reply.id);

            const response = await axios.post(`${API_BASE_URL}/data/posts/${reply.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setReplyContent(""); // Reset input form
            setNotificationSuccess("Successfully replied!"); // Tampilkan notifikasi
            setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
        } catch (error) {
            console.error("Error creating reply:", error);
            setNotificationFailed("Failed to create a reply. Please try again."); // Tampilkan pesan error
            setTimeout(() => setNotificationFailed(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
        }

        setFile(null); // Reset file
        fetchPosts();
        fetchReplies();
    };

    const confirmDeletePost = (post) => {
        setPostToDelete(post);
        setIsWarningPopupOpen(true); // Tampilkan pop-up konfirmasi
    };

    const deletePost = async () => {
        if (!postToDelete) return;

        try {
            const response = await axios.delete(`${API_BASE_URL}/data/posts/${postToDelete.id}`);
            fetchPosts();
            fetchReplies();
            setIsWarningPopupOpen(false); // Tutup pop-up setelah berhasil
            setPostToDelete(null); // Reset post yang akan dihapus
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

    const cancelDelete = () => {
        setIsWarningPopupOpen(false); // Tutup pop-up tanpa menghapus
        setPostToDelete(null); // Reset post yang akan dihapus
    };

    const editPost = (post) => {
        setIsEditing(true);
        setIsCreatePostOpen(true);
        setContent(post.content);
        setFile(post.attachment);
        setTargetedPost(post);
    };

    const closeForm = () => {
        setIsCreatePostOpen(false);
        setIsEditing(false);
        setContent("");
        setTargetedPost(null);
    };

    return (
        <>
            <div className="community-page container-fluid flex-col">
                <h1 className="title firacode">COMMUNITY</h1>
                <div className="buttons flex-row justify-content-between gurajada ">
                    <NavLink to="/lab" className="button col-4" end>
                        <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
                        <a>ENHANCE YOUR AUDIO</a>
                    </NavLink>
                    <div className="button col" onClick={() => setIsCreatePostOpen(true)}>
                        <a>CREATE POST</a>
                    </div>
                </div>

                <div className="posts container-fluid">
                    <div className="wrapper">
                        {/* THIS IS A DUMMY POST FOR STATIC DEMO. DELETE SOON! */}
                        <Post
                            picture={dummy_pic}
                            author={"Dummy Guy"}
                            content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                            attachment={"example"}
                            onReply={() => handleReplyOpen()}
                            onDelete={() => confirmDeletePost()}
                            onEdit={() => editPost()}
                        />
                        {posts.length > 0 ? (
                            posts.map(
                                (post) => (
                                    <Post
                                        key={post.id} // Add a unique key for each post
                                        picture={post.picture}
                                        author={post.name}
                                        content={post.content}
                                        attachment={post.attachment}
                                        replyCount={post.replyCount}
                                        onReply={() => handleReplyOpen(post)}
                                        onDelete={() => confirmDeletePost(post)}
                                        onEdit={() => editPost(post)}
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
                    <div className="close" onClick={() => closeForm()}>
                        <img src={cancelIcon} alt="cancel icon" />
                    </div>

                    <div className="posting cambria">
                        {file &&
                            <div className="information d-flex justify-content-between">
                                <p className='uploadedFile cambria'>File uploaded: {file.name}</p>
                                <div className="cancelUploadFile" onClick={handleCancelUploadFile}>
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
                                        key={replylist.id} // Add a unique key for each reply
                                        picture={replylist.picture}
                                        author={replylist.name}
                                        content={replylist.content}
                                        attachment={replylist.attachment}
                                        replyCount={replylist.replyCount}
                                        onReply={() => handleReplyOpen(replylist)}
                                        onDelete={() => confirmDeletePost(replylist)}
                                        onEdit={() => editPost(replylist)}
                                    />
                                )
                            )
                        ) : (<p>No replies available</p>)
                        }
                    </div>

                    <div className="replyArea cambria">
                        {file &&
                            <div className="information d-flex justify-content-between">
                                <p className='uploadedFile cambria'>File uploaded: {file.name}</p>
                                <div className="cancelUploadFile" onClick={handleCancelUploadFile}>
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

            {isWarningPopupOpen && (
                <WarningPopup
                    message="Are you sure you want to delete this post?"
                    onConfirm={() => {
                        // Simulasi penghapusan, tutup pop-up
                        setIsWarningPopupOpen(false);
                    }} // Menutup pop-up
                    onCancel={() => {
                        // Tutup pop-up tanpa melakukan tindakan
                        setIsWarningPopupOpen(false);
                    }} // Menutup pop-up
                />
            )}
        </>
    );
}

export default Community;