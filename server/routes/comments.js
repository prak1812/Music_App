const express     = require('express');
const router      = express.Router();
const { protect } = require('../middleware/auth');
const { getSongComments, addComment, deleteComment } = require('../controllers/commentController');

router.get('/song/:songId', getSongComments);
router.post('/',            protect, addComment);
router.delete('/:id',       protect, deleteComment);

module.exports = router;