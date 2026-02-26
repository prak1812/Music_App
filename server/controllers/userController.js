const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('likedSongs')
    .populate('playlists');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { username, avatar } = req.body;
  if (username) user.username = username;
  if (avatar)   user.avatar   = avatar;
  await user.save();
  res.json({ _id: user._id, username: user.username, email: user.email, avatar: user.avatar });
};

exports.getLikedSongs = async (req, res) => {
  const user = await User.findById(req.user._id).populate('likedSongs');
  res.json(user.likedSongs);
};