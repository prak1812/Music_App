import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaSearch, FaBook, FaHeart, FaUser, FaSignOutAlt, FaMusic } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import { useEffect } from 'react';
import { fetchPlaylists } from '../../redux/slices/playlistSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user }           = useSelector((s) => s.auth);
  const { items: playlists } = useSelector((s) => s.playlist);

  useEffect(() => {
    if (user) dispatch(fetchPlaylists());
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const link = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-white bg-[#282828]' : 'text-[#b3b3b3] hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-black flex flex-col shrink-0 overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <FaMusic className="text-[#1DB954] text-xl" />
          <span className="text-white text-xl font-bold tracking-tight">SoundStream</span>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={link}><FaHome size={18} /> Home</NavLink>
          <NavLink to="/search"  className={link}><FaSearch size={18} /> Search</NavLink>
          <NavLink to="/library" className={link}><FaBook size={18} /> Your Library</NavLink>
          {user && <NavLink to="/liked" className={link}><FaHeart size={18} /> Liked Songs</NavLink>}
        </nav>
      </div>

      {user && playlists.length > 0 && (
        <div className="flex-1 overflow-y-auto px-6 py-4 border-t border-[#282828] mt-2">
          <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-widest mb-3">Playlists</p>
          <div className="flex flex-col gap-1">
            {playlists.map((pl) => (
              <NavLink
                key={pl._id}
                to={`/playlist/${pl._id}`}
                className="text-sm text-[#b3b3b3] hover:text-white truncate py-1 transition-colors"
              >
                {pl.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-[#282828]">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <p className="text-sm font-medium text-white flex-1 truncate">{user.username}</p>
            <button onClick={handleLogout} className="text-[#b3b3b3] hover:text-white transition-colors">
              <FaSignOutAlt size={16} />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="flex items-center gap-3 text-sm text-[#b3b3b3] hover:text-white transition-colors">
            <FaUser size={16} /> Log in
          </NavLink>
        )}
      </div>
    </aside>
  );
}