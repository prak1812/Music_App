import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { toggleLike, removeSongFromPlaylist } from '../../services/api';
import { formatTime, PLACEHOLDER } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function TrackRow({ song, index, onPlay, isPlaying, playlistId, isOwner, onRemove }) {
  const { user } = useSelector((s) => s.auth);
  const [liked, setLiked] = useState(song.likes?.includes(user?._id));

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Log in to like songs');
    const res = await toggleLike(song._id);
    setLiked(res.data.liked);
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    await removeSongFromPlaylist(playlistId, song._id);
    onRemove(song._id);
    toast.success('Removed from playlist');
  };

  return (
    <div
      onClick={onPlay}
      className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer group transition-colors ${
        isPlaying ? 'bg-[#282828]' : 'hover:bg-[#282828]'
      }`}
    >
      <div className="w-8 text-center shrink-0">
        {isPlaying ? (
          <FaPause size={13} className="text-[#1DB954] mx-auto" />
        ) : (
          <>
            <span className="text-[#b3b3b3] text-sm group-hover:hidden">{index + 1}</span>
            <FaPlay size={13} className="text-white mx-auto hidden group-hover:block" />
          </>
        )}
      </div>

      <img src={song.coverImage || PLACEHOLDER} alt="" className="w-10 h-10 rounded object-cover shrink-0" />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? 'text-[#1DB954]' : 'text-white'}`}>{song.title}</p>
        <p className="text-xs text-[#b3b3b3] truncate">{song.artist}</p>
      </div>

      <p className="text-sm text-[#b3b3b3] hidden md:block shrink-0">{song.album || '—'}</p>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={handleLike}
          className={`${liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] opacity-0 group-hover:opacity-100 hover:text-white'} transition-all`}
        >
          {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
        </button>
        <span className="text-sm text-[#b3b3b3] w-10 text-right">{formatTime(song.duration)}</span>
        {isOwner && (
          <button onClick={handleRemove} className="text-[#b3b3b3] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
            <FaTrash size={13} />
          </button>
        )}
      </div>
    </div>
  );
}