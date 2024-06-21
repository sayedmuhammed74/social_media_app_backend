// Models
const Story = require('../models/storyModel');
const User = require('./../models/userModel');
const Request = require('./../models/requestModel');

// Utils
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({
    fullname: { $regex: new RegExp(req.query.name, 'i') },
    _id: { $ne: req.user._id },
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return next(new AppError('No User Found with That name', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Stories Controllers
exports.getAllStories = catchAsync(async (req, res, next) => {
  let result = [];
  const stories = await Story.find();

  const friends = await Request.find({
    $or: [{ to: req.user._id }, { from: req.user._id }],
    status: 'accepted',
  });

  stories.forEach((story) => {
    if (story.user.equals(req.user._id)) {
      result.push(story);
    } else {
      friends.forEach((friend) => {
        if (
          story.user._id.equals(friend.from._id) ||
          story.user._id.equals(friend.to._id)
        ) {
          result.push(story);
        }
      });
    }
  });

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      stories: result,
    },
  });
});

exports.createStory = catchAsync(async (req, res, next) => {
  const story = await Story.create({
    user: req.user._id,
    text: req.body.text,
    image: req.body.image,
  });

  res.status(201).json({
    status: 'success',
    data: {
      story,
    },
  });
});

// Friends Requests Controllers

exports.getAllFriendRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.find({ to: req.user._id, status: 'pending' });
  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: {
      requests,
    },
  });
});

exports.createFriendRequest = catchAsync(async (req, res, next) => {
  const request = await Request.create({
    from: req.user._id,
    to: req.body.to,
  });
  res.status(200).json({
    status: 'success',
    data: {
      request,
    },
  });
});

exports.cancelFriendRequest = catchAsync(async (req, res, next) => {
  await Request.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findByIdAndUpdate(req.params.id, {
    status: 'accepted',
  });
  res.status(200).json({
    status: 'success',
    data: {
      request,
    },
  });
});

exports.cancelFriendRequest = catchAsync(async (req, res, next) => {
  await Request.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Friends Controllers
exports.getAllFriends = catchAsync(async (req, res, next) => {
  const friends = await Request.find({
    $or: [{ to: req.user._id }, { from: req.user._id }],
    status: 'accepted',
  });
  res.status(200).json({
    status: 'success',
    results: friends.length,
    data: {
      friends,
    },
  });
});

// Search
// exports.search = catchAsync(async (req, res, next) => {
//   const results = await User.find({
//     fullname: { $regex: new RegExp(`\\b${req.query.searchValue}\\b`, 'i') },
//   });
//   res.status(200).json({
//     status: 'success',
//     data: {
//       results,
//     },
//   });
// });
