// Models
const Story = require('../models/storyModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return next(new AppError('No User Found with That ID', 404));
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
  const stories = await Story.find();
  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: {
      stories,
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
