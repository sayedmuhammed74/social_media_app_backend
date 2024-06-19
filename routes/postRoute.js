const express = require('express');
const router = express.Router();

// controllers
const { getAllPosts, createPost } = require('../controllers/postController');
const { protect } = require('../controllers/authController');

router.use(protect);
router.route('/').get(getAllPosts).post(createPost);

module.exports = router;
