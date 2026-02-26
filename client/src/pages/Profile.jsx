import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { updateProfile } from '../services/api';
import { setUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [username, setUsername] = useState(user?.username || '');
  const [loading,  setLoading]  = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ username });
      dispatch(setUser({ ...user, username: res.data.username }));
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-[#1DB954] flex items-center justify-center text-black text-4xl font-black">
          {user?.username?.[0]?.toUpperCase() || <FaUser />}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.username}</h2>
          <p className="text-[#b3b3b3] text-sm">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#282828] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Edit profile</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-white mb-2">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#3e3e3e] text-white px-4 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}