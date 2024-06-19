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
  deleteFriendRequest,
  getAllFriends,
} = require('../controllers/userController');

// Auth
router.route('/signup').post(signup);
router.route('/login').post(login);

// Stories
router.route('/stories').get(protect, getAllStories).post(protect, createStory);

// Requests
router
  .route('/requests')
  .get(protect, getAllFriendRequests)
  .post(protect, createFriendRequest);

router
  .route('/requests/:id')
  .patch(protect, acceptFriendRequest)
  .delete(protect, cancelFriendRequest);

// Freinds
router.route('/friends').get(protect, getAllFriends);

//   Users
router.route('/').get(protect, getAllUsers);
router.route('/:slug').get(getUser);

module.exports = router;
