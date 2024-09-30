// Models
const Post = require('./../models/postModel');
const Like = require('../models/likeModel');
// Utils
const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/commentModel');

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

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId });
  res.status(200).json({
    status: 'sucess',
    data: {
      post,
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

exports.updatePost = catchAsync(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      description: req.body.description,
    },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.postId);
  await Like.deleteMany({ post: req.params.postId });
  await Comment.deleteMany({ post: req.params.postId });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Likes
exports.getAllLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ post: req.params.postId }).populate({
    path: 'user',
    select: '+firstname +lasstname +picture',
  });
  res.status(200).json({
    status: 'success',
    data: {
      likes,
    },
  });
});

exports.addLike = catchAsync(async (req, res, next) => {
  const like = await Like.create({
    user: req.user._id,
    post: req.params.postId,
  });
  res.status(201).json({
    status: 'success',
    data: {
      like,
    },
  });
});

exports.deleteLike = catchAsync(async (req, res, next) => {
  await Like.findByIdAndDelete(req.params.likeId);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Comments
exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate({
    path: 'user',
  });
  res.status(200).json({
    status: 'success',
    data: {
      comments,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const comment = await Comment.create({
    user: req.user._id,
    post: req.params.postId,
    content,
  });
  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: {
      comment: updatedComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  await Like.findByIdAndDelete(req.params.commentId);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
