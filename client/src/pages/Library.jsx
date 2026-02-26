import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaMusic, FaTrash, FaList, FaTh } from 'react-icons/fa';
import { createPlaylist, removePlaylist } from '../redux/slices/playlistSlice';
import toast from 'react-hot-toast';

export default function Library() {
  const dispatch = useDispatch();
  const { items: playlists } = useSelector((s) => s.playlist);
  const [showForm, setShowForm] = useState(false);
  const [name,     setName]     = useState('');
  const [desc,     setDesc]     = useState('');
  const [view,     setView]     = useState('grid');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(createPlaylist({ name: name.trim(), description: desc.trim() }));
    setName(''); setDesc(''); setShowForm(false);
    toast.success('Playlist created!');
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(removePlaylist(id));
    toast.success('Playlist deleted');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}><FaTh /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}><FaList /></button>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1DB954] text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-[#1ed760] transition-colors"
          >
            <FaPlus size={12} /> New Playlist
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#282828] rounded-xl p-6 mb-6 max-w-md">
          <h3 className="text-lg font-bold mb-4">Create playlist</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            required
            className="w-full bg-[#3e3e3e] text-white px-4 py-2.5 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-[#3e3e3e] text-white px-4 py-2.5 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />
          <div className="flex gap-3">
            <button type="submit" className="bg-[#1DB954] text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-[#1ed760]">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-[#b3b3b3] hover:text-white px-4 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <FaMusic size={48} className="text-[#535353] mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-2">Create your first playlist</p>
          <button onClick={() => setShowForm(true)} className="mt-4 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            Create playlist
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <Link key={pl._id} to={`/playlist/${pl._id}`} className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 group transition-colors relative">
              <div className="w-full aspect-square bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-md flex items-center justify-center mb-4 shadow-lg">
                <FaMusic size={36} className="text-white opacity-60" />
              </div>
              <p className="font-bold text-sm text-white truncate">{pl.name}</p>
              <p className="text-xs text-[#b3b3b3] mt-1">{pl.songs.length} songs</p>
              <button onClick={(e) => handleDelete(e, pl._id)} className="absolute top-3 right-3 text-[#b3b3b3] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <FaTrash size={13} />
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {playlists.map((pl) => (
            <Link key={pl._id} to={`/playlist/${pl._id}`} className="flex items-center gap-4 px-3 py-3 rounded-md hover:bg-[#282828] group transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-md flex items-center justify-center shrink-0">
                <FaMusic size={18} className="text-white opacity-60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{pl.name}</p>
                <p className="text-xs text-[#b3b3b3]">Playlist · {pl.songs.length} songs</p>
              </div>
              <button onClick={(e) => handleDelete(e, pl._id)} className="text-[#b3b3b3] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <FaTrash size={13} />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}