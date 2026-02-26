import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Howl } from 'howler';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaRandom, FaRedo, FaVolumeUp, FaVolumeMute,
  FaHeart, FaRegHeart,
} from 'react-icons/fa';
import { MdRepeatOne } from 'react-icons/md';
import {
  togglePlay, playNext, playPrev,
  setProgress, setDuration, toggleShuffle, cycleRepeat, setVolume,
} from '../../redux/slices/playerSlice';
import { toggleLike } from '../../services/api';
import { formatTime, PLACEHOLDER } from '../../utils/helpers';

let howl = null;

export default function MusicPlayer() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, isShuffle, repeatMode, progress, duration } = useSelector((s) => s.player);
  const { user } = useSelector((s) => s.auth);
  const rafRef   = useRef(null);
  const [liked,  setLiked]  = useState(false);
  const [muted,  setMuted]  = useState(false);

  useEffect(() => {
    if (!currentSong) return;
    if (howl) { howl.unload(); cancelAnimationFrame(rafRef.current); }

    howl = new Howl({
      src:   [currentSong.audioUrl],
      html5: true,
      volume,
      onload() { dispatch(setDuration(howl.duration())); },
      onend() {
        if (repeatMode === 'one') { howl.seek(0); howl.play(); }
        else dispatch(playNext());
      },
      onplay() {
        const tick = () => {
          if (howl?.playing()) {
            dispatch(setProgress(howl.seek()));
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      },
    });

    howl.play();
    setLiked(currentSong.likes?.includes(user?._id));
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentSong?._id]);

  useEffect(() => {
    if (!howl) return;
    isPlaying ? howl.play() : howl.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (howl) howl.volume(muted ? 0 : volume);
  }, [volume, muted]);

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (howl) { howl.seek(val); dispatch(setProgress(val)); }
  };

  const handleLike = async () => {
    if (!user) return;
    const res = await toggleLike(currentSong._id);
    setLiked(res.data.liked);
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-[#282828] px-4 h-[88px] flex items-center gap-4">

      <div className="flex items-center gap-3 w-[260px] min-w-0">
        <img
          src={currentSong.coverImage || PLACEHOLDER}
          alt={currentSong.title}
          className="w-14 h-14 rounded object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
          <p className="text-xs text-[#b3b3b3] truncate">{currentSong.artist}</p>
        </div>
        <button
          onClick={handleLike}
          className={`ml-2 shrink-0 ${liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 max-w-[600px] mx-auto">
        <div className="flex items-center gap-5">
          <button
            onClick={() => dispatch(toggleShuffle())}
            className={isShuffle ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}
          >
            <FaRandom />
          </button>
          <button onClick={() => dispatch(playPrev())} className="text-[#b3b3b3] hover:text-white">
            <FaStepBackward size={18} />
          </button>
          <button
            onClick={() => dispatch(togglePlay())}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying
              ? <FaPause size={13} className="text-black" />
              : <FaPlay  size={13} className="text-black ml-0.5" />
            }
          </button>
          <button onClick={() => dispatch(playNext())} className="text-[#b3b3b3] hover:text-white">
            <FaStepForward size={18} />
          </button>
          <button
            onClick={() => dispatch(cycleRepeat())}
            className={repeatMode !== 'none' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}
          >
            {repeatMode === 'one' ? <MdRepeatOne /> : <FaRedo />}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-[#b3b3b3] w-10 text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-full cursor-pointer"
            style={{ background: `linear-gradient(to right, #1DB954 ${pct}%, #535353 ${pct}%)` }}
          />
          <span className="text-xs text-[#b3b3b3] w-10">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-[160px] justify-end">
        <button onClick={() => setMuted(!muted)} className="text-[#b3b3b3] hover:text-white">
          {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => { dispatch(setVolume(parseFloat(e.target.value))); setMuted(false); }}
          className="w-24 h-1 rounded-full cursor-pointer"
          style={{ background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, #535353 ${(muted ? 0 : volume) * 100}%)` }}
        />
      </div>
    </div>
  );
}