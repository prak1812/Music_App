

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));

/* ================= Body Parsers ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= Root Route (IMPORTANT) ================= */
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Music App API is running 🚀",
  });
});

/* ================= Routes ================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));

/* ================= Error Handler ================= */
app.use(errorHandler);

/* ================= Server ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});