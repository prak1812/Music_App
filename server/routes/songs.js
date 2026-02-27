const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const {
  createSong,
  getSongs,
  getSongById,
  deleteSong
} = require("../controllers/songController");


router.post("/", protect, createSong);


router.get("/", getSongs);


router.get("/:id", getSongById);


router.delete("/:id", protect, deleteSong);

module.exports = router;