const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMyPlaylists, getPlaylist,
  createPlaylist, updatePlaylist, deletePlaylist,
  addSong, removeSong,
} = require('../controllers/playlistController');

router.get('/',                     protect, getMyPlaylists);
router.get('/:id',                  getPlaylist);
router.post('/',                    protect, createPlaylist);
router.put('/:id',                  protect, updatePlaylist);
router.delete('/:id',               protect, deletePlaylist);
router.post('/:id/songs',           protect, addSong);
router.delete('/:id/songs/:songId', protect, removeSong);

module.exports = router;