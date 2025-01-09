import './lab.css';
import axios from 'axios';
import { useRef, useState } from 'react';
import icon_upload from '../assets/upload.png';

function Lab() {
    const fileInputRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);

    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);

    // Trigger input file saat tombol atau gambar ditekan
    const handleLogoClick = () => {
        fileInputRef.current.click();
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        validateFile(file);
    };

    // Drag over event handler
    const handleDragOver = (e) => {
        e.preventDefault(); // Mencegah perilaku default browser
    };

    // Drop event handler
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        validateFile(file);
    };

    const submitAudio = async (file) => {
        try {
            const formData = new FormData();
            formData.append('audio', file); // 'audio' matches the key expected by the backend
    
            const response = await axios.post('http://localhost:5000/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Important: To handle binary data
            });

            // Create a URL for the audio blob
            const audioBlob = new Blob([response.data], { type: 'audio/wav'});
            const audioUrl = URL.createObjectURL(audioBlob);
    
            console.log('Response:', response.data);

            // Assign the audio URL to the player
            const audioPlayer = document.getElementById('audio-player');
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = 'block'; // Make the player visible if hidden
        } catch (error) {
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    // Validasi file
    const validateFile = (file) => {
        if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
            setUploadedFileName(file.name);
            setNotificationSuccess("Uploaded successfully!");
            setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
            console.log("File uploaded:", uploadedFileName);

            submitAudio(file);
        } else {
            setUploadedFileName('');
            setNotificationFailed("Invalid file format. Only .mp3 and .wav are supported.");
            setTimeout(() => setNotificationFailed(null), 2500);
        }
    };

    return (
        <div className="lab-page container-fluid flex-col">
            <h1 className="title firacode">LABORATORY</h1>

            <audio id="audio-player" controls style={{display: 'none'}}>
                Your browser does not support the audio element.
            </audio>

            {/* Area Upload */}
            <div 
                className="posts container-fluid" 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
            >
                {/* Input File Tersembunyi */}
                <input
                    type="file"
                    accept=".mp3, .wav"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {/* Gambar sebagai tombol upload */}
                <div className="upload-logo icon" onClick={handleLogoClick}>
                    <img src={icon_upload} alt="Upload Icon" />
                </div>

                <span className="upload-text tulisan">Choose a file or drag it here</span>
                <span className="upload-format tulisan">Supported formats: .mp3, .wav</span>

                {/* Tombol Upload */}
                <button className="upload-button" onClick={handleLogoClick}>
                    Upload Audio
                </button>

                {/* Pesan File yang Diunggah */}
                {uploadedFileName && (
                    <p className="uploaded-file-name">Uploaded: {uploadedFileName}</p>
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
            </div>

            <p className='copyright center-content cambria'>copyrights©2024 Reserved by PureWave</p>
        </div>
    );
}

export default Lab;
