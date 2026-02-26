import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaClock } from 'react-icons/fa';
import { getPlaylist, toggleLike } from '../services/api';
import { setCurrentSong, togglePlay } from '../redux/slices/playerSlice';
import TrackRow from '../components/music/TrackRow';
import CommentSection from '../components/social/CommentSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PlaylistDetail() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { currentSong, isPlaying } = useSelector((s) => s.player);
  const [playlist, setPlaylist] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);

  useEffect(() => {
    setLoading(true);
    getPlaylist(id).then((res) => {
      setPlaylist(res.data);
      setLiked(res.data.likes?.includes(user?._id));
    }).finally(() => setLoading(false));
  }, [id]);

  const isActive = playlist?.songs.some((s) => s._id === currentSong?._id) && isPlaying;

  const handlePlayPause = () => {
    if (!playlist.songs.length) return;
    if (isActive) dispatch(togglePlay());
    else dispatch(setCurrentSong({ song: playlist.songs[0], queue: playlist.songs, index: 0 }));
  };

  const handleLike = async () => {
    if (!user) return toast.error('Log in to like playlists');
    const res = await toggleLike(id);
    setLiked(res.data.liked);
  };

  const handleRemoveSong = (songId) => {
    setPlaylist((prev) => ({ ...prev, songs: prev.songs.filter((s) => s._id !== songId) }));
  };

  if (loading)   return <LoadingSpinner />;
  if (!playlist) return <div className="p-8 text-[#b3b3b3]">Playlist not found.</div>;

  const isOwner = user?._id === playlist.owner?._id;

  return (
    <div>
      <div className="bg-gradient-to-b from-[#535353] to-[#121212] p-8 pb-6">
        <div className="flex items-end gap-6">
          <div className="w-52 h-52 bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-lg flex items-center justify-center shadow-2xl shrink-0">
            <span className="text-8xl">🎵</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase text-white mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 truncate">{playlist.name}</h1>
            {playlist.description && <p className="text-[#b3b3b3] text-sm mb-2">{playlist.description}</p>}
            <p className="text-sm text-[#b3b3b3]">
              <span className="text-white font-medium">{playlist.owner?.username}</span>
              {' · '}{playlist.songs.length} songs
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center gap-6 mb-6">
          <button onClick={handlePlayPause} className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            {isActive ? <FaPause size={20} className="text-black" /> : <FaPlay size={20} className="text-black ml-1" />}
          </button>
          <button onClick={handleLike} className={liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}>
            {liked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
          </button>
        </div>

        {playlist.songs.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-xs font-medium text-[#b3b3b3] uppercase tracking-widest border-b border-[#282828] mb-2">
              <span>#</span><span>Title</span>
              <span className="hidden md:block">Album</span>
              <span className="flex justify-end"><FaClock size={12} /></span>
            </div>
            {playlist.songs.map((song, i) => (
              <TrackRow
                key={song._id}
                song={song}
                index={i}
                onPlay={() => dispatch(setCurrentSong({ song, queue: playlist.songs, index: i }))}
                isPlaying={currentSong?._id === song._id && isPlaying}
                playlistId={id}
                isOwner={isOwner}
                onRemove={handleRemoveSong}
              />
            ))}
          </div>
        )}

        {playlist.songs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white text-lg font-bold mb-2">No songs yet</p>
            <p className="text-[#b3b3b3] text-sm">Add songs by browsing the home page.</p>
          </div>
        )}

        <CommentSection songId={null} />
      </div>
    </div>
  );
}