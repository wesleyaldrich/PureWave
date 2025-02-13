import './EnhanceItem.css';
import React, { useRef, useState, useEffect } from 'react';
import addEnhance from "../assets/icon-addEnhance.png";
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faDownload } from '@fortawesome/free-solid-svg-icons';
import BeforeEnhance from './BeforeEnhance'

const EnhanceItem = ({ dryAudio, wetAudio, uploadedFileName }) => {
    const waveformRef = useRef(null);
    const waveformEnhancedRef = useRef(null);
    const wavesurferRef = useRef(null);
    const wavesurferEnhancedRef = useRef(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [isPlayingEnhanced, setIsPlayingEnhanced] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // State to hold current playback time
    const [currentTimeEnhance, setCurrentTimeEnhance] = useState(0); // State to hold current playback time

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

        wavesurferEnhancedRef.current = WaveSurfer.create({
            container: waveformEnhancedRef.current,
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

        wavesurferRef.current.on('audioprocess', () => {
            setCurrentTime(wavesurferRef.current.getCurrentTime());
        });

        wavesurferEnhancedRef.current.on('audioprocess', () => {
            setCurrentTimeEnhance(wavesurferEnhancedRef.current.getCurrentTime());
        });
        
        return () => {
            wavesurferRef.current.destroy();
            wavesurferEnhancedRef.current.destroy();
        };
    }, []);

   
    useEffect(() => {
        wavesurferRef.current.load(dryAudio);
        wavesurferEnhancedRef.current.load(wetAudio);
    }, [dryAudio,wetAudio])

    const playPauseOriginal = () => {
        if (wavesurferRef.current.isPlaying()) {
            wavesurferRef.current.pause();
            setIsPlayingOriginal(false);
        } else {
            wavesurferRef.current.play();
            setIsPlayingOriginal(true);
        }
    };

    const playPauseEnhanced = () => {
        if (wavesurferEnhancedRef.current.isPlaying()) {
            wavesurferEnhancedRef.current.pause();
            setIsPlayingEnhanced(false);
        } else {
            wavesurferEnhancedRef.current.play();
            setIsPlayingEnhanced(true);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    const [showBeforeEnhance, setShowBeforeEnhance] = useState(false);

    const backToBeforeEnhance = () => {
        setShowBeforeEnhance(true); 
    };

    if(showBeforeEnhance){
        return(
            <BeforeEnhance
                param_dryAudio={dryAudio}
                param_wetAudio={wetAudio}
                onClickhandleEnhanceClick={() => handleEnhanceClick()}
                uploadedFileName={uploadedFileName}
            />
        )
    }else{
        return (
            <div className="enhance-page container-fluid flex-col">
                <h1 className="title firacode">LABORATORY</h1>
                <div className="buttons flex-row justify-content-between gurajada">
                <div className="button col-4" onClick={backToBeforeEnhance}>
                        <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
                        <span>BACK TO BEFORE ENHANCE</span>
                    </div>
                </div>
                <div className='visualizer'>
                    <div className='sub-visualizer-1'>
                        <p className="uploaded-file-name">{uploadedFileName} (Original Audio)</p>
                    </div>
                    <div className='sub-visualizer-2'>
                        <button className='play_button' onClick={playPauseOriginal}>
                            <FontAwesomeIcon className="icon_play" icon={isPlayingOriginal ? faPause : faPlay} />
                        </button>
                        <div className='wave' ref={waveformRef} />
                        <span className="audio-current-time">{formatTime(currentTime)}</span> {/* Display current time */}
                        <a href={dryAudio} download className="download-button">
                            <FontAwesomeIcon className="icon_download" icon={faDownload} />
                        </a>
                    </div>
                    <div className='sub-visualizer-1'>
                        <p className="uploaded-file-name">{uploadedFileName} (Enhance Audio)</p>
                    </div>
                    <div className='sub-visualizer-2'>
                        <button className='play_button' onClick={playPauseEnhanced}>
                            <FontAwesomeIcon className="icon_play" icon={isPlayingEnhanced ? faPause : faPlay} />
                        </button>
                        <div className='wave' ref={waveformEnhancedRef} />
                        <span className="audio-current-time">{formatTime(currentTimeEnhance)}</span> {/* Display current time */}
                        <a href={wetAudio} download className="download-button">
                            <FontAwesomeIcon className="icon_download" icon={faDownload} />
                        </a>
                    </div>
                    <div className="upload-button-container flex-col">
                        <button className="upload-button">
                            SAVE
                        </button>
                    </div>
                </div>
                <p className='copyright center-content cambria'>copyrights©2024 Reserved by PureWave</p>
            </div>
            );
    }
}

export default EnhanceItem;
