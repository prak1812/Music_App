const Playlist = require('../models/Playlist');

exports.getMyPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id })
    .populate('songs')
    .populate('owner', 'username avatar');
  res.json(playlists);
};

exports.getPlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('songs')
    .populate('owner', 'username avatar');
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  res.json(playlist);
};

exports.createPlaylist = async (req, res) => {
  const { name, description, isPublic } = req.body;
  const playlist = await Playlist.create({
    name,
    description,
    isPublic: isPublic !== false,
    owner: req.user._id,
  });
  res.status(201).json(playlist);
};

exports.updatePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const { name, description, isPublic } = req.body;
  if (name !== undefined)        playlist.name        = name;
  if (description !== undefined) playlist.description = description;
  if (isPublic !== undefined)    playlist.isPublic    = isPublic;
  await playlist.save();
  res.json(playlist);
};

exports.deletePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await playlist.deleteOne();
  res.json({ message: 'Playlist deleted' });
};

exports.addSong = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  if (!playlist.songs.includes(req.body.songId)) {
    playlist.songs.push(req.body.songId);
    await playlist.save();
  }
  const updated = await Playlist.findById(playlist._id).populate('songs');
  res.json(updated);
};

exports.removeSong = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  playlist.songs.pull(req.params.songId);
  await playlist.save();
  const updated = await Playlist.findById(playlist._id).populate('songs');
  res.json(updated);
};