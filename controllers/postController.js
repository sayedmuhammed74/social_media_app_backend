// Models
const Post = require('./../models/postModel');
// Utils
const catchAsync = require('../utils/catchAsync');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let posts;
  if (req.query.userId) {
    posts = await Post.find({ user: req.query.userId }).sort({ createdAt: -1 });
  } else {
    posts = await Post.find().sort({ createdAt: -1 });
  }

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    user: req.user._id,
    description: req.body.description,
    media: req.body.media,
  });

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});
