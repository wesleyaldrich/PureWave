import './EnhanceItem.css';
import React, { useRef, useState, useEffect } from 'react';
import addEnhance from "../assets/icon-addEnhance.png";
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faDownload } from '@fortawesome/free-solid-svg-icons';

const EnhancedMenu = ({ dryAudio, wetAudio, onClickFileChange }) => {
    const waveformRef = useRef(null);
    const waveformEnhancedRef = useRef(null);
    const wavesurferRef = useRef(null);
    const wavesurferEnhancedRef = useRef(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [isPlayingEnhanced, setIsPlayingEnhanced] = useState(false);

    // const dryAudioUrl = `http://localhost:8080/audio/files/dry/${dryAudio}`;
    // const wetAudioUrl = `http://localhost:8080/audio/files/wet/${wetAudio}`;

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
            backend: 'WebAudio'
        });
        
        return () => {
            wavesurferRef.current.destroy();
            wavesurferEnhancedRef.current.destroy();
        };
    }, []);

   
    useEffect(() => {
        wavesurferRef.current.load(dryAudio);
        wavesurferEnhancedRef.current.load(wetAudio);
    }, [dryAudio])

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

    return (
        <div className="enhance-page container-fluid flex-col">
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
                    <button className='play_button' onClick={playPauseOriginal}>
                        <FontAwesomeIcon className="icon_play" icon={isPlayingOriginal ? faPause : faPlay} />
                    </button>
                    <div className='wave' ref={waveformRef} />
                    <a href={dryAudio} download className="download-button">
                        <FontAwesomeIcon className="icon_download" icon={faDownload} />
                    </a>
                </div>
                <div className='sub-visualizer-1'>
                    <p className="uploaded-file-name">Enhanced Audio</p>
                </div>
                <div className='sub-visualizer-2'>
                    <button className='play_button' onClick={playPauseEnhanced}>
                        <FontAwesomeIcon className="icon_play" icon={isPlayingEnhanced ? faPause : faPlay} />
                    </button>
                    <div className='wave' ref={waveformEnhancedRef} />
                    <a href={wetAudio} download className="download-button">
                        <FontAwesomeIcon className="icon_download" icon={faDownload} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default EnhancedMenu;
