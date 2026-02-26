const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/auth');
const { upload }  = require('../config/cloudinary');
const {
  getSongs, getSong, searchSongs,
  uploadSong, toggleLike, downloadSong, deleteSong,
} = require('../controllers/songController');

router.get('/',             getSongs);
router.get('/search',       searchSongs);
router.get('/:id',          getSong);
router.post('/',            protect, upload, uploadSong);
router.post('/:id/like',    protect, toggleLike);
router.get('/:id/download', protect, downloadSong);
router.delete('/:id',       protect, deleteSong);

module.exports = router;