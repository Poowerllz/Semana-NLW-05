import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { usePlayer } from '../../contexts/PlayerContext';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0)

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event =>{
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        } else{
            clearPlayerState
        }
    }

    const { episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
        playPrevious,
        playNext,
        toggleShuffle,
        isShuffling,
        isLooping,
        hasNext,
        hasPrevious,
        toggleLooping,
        clearPlayerState,
    } = usePlayer();

    useEffect (()=> {
        if(!audioRef.current){
            return;
        }
        if(isPlaying){
            audioRef.current.play();
        } else{
            audioRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex];

    return(
            <div className={styles.playerContainer}>
                <header>
                    <img src="/playing.svg" alt="Tocando agora."/>
                    <strong>Tocando agora</strong>
                </header>

                { episode ? (
                    <div className={styles.currentEpisode}>
                        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"></Image>
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>

                ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
                    
                )}


                <footer className={episode ? styles.empty: ''}>
                    <div className={styles.progress}>
                        <span>{convertDurationToTimeString(progress)}</span>
                        <div className={styles.slider}>
                            {episode ? (
                                <Slider
                               max={episode.duration}
                               value={progress}
                               onChange={handleSeek}
                               trackStyle ={{backgroundColor: '#04d361'}}
                               railStyle ={{backgroundColor: '#9f75ff'}}
                               handleStyle ={{borderColor: '#04d361', borderWidth: 4}}
                                />
                            ) : (<div className={styles.emptySlider}/>)}
                        </div>
                        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    </div>

                    { episode && (
                        <audio src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}/>
                    )}

                    <div className={styles.buttons}>
                        <button type="button" disabled={!episode || episodeList.length == 1}>
                            <img src="/shuffle.svg" alt="Embaralhar" onClick={toggleShuffle} className={isShuffling? styles.isActive : ''}/>
                        </button>
                        <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                            <img src="/play-previous.svg" alt="Tocar anterior"/>
                        </button>
                        <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                            { isPlaying ? 
                                <img src="/pause.svg" alt="Iniciar ou pausar."/>
                             : 
                                <img src="/play.svg" alt="Iniciar ou pausar."/>
                            }
                        </button>
                        <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                            <img src="/play-next.svg" alt="Tocar próxima."/>
                        </button>
                        <button type="button" disabled={!episode} onClick={toggleLooping} className={isLooping? styles.isActive : ''}>
                            <img src="/repeat.svg" alt="Repetir"/>
                        </button>
                    </div>
                </footer> 
            </div>
    );
}