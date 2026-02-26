import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { searchSongs } from '../services/api';
import { setCurrentSong } from '../redux/slices/playerSlice';
import TrackCard from '../components/music/TrackCard';
import { GENRES } from '../utils/helpers';

const COLORS = [
  'bg-[#E8115B]','bg-[#509BF5]','bg-[#BC5900]','bg-[#1E3264]','bg-[#608108]',
  'bg-[#E91429]','bg-[#503750]','bg-[#477D95]','bg-[#E4E42A]','bg-[#1DB954]',
];

export default function Search() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((s) => s.player);
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef(null);

  const doSearch = (q) => {
    clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      const res = await searchSongs(q);
      setResults(res.data);
      setLoading(false);
    }, 400);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    doSearch(e.target.value);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative mb-8 max-w-xl">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3]" size={16} />
        <input
          value={query}
          onChange={handleChange}
          placeholder="What do you want to listen to?"
          className="w-full pl-11 pr-4 py-3 bg-white text-black rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
      </div>

      {!searched && (
        <div>
          <h2 className="text-xl font-bold mb-4">Browse by genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GENRES.map((g, i) => (
              <button
                key={g}
                onClick={() => { setQuery(g); doSearch(g); setSearched(true); }}
                className={`${COLORS[i % COLORS.length]} rounded-lg p-4 text-left font-bold text-white text-sm h-20 hover:opacity-90 transition-opacity`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-[#b3b3b3]">
          <div className="w-4 h-4 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
          Searching...
        </div>
      )}

      {!loading && searched && (
        <>
          <p className="text-[#b3b3b3] text-sm mb-4">{results.length} results for "{query}"</p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((song, i) => (
                <TrackCard
                  key={song._id}
                  song={song}
                  onPlay={() => dispatch(setCurrentSong({ song, queue: results, index: i }))}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white text-xl font-bold mb-2">No results found</p>
              <p className="text-[#b3b3b3]">Try different keywords.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}