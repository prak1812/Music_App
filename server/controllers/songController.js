const Song = require('../models/Song');

exports.getSongs = async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const genre = req.query.genre;
  const filter = genre ? { genre } : {};
  const songs = await Song.find(filter)
    .sort({ playCount: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('uploadedBy', 'username');
  const total = await Song.countDocuments(filter);
  res.json({ songs, total, page, pages: Math.ceil(total / limit) });
};

exports.getSong = async (req, res) => {
  const song = await Song.findById(req.params.id).populate('uploadedBy', 'username');
  if (!song) return res.status(404).json({ message: 'Song not found' });
  song.playCount += 1;
  await song.save();
  res.json(song);
};

exports.searchSongs = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const songs = await Song.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } }).limit(30);
  res.json(songs);
};

exports.uploadSong = async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);

  const title    = req.body.title    || req.body.Title;
  const artist   = req.body.artist   || req.body.Artist;
  const album    = req.body.album    || req.body.Album    || '';
  const genre    = req.body.genre    || req.body.Genre    || 'Pop';
  const movie    = req.body.movie    || req.body.Movie    || '';
  const duration = req.body.duration || req.body.Duration || 0;

  if (!title || !artist) {
    return res.status(400).json({ message: `Missing fields - title: ${title}, artist: ${artist}`, body: req.body });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded', files: req.files });
  }

  const audioFile = req.files.find(f =>
    f.mimetype.startsWith('audio') ||
    f.originalname.match(/\.(mp3|wav|ogg)$/i) ||
    f.fieldname === 'audio'
  );

  const coverFile = req.files.find(f =>
    f.mimetype.startsWith('image') ||
    f.originalname.match(/\.(jpg|jpeg|png|webp)$/i) ||
    f.fieldname === 'cover'
  );

  if (!audioFile) {
    return res.status(400).json({ message: 'Audio file is required', files: req.files.map(f => f.originalname) });
  }

  const song = await Song.create({
    title,
    artist,
    album,
    genre,
    movie,
    duration: parseFloat(duration) || 0,
    audioUrl: audioFile.path,
    coverImage: coverFile ? coverFile.path : '',
    publicId: audioFile.filename,
    uploadedBy: req.user._id,
  });

  res.status(201).json(song);
};

exports.toggleLike = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: 'Song not found' });
  const userId = req.user._id;
  const liked  = song.likes.includes(userId);
  if (liked) {
    song.likes.pull(userId);
    req.user.likedSongs.pull(song._id);
  } else {
    song.likes.push(userId);
    req.user.likedSongs.push(song._id);
  }
  await song.save();
  await req.user.save();
  res.json({ liked: !liked, likeCount: song.likes.length });
};

exports.downloadSong = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: 'Song not found' });
  song.downloadCount += 1;
  await song.save();
  res.json({ downloadUrl: song.audioUrl, title: song.title });
};

exports.deleteSong = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: 'Song not found' });
  if (song.uploadedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await song.deleteOne();
  res.json({ message: 'Song deleted' });
};