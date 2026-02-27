const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.mimetype.startsWith('audio') || file.originalname.match(/\.(mp3|wav|ogg)$/i)) {
      return {
        folder: 'music-app/audio',
        resource_type: 'video',
        allowed_formats: ['mp3', 'wav', 'ogg'],
      };
    }
    return {
      folder: 'music-app/covers',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

const upload = multer({ storage }).any();

module.exports = { cloudinary, upload };