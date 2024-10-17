// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: 'social-app-cloud',
  api_key: '777687867537982',
  api_secret: 'v7V9X74fSQunI9r2SX6eEnHqZJE',
});

module.exports = cloudinary;
