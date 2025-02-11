import './lab.css';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import icon_upload from '../assets/upload.png';
import BeforeEnhance from '../Components/BeforeEnhance'
import addEnhance from "../assets/icon-addEnhance.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Lab() {
    var flag = 0;
    var flag_upload = 0;
    const fileInputRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);
    const [dryAudio, setDryAudio] = useState(null);
    const [wetAudio, setWetAudio] = useState(null);

    const customAlert = (isGood, message) => {
        if (isGood) {
            setNotificationSuccess(message);
            setTimeout(() => setNotificationSuccess(null), 2500);
        }
        else {
            setNotificationFailed(message);
            setTimeout(() => setNotificationFailed(null), 2500);
        }
    };

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
            formData.append('audio', file); // 'audio' is the key for backend
    
            // Upload the audio file
            let response = await axios.post('http://localhost:8080/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'json',
            });

            // Extract the name formats
            const filenames = response.data.split(',');
            const dryAudioFilename = filenames[0];
            const wetAudioFilename = filenames[1];

            // Set audio URLs
            const dryAudioUrl = `http://localhost:8080/audio/files/dry/${dryAudioFilename}`;
            const wetAudioUrl = `http://localhost:8080/audio/files/wet/${wetAudioFilename}`;

            setDryAudio(dryAudioUrl);
            setWetAudio(wetAudioUrl);
        } catch (error) {
            console.error("Error uploading audio:", error);

            if (error.response) {
                customAlert(false, `Failed: ${error.response.data.message || "Unhandled error"}`);
            } else if (error.request) {
                customAlert(false, "No response from the server. Please log in and try again.");
            } else {
                customAlert(false, "Unexpected JavaScript error: " + error.message);
            }
        }
    };

    // Validasi file
    const validateFile = (file) => {
        if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
            setUploadedFileName(file.name);
            setNotificationSuccess("Uploaded successfully!");
            flag_upload = 1;
            setTimeout(() => setNotificationSuccess(null), 2500); // Sembunyikan notifikasi setelah 2.5 detik
            console.log("File uploaded:", file.name);

            submitAudio(file);
        } else {
            setUploadedFileName('');
            setNotificationFailed("Invalid file format. Only .mp3 and .wav are supported.");
            setTimeout(() => setNotificationFailed(null), 2500);
        }
    };
    
    const [showBeforeEnhance, setShowBeforeEnhance] = useState(false);
    const [showAfterEnhance, setShowAfterEnhance] = useState(false);

    const handleEnhanceClick = () => {
        flag = 1;
        console.log(flag)
        setShowBeforeEnhance(false); 
        setShowAfterEnhance(true); 
    };

    useEffect(() => {
        if (notificationSuccess){
            setShowBeforeEnhance(true);
            console.log("wadidaw");
        }
     }, [notificationSuccess])

    
    if (!dryAudio){
        flag_upload = 0;
        return (
            <div className="lab-page container-fluid flex-col">
                <h1 className="title firacode">LABORATORY</h1>
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

                    { notificationSuccess && (
                        <div className="notificationSuccess" >
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
    else if(showBeforeEnhance) {
        return(
            <BeforeEnhance
                param_dryAudio={dryAudio}
                param_wetAudio={wetAudio}
                onClickhandleEnhanceClick={() => handleEnhanceClick()}
                uploadedFileName={uploadedFileName}
            />
        )
    }
}

export default Lab;
