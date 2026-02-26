import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMusic } from 'react-icons/fa';
import { login, clearError } from '../redux/slices/authSlice';

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/');
    return () => { dispatch(clearError()); };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (!res.error) navigate('/');
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaMusic className="text-[#1DB954] text-3xl" />
            <span className="text-white text-2xl font-black tracking-tight">SoundStream</span>
          </div>
          <h1 className="text-3xl font-black text-white">Log in to SoundStream</h1>
        </div>
        <div className="rounded-2xl p-8 border border-[#282828]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                className="w-full bg-[#121212] border border-[#535353] text-white px-4 py-3 rounded-md text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                className="w-full bg-[#121212] border border-[#535353] text-white px-4 py-3 rounded-md text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1DB954] text-black py-3.5 rounded-full font-black text-base hover:bg-[#1ed760] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="border-t border-[#282828] mt-6 pt-6 text-center">
            <p className="text-[#b3b3b3] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold underline underline-offset-2 hover:text-[#1DB954]">
                Sign up for SoundStream
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}