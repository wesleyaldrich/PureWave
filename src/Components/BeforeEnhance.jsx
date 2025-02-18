import './BeforeEnhance.css';
import React, { useRef, useState, useEffect } from 'react';
import addEnhance from "../assets/icon-addEnhance.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BeforeEnhance = ({ param_dryAudio, param_wetAudio, uploadedFileName }) => {
    const fileInputRef = useRef(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [hasAudio, setHasAudio] = useState(true);
    const [fileName, setFileName] = useState(uploadedFileName);
    const [currentTime, setCurrentTime] = useState(0);
    const [showAfterEnhance, setShowAfterEnhance] = useState(false);
    const [dryAudio, setDryAudio] = useState(param_dryAudio);
    const [wetAudio, setWetAudio] = useState(param_wetAudio);
    const [notificationSuccess, setNotificationSuccess] = useState(null);
    const [notificationFailed, setNotificationFailed] = useState(null);
    const [newCreatedProject, setNewCreatedProject] = useState(null);
    const [duration, setDuration] = useState(null)
    const navigate = useNavigate();

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

    useEffect(() => {
        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#F9FAF5',
            progressColor: '#9299B5',
            cursorColor: '#ff0000',
            barWidth: 2,
            barHeight: 1.5,
            barGap: 2,
            responsive: true,
            height: 100,
            backend: 'WebAudio',
            cursorWidth: 3
        });

        wavesurferRef.current.on('ready', () => {
            setDuration(wavesurferRef.current.getDuration());
        });

        wavesurferRef.current.on('audioprocess', () => {
            setCurrentTime(wavesurferRef.current.getCurrentTime());
        });

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (dryAudio) {
            wavesurferRef.current.load(dryAudio);
            setHasAudio(true);
            setFileName(fileName);
        } else {
            setHasAudio(false);
            setFileName('');
            setDuration(null);
            setCurrentTime(0);
        }
    }, [dryAudio, fileName]);

    useEffect(() => {
        if (newCreatedProject) {
            console.log("New project created: ", newCreatedProject);
        }
    }, [newCreatedProject]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            wavesurferRef.current.load(fileURL);
            setHasAudio(true);
            setFileName(file.name);
            console.log(file.name);
            setDuration(null);
            setCurrentTime(0);
            validateFile(file);
        }
    };

    const submitAudio = async (file) => {
        console.log("Reset submitAudio after file change.");
        try {
            const formData = new FormData();
            formData.append('audio', file); // 'audio' is the key for backend

            // Upload the audio file
            const response = await axios.post('http://localhost:8080/audio', formData, {
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
            customAlert(true, "Audio uploaded and processed successfully.");

            console.log("dryAudio after reset:", dryAudio);
            console.log("wetAudio after reset:", wetAudio);
        } catch (error) {
            console.error("Error uploading audio:", error);

            if (error.response) {
                customAlert(false, `Failed: ${error.response.data.message || "Unhandled error"}`);
            } else if (error.request) {
                customAlert(false, "No response from the server. Please try again.");
            } else {
                customAlert(false, "Unexpected JavaScript error: " + error.message);
            }
        } 
    };

    const validateFile = (file) => {
        if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
            submitAudio(file);
        } else {
            customAlert(false ,"Invalid file format. Only .mp3 and .wav are supported.");
        }
    };

    const playPauseOriginal = () => {
        if (wavesurferRef.current.isPlaying()) {
            wavesurferRef.current.pause();
            setIsPlayingOriginal(false);
        } else {
            wavesurferRef.current.play();
            setIsPlayingOriginal(true);
        }
    };

    
    const removeAudio = () => {
        setHasAudio(false);
        console.log("Before", hasAudio);
    };

    useEffect(() => {
        console.log("Sini", hasAudio)
        setIsPlayingOriginal(false);
        // setFileName('');
        setDuration(null);
        setCurrentTime(0);
        fileInputRef.current.value = '';
        wavesurferRef.current.empty();
    }, [hasAudio]);

    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleEnhanceClick = async () => {
        if (!wetAudio) {
            customAlert(false,"Enhance the audio first.");
            return;
        }

        // POST PROJECT HERE
        const newProject = {
            title: "Untitled project",
            dryAudio: dryAudio,
            wetAudio: wetAudio
        };

        console.log("Frontend posted project: ", newProject);

        try {
            const response = await axios.post('http://localhost:8080/data/projects', newProject);
            console.log("Project created successfully:", response.data);
            customAlert(true, "Project created successfully!");
            setShowAfterEnhance(true);
            setNewCreatedProject(response.data);
        } catch (error) {
            console.error("Error creating project:", error);

            if (error.response) {
                customAlert(false, `Failed: ${error.response.data.message || "Unhandled error"}`);
            } else if (error.request) {
                customAlert(false, "No response from the server. Please log in and try again.");
            } else {
                customAlert(false, "Unexpected JavaScript error: " + error.message);
            }
        }
    };

    useEffect(() => {
        console.log("Trigger");
        if (newCreatedProject){
            console.log("Should redirect soon. With the new created project: ", newCreatedProject);
            navigate(`/project/${newCreatedProject.accessId}`);
        }
    }, [newCreatedProject, navigate]);

    return (
        <div className="before-enhance-page container-fluid flex-col">
            <h1 className="title firacode">LABORATORY</h1>
            <div className="buttons flex-row justify-content-between gurajada">
                <div className="button col-4" onClick={() => fileInputRef.current.click()}>
                    <input
                        type="file"
                        accept=".mp3, .wav"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
                    <span>ENHANCE YOUR AUDIO</span>
                </div>
            </div>
            <div className='visualizer'>
                {hasAudio && (
                    <> 
                        <div className='sub-visualizer-1'>
                            <p className="uploaded-file-name">{fileName}</p>
                        </div>
                        <div className='sub-visualizer-2'>
                            <button className='play_button' onClick={playPauseOriginal}>
                                <FontAwesomeIcon className="icon_play" icon={isPlayingOriginal ? faPause : faPlay} />
                            </button>
                            <div className='wave' ref={waveformRef} />
                            <span className="audio-current-time">{formatTime(currentTime)}</span>
                            <button className="remove-button" onClick={removeAudio}>
                                <FontAwesomeIcon className="icon_remove" icon={faTrash} />
                            </button>
                        </div>
                        <div className="upload-button-container flex-col">
                            <button className="upload-button" onClick={handleEnhanceClick}>
                                ENHANCE
                            </button>
                        </div>
                    </>
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
};

export default BeforeEnhance;
