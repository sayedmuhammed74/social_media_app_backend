const express = require('express');
const router = express.Router();

// controllers
const { signup, login, protect } = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  createStory,
  getAllStories,
  getAllFriendRequests,
  cancelFriendRequest,
  createFriendRequest,
  acceptFriendRequest,
  getAllFriends,
  getRequest,
} = require('../controllers/userController');

// Uoload Product Image
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./../utils/cloudinaryConfig');

// Creare Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'users', // Specify the folder in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed formats
  },
});

const upload = multer({ storage: storage });

// Auth
router.route('/signup').post(upload.single('picture'), signup);
router.route('/login').post(login);

router.use(protect);

// Stories
router.route('/stories').get(getAllStories).post(createStory);

// Requests
router.route('/requests').get(getAllFriendRequests).post(createFriendRequest);

router
  .route('/requests/:id')
  .get(getRequest)
  .patch(acceptFriendRequest)
  .delete(cancelFriendRequest);

// Freinds
router.route('/friends').get(getAllFriends);

//   Users
router.route('/').get(getAllUsers);
router.route('/:slug').get(getUser);

module.exports = router;
