export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical',
  'Electronic', 'R&B', 'Bollywood', 'Country', 'Metal',
];

export const PLACEHOLDER = 'https://via.placeholder.com/300x300/282828/1DB954?text=♫';