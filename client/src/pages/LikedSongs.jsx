import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import { getLikedSongs } from '../services/api';
import { setCurrentSong, togglePlay } from '../redux/slices/playerSlice';
import TrackRow from '../components/music/TrackRow';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LikedSongs() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((s) => s.player);
  const [songs,   setSongs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedSongs().then((res) => setSongs(res.data)).finally(() => setLoading(false));
  }, []);

  const isActive = songs.some((s) => s._id === currentSong?._id) && isPlaying;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="bg-gradient-to-b from-[#5038a0] to-[#121212] p-8 pb-6">
        <div className="flex items-end gap-6">
          <div className="w-52 h-52 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded-lg flex items-center justify-center shadow-2xl shrink-0">
            <FaHeart size={80} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-white mb-2">Playlist</p>
            <h1 className="text-6xl font-black text-white mb-4">Liked Songs</h1>
            <p className="text-sm text-[#b3b3b3]">{songs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {songs.length > 0 && (
          <div className="mb-6">
            <button
              onClick={isActive ? () => dispatch(togglePlay()) : () => dispatch(setCurrentSong({ song: songs[0], queue: songs, index: 0 }))}
              className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              {isActive ? <FaPause size={20} className="text-black" /> : <FaPlay size={20} className="text-black ml-1" />}
            </button>
          </div>
        )}

        {songs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-xl font-bold mb-2">Songs you like will appear here</p>
            <p className="text-[#b3b3b3] text-sm">Tap the heart icon on any song.</p>
          </div>
        ) : (
          songs.map((song, i) => (
            <TrackRow
              key={song._id}
              song={song}
              index={i}
              onPlay={() => dispatch(setCurrentSong({ song, queue: songs, index: i }))}
              isPlaying={currentSong?._id === song._id && isPlaying}
            />
          ))
        )}
      </div>
    </div>
  );
}