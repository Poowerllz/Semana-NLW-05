import {createContext, useState, ReactNode, useContext} from 'react';

type Episode = {
    title: String;
    members: string;
    thumbnail:string;
    duration: number;
    url:string;
}

type PlayerContextData = {
episodeList: Episode[];
currentEpisodeIndex: number;
isPlaying:boolean;
isLooping:boolean;
isShuffling:boolean;
play: (episode: Episode) => void;
playList: (list: Episode[], index: number) => void;
togglePlay: () => void;
toggleLooping: () => void;
toggleShuffle: () => void;
playNext: () => void;
playPrevious: () => void;
clearPlayerState: () => void;
setPlayingState: (state: boolean) => void;
hasNext: boolean,
hasPrevious: boolean,
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps ={
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [isLooping, setisLooping] = useState(false);
  const [isShuffling, setisShuffling] = useState(false);


  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setisPlaying(true); 
  }

  function playList(list: Episode [], index:number){
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setisPlaying(true)
  }

  function togglePlay(){
    setisPlaying(!isPlaying)
  }

  function toggleLooping(){
    setisLooping(!isLooping)
  }

  function toggleShuffle(){
    setisShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setisPlaying(state)
  }

  function clearPlayerState(){
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function playNext(){
    if(isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      } else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
      }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }
}
  
  return (
    <PlayerContext.Provider 
    value={{ episodeList, 
    currentEpisodeIndex, 
    play, 
    playList,
    isPlaying, 
    togglePlay,
    hasNext,
    hasPrevious,
    playPrevious,
    playNext,
    toggleLooping,
    isLooping,
    isShuffling,
    toggleShuffle,
    clearPlayerState,
    setPlayingState }}>
    {children}
    </PlayerContext.Provider> )
}

export const usePlayer = () =>{return useContext(PlayerContext)}