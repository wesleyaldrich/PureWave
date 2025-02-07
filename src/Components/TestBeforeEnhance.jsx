import './BeforeEnhance.css';
import React, { useRef, useState, useEffect } from 'react';
import addEnhance from "../assets/icon-addEnhance.png";
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';

const BeforeEnhance = ({ dryAudio, onClickFileChange, onClickhandleEnhanceClick }) => {
    const waveformRef = useRef(null);
    const waveformEnhancedRef = useRef(null);
    const wavesurferRef = useRef(null);
    const wavesurferEnhancedRef = useRef(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [isPlayingEnhanced, setIsPlayingEnhanced] = useState(false);
    const [hasAudio, setHasAudio] = useState(!!dryAudio); // Check if dryAudio is provided

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
            backend: 'WebAudio'
        });
        
        return () => {
            wavesurferRef.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (dryAudio) {
            wavesurferRef.current.load(dryAudio);
            setHasAudio(true);
        } else {
            setHasAudio(false);
        }
    }, [dryAudio]);

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
        onClickFileChange(null); // Optionally, clear the audio file in parent component
    };

    return (
        <div className="before-enhance-page container-fluid flex-col">
            <h1 className="title firacode">LABORATORY</h1>
            <div className="buttons flex-row justify-content-between gurajada">
                <div className="button col-4" onClick={onClickFileChange}>
                    <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
                    <span>LOAD AUDIO</span>
                </div>
            </div>
            <div className='visualizer'>
                <div className='sub-visualizer-1'>
                    <p className="uploaded-file-name">Original Audio</p>
                </div>
                <div className='sub-visualizer-2'>
                    {hasAudio && (
                        <>
                            <button className='play_button' onClick={playPauseOriginal}>
                                <FontAwesomeIcon className="icon_play" icon={isPlayingOriginal ? faPause : faPlay} />
                            </button>
                            <div className='wave' ref={waveformRef} />
                            <button className="remove-button" onClick={removeAudio}>
                                <FontAwesomeIcon className="icon_remove" icon={faTrash} />
                            </button>
                            <button className="upload-button" onClick={onClickhandleEnhanceClick}>
                                Enhance
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BeforeEnhance;
