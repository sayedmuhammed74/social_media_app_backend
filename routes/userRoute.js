const express = require('express');
const router = express.Router();

// controllers
const {
  signup,
  login,
  protect,
  restrictTo,
} = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  createStory,
  getAllStories,
} = require('../controllers/userController');

// Auth
router.route('/signup').post(signup);
router.route('/login').post(login);

// Stories
router
  .route('/stories')
  .get(protect, getAllStories)
  .post(protect, restrictTo('user'), createStory);

//   Users
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser);

module.exports = router;
