const express = require('express');
const router = express.Router();

// controllers
const {
  getAllPosts,
  createPost,
  addLike,
  deleteLike,
  addComment,
  deleteComment,
  getPost,
  getAllComments,
  getAllLikes,
  updateComment,
  deletePost,
  updatePost,
} = require('../controllers/postController');
const { protect } = require('../controllers/authController');

// Protect Middleware
router.use(protect);

// Posts
router.route('/').get(getAllPosts).post(createPost);
router.route('/:postId').get(getPost).patch(updatePost).delete(deletePost);

// Likes
router.route('/:postId/likes').get(getAllLikes).post(addLike);
router.route('/:postId/likes/:likeId').delete(deleteLike);

// Comments
router.route('/:postId/comments').get(getAllComments).post(addComment);
router
  .route('/:postId/comments/:commentId')
  .patch(updateComment)
  .delete(deleteComment);

module.exports = router;
