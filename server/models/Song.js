const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  artist:        { type: String, required: true },
  album:         { type: String, default: '' },
  genre:         { type: String, default: 'Pop' },
  movie:         { type: String, default: '' },
  duration:      { type: Number, default: 0 },
  audioUrl:      { type: String, required: true },
  coverImage:    { type: String, default: '' },
  publicId:      { type: String, default: '' },
  likes:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  playCount:     { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  uploadedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

songSchema.index({ title: 'text', artist: 'text', album: 'text', movie: 'text' });

module.exports = mongoose.model('Song', songSchema);