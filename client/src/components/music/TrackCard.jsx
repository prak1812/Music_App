import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaDownload, FaEllipsisH } from 'react-icons/fa';
import { toggleLike, downloadSong, addSongToPlaylist } from '../../services/api';
import ShareButtons from '../social/ShareButtons';
import toast from 'react-hot-toast';
import { PLACEHOLDER } from '../../utils/helpers';

export default function TrackCard({ song, onPlay, isPlaying }) {
  const { user }             = useSelector((s) => s.auth);
  const { items: playlists } = useSelector((s) => s.playlist);
  const [liked,    setLiked]    = useState(song.likes?.includes(user?._id));
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Log in to like songs');
    const res = await toggleLike(song._id);
    setLiked(res.data.liked);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Log in to download');
    const res = await downloadSong(song._id);
    const a   = document.createElement('a');
    a.href     = res.data.downloadUrl;
    a.download = `${song.title}.mp3`;
    a.target   = '_blank';
    a.click();
    toast.success('Download started!');
  };

  const handleAddToPlaylist = async (e, playlistId) => {
    e.stopPropagation();
    try {
      await addSongToPlaylist(playlistId, song._id);
      toast.success('Added to playlist');
      setShowMenu(false);
    } catch {
      toast.error('Could not add to playlist');
    }
  };

  return (
    <div
      onClick={onPlay}
      className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 cursor-pointer transition-colors group relative"
    >
      <div className="relative mb-4">
        <img
          src={song.coverImage || PLACEHOLDER}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button className={`absolute bottom-2 right-2 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {isPlaying
            ? <FaPause size={14} className="text-black" />
            : <FaPlay  size={14} className="text-black ml-0.5" />
          }
        </button>
      </div>

      <p className="font-semibold text-sm text-white truncate">{song.title}</p>
      <p className="text-xs text-[#b3b3b3] truncate mt-1">{song.artist}</p>

      <div className="flex items-center gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleLike} className={liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}>
          {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
        </button>
        <button onClick={handleDownload} className="text-[#b3b3b3] hover:text-white">
          <FaDownload size={13} />
        </button>
        <ShareButtons song={song} />
        {user && playlists.length > 0 && (
          <div className="relative ml-auto">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-[#b3b3b3] hover:text-white"
            >
              <FaEllipsisH size={13} />
            </button>
            {showMenu && (
              <div className="absolute bottom-6 right-0 bg-[#282828] border border-[#404040] rounded-md shadow-xl z-10 min-w-[150px]">
                <p className="text-xs text-[#b3b3b3] px-3 py-2 border-b border-[#404040]">Add to playlist</p>
                {playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={(e) => handleAddToPlaylist(e, pl._id)}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}