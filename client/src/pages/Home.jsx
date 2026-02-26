import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSongs } from '../services/api';
import { setCurrentSong } from '../redux/slices/playerSlice';
import TrackCard from '../components/music/TrackCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { GENRES } from '../utils/helpers';

export default function Home() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((s) => s.player);
  const [songs,   setSongs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre,   setGenre]   = useState('');
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSongs({ genre: genre || undefined, page: 1, limit: 20 }).then((res) => {
      setSongs(res.data.songs);
      setHasMore(1 < res.data.pages);
      setPage(1);
    }).finally(() => setLoading(false));
  }, [genre]);

  const loadMore = () => {
    const next = page + 1;
    getSongs({ genre: genre || undefined, page: next, limit: 20 }).then((res) => {
      setSongs((prev) => [...prev, ...res.data.songs]);
      setHasMore(next < res.data.pages);
      setPage(next);
    });
  };

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{greet()} 👋</h1>

      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setGenre('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            genre === '' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#3e3e3e]'
          }`}
        >
          All
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              genre === g ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#3e3e3e]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : songs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#b3b3b3] text-lg">No songs found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {songs.map((song, i) => (
              <TrackCard
                key={song._id}
                song={song}
                onPlay={() => dispatch(setCurrentSong({ song, queue: songs, index: i }))}
                isPlaying={currentSong?._id === song._id && isPlaying}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-[#282828] text-white rounded-full font-medium hover:bg-[#3e3e3e] transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}