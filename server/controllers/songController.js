const Song = require('../models/Song');

exports.getSongs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const genre = req.query.genre;
    const filter = genre ? { genre } : {};
    const songs = await Song.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('uploadedBy', 'username');
    const total = await Song.countDocuments(filter);
    res.json({ songs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('uploadedBy', 'username');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    song.playCount += 1;
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const songs = await Song.find({
      $or: [
        { title:  { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { album:  { $regex: q, $options: 'i' } },
      ],
    }).limit(30);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ message: 'Title and artist are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioFile = req.files.find(f =>
      f.mimetype.startsWith('audio') ||
      f.originalname.match(/\.(mp3|wav|ogg)$/i)
    );
    const coverFile = req.files.find(f =>
      f.mimetype.startsWith('image') ||
      f.originalname.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const song = await Song.create({
      title,
      artist,
      album:      album || '',
      genre:      genre || 'Pop',
      duration:   parseFloat(duration) || 0,
      audioUrl:   audioFile.path,
      coverImage: coverFile ? coverFile.path : '',
      publicId:   audioFile.filename,
      uploadedBy: req.user._id,
    });

    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const User   = require('../models/User');
    const user   = await User.findById(req.user._id);
    const userId = req.user._id.toString();
    const likes  = song.likes.map((l) => l.toString());
    const liked  = likes.includes(userId);

    if (liked) {
      // Unlike — remove from both song.likes and user.likedSongs
      song.likes       = song.likes.filter((l) => l.toString() !== userId);
      user.likedSongs  = user.likedSongs.filter((s) => s.toString() !== song._id.toString());
    } else {
      // Like — add to both song.likes and user.likedSongs
      song.likes.push(req.user._id);
      user.likedSongs.push(song._id);
    }

    await song.save();
    await user.save();

    res.json({ liked: !liked, likeCount: song.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    song.downloadCount += 1;
    await song.save();
    res.json({ downloadUrl: song.audioUrl, title: song.title });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (song.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await song.deleteOne();
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};