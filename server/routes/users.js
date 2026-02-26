const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, getLikedSongs } = require('../controllers/userController');

router.get('/liked',   protect, getLikedSongs);
router.put('/profile', protect, updateProfile);
router.get('/:id',     getProfile);

module.exports = router;