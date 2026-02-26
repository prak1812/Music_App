const Comment = require('../models/Comment');

exports.getSongComments = async (req, res) => {
  const comments = await Comment.find({ song: req.params.songId })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });
  res.json(comments);
};

exports.addComment = async (req, res) => {
  const { text, song, playlist } = req.body;
  const comment = await Comment.create({ text, user: req.user._id, song, playlist });
  const populated = await Comment.findById(comment._id).populate('user', 'username avatar');
  res.status(201).json(populated);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};