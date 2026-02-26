import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe } from './redux/slices/authSlice';
import Sidebar       from './components/common/Sidebar';
import MusicPlayer   from './components/music/MusicPlayer';
import Home          from './pages/Home';
import Search        from './pages/Search';
import Library       from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Login         from './pages/Login';
import Register      from './pages/Register';
import LikedSongs    from './pages/LikedSongs';
import Profile       from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((s) => s.auth);
  if (!initialized) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  const { currentSong } = useSelector((s) => s.player);

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#282828', color: '#fff', border: '1px solid #404040' },
          success: { iconTheme: { primary: '#1DB954', secondary: '#fff' } },
        }}
      />
      <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
        <Sidebar />
        <main className={`flex-1 overflow-y-auto ${currentSong ? 'pb-24' : ''}`}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/search"     element={<Search />} />
            <Route path="/library"    element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
            <Route path="/liked"      element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
          </Routes>
        </main>
      </div>
      {currentSong && <MusicPlayer />}
    </BrowserRouter>
  );
}