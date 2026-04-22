import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadSong } from '../services/api';
import { GENRES } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FaMusic, FaImage, FaUpload } from 'react-icons/fa';

export default function Upload() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', artist: '', album: '', genre: 'Pop', duration: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAudio = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFile(file);

    // Auto get duration
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      setForm((f) => ({ ...f, duration: Math.floor(audio.duration).toString() }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return toast.error('Please select an audio file');
    if (!form.title || !form.artist) return toast.error('Title and artist are required');

    const data = new FormData();
    data.append('title',    form.title);
    data.append('artist',   form.artist);
    data.append('album',    form.album);
    data.append('genre',    form.genre);
    data.append('duration', form.duration);
    data.append('audio',    audioFile);
    if (coverFile) data.append('cover', coverFile);

    try {
      setLoading(true);
      await uploadSong(data);
      toast.success('Song uploaded successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upload a Song</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Cover Preview */}
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-[#282828] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {coverPreview
                ? <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                : <FaImage className="text-[#535353] text-4xl" />
              }
            </div>
            <div>
              <p className="text-white font-medium mb-2">Cover Image</p>
              <label className="cursor-pointer bg-[#282828] hover:bg-[#3e3e3e] text-white text-sm px-4 py-2 rounded-full transition">
                Choose Image
                <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
              </label>
              <p className="text-[#b3b3b3] text-xs mt-2">JPG, PNG (optional)</p>
            </div>
          </div>

          {/* Audio File */}
          <div className="bg-[#282828] rounded-lg p-4">
            <p className="text-white font-medium mb-2">Audio File *</p>
            <label className="cursor-pointer flex items-center gap-3 text-[#b3b3b3] hover:text-white transition">
              <FaMusic className="text-[#1DB954]" />
              <span className="text-sm">{audioFile ? audioFile.name : 'Choose MP3 file'}</span>
              <input type="file" accept="audio/*" onChange={handleAudio} className="hidden" />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-[#b3b3b3] text-sm mb-1 block">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Song title"
              className="w-full bg-[#282828] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#535353]"
            />
          </div>

          {/* Artist */}
          <div>
            <label className="text-[#b3b3b3] text-sm mb-1 block">Artist *</label>
            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Artist name"
              className="w-full bg-[#282828] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#535353]"
            />
          </div>

          {/* Album */}
          <div>
            <label className="text-[#b3b3b3] text-sm mb-1 block">Album</label>
            <input
              name="album"
              value={form.album}
              onChange={handleChange}
              placeholder="Album name (optional)"
              className="w-full bg-[#282828] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#535353]"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-[#b3b3b3] text-sm mb-1 block">Genre</label>
            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full bg-[#282828] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1DB954]"
            >
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <FaUpload />
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>

        </form>
      </div>
    </div>
  );
}