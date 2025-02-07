import './BeforeEnhance.css';
import React, { useRef, useState, useEffect } from 'react';
import addEnhance from "../assets/icon-addEnhance.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

const BeforeEnhance = ({ dryAudio, onClickFileChange, onHandleLogoClick, onClickhandleEnhanceClick, uploadedFileName }) => {
    const fileInputRef = useRef(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [hasAudio, setHasAudio] = useState(!!dryAudio); // Check if dryAudio is provided
    const [fileName, setFileName] = useState(uploadedFileName || null); // Initialize with dryAudio name if provided
    const [duration, setDuration] = useState(null); // State to hold audio duration
    const [currentTime, setCurrentTime] = useState(0); // State to hold current playback time

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

        // Event listener to get the duration when the audio is ready
        wavesurferRef.current.on('ready', () => {
            setDuration(wavesurferRef.current.getDuration());
        });

        // Event listener to update current time during playback
        wavesurferRef.current.on('audioprocess', () => {
            setCurrentTime(wavesurferRef.current.getCurrentTime());
        });

        return () => {
            wavesurferRef.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (dryAudio) {
            wavesurferRef.current.load(dryAudio);
            setHasAudio(true);
            setFileName(uploadedFileName); // Set the file name when audio is loaded
        } else {
            setHasAudio(false);
            setFileName(''); // Clear the file name when no audio is provided
            setDuration(null); // Clear duration when no audio
            setCurrentTime(0); // Reset current time
        }
    }, [dryAudio, uploadedFileName]); // Add uploadedFileName to the dependency array

    useEffect(() => {
        setFileName(uploadedFileName); // Update fileName when uploadedFileName changes
    }, [uploadedFileName]);

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
        wavesurferRef.current.empty(); // Clear the waveform
        setHasAudio(false); // Update state to reflect no audio
        setIsPlayingOriginal(false); // Ensure audio is not playing
        setFileName(''); // Clear the file name
        setDuration(null); // Clear duration
        setCurrentTime(0); // Reset current time
        onClickFileChange(null); // Optionally, clear the audio file in parent component
    };

    // Function to format duration and current time from seconds to MM:SS
    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="before-enhance-page container-fluid flex-col">
            <h1 className="title firacode">LABORATORY</h1>
            <div className="buttons flex-row justify-content-between gurajada">
                <div className="button col-4"  onClick={onHandleLogoClick}>
                <input
                        type="file"
                        accept=".mp3, .wav"
                        ref={fileInputRef}
                        onChange={onClickFileChange}
                        style={{ display: 'none' }}
                    />
                    <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
                    <span>ENHANCE YOUR AUDIO</span>
                </div>
            </div>
            <div className='visualizer'>
                <div className='sub-visualizer-1'>
                    <p className="uploaded-file-name">{fileName}</p>
                </div>
                    {hasAudio && (
                        <>
                            <div className='sub-visualizer-2'>
                            <button className='play_button' onClick={playPauseOriginal}>
                                <FontAwesomeIcon className="icon_play" icon={isPlayingOriginal ? faPause : faPlay} />
                            </button>
                            <div className='wave' ref={waveformRef} />
                            <span className="audio-current-time">{formatTime(currentTime)}</span> {/* Display current time */}
                            <button className="remove-button" onClick={removeAudio}>
                                <FontAwesomeIcon className="icon_remove" icon={faTrash} />
                            </button>
                            
                            </div>
                            <div className="upload-button-container flex-col">
                                <button className="upload-button" onClick={onClickhandleEnhanceClick}>
                                    ENHANCE
                                </button>
                            </div>  
                        </>
                    )}
            </div>
        </div>
    );
}

export default BeforeEnhance;
