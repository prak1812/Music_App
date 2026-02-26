const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text:     { type: String, required: true, maxlength: 500 },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song:     { type: mongoose.Schema.Types.ObjectId, ref: 'Song', default: null },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);