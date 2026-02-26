import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { getSongComments, addComment, deleteComment } from '../../services/api';
import toast from 'react-hot-toast';

export default function CommentSection({ songId }) {
  const { user }    = useSelector((s) => s.auth);
  const [comments,  setComments]  = useState([]);
  const [text,      setText]      = useState('');
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!songId) return;
    getSongComments(songId).then((res) => setComments(res.data));
  }, [songId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user)       return toast.error('Log in to comment');
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await addComment({ text: text.trim(), song: songId });
      setComments([res.data, ...comments]);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteComment(id);
    setComments(comments.filter((c) => c._id !== id));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">
        Comments <span className="text-[#b3b3b3] font-normal text-sm">({comments.length})</span>
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm shrink-0">
            {user.username[0].toUpperCase()}
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            className="flex-1 bg-[#282828] border border-[#404040] rounded-full px-4 py-2 text-sm text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#1DB954] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-[#1DB954] text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-[#1ed760] disabled:opacity-50 transition-colors"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-sm text-[#b3b3b3] mb-6">Log in to leave a comment.</p>
      )}

      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#535353] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {c.user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-white">{c.user?.username}</span>
                <span className="text-xs text-[#b3b3b3]">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-[#d1d1d1] mt-1 break-words">{c.text}</p>
            </div>
            {user?._id === c.user?._id && (
              <button onClick={() => handleDelete(c._id)} className="text-[#b3b3b3] hover:text-red-400 transition-colors self-start mt-1">
                <FaTrash size={12} />
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-[#b3b3b3] text-center py-4">No comments yet.</p>
        )}
      </div>
    </div>
  );
}