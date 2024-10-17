// Models
const Notification = require('./../models/notificationModel');
// Utils
const catchAsync = require('../utils/catchAsync');

// Expect Messages
exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({
    user: req.user._id,
    type: { $ne: 'message' },
  });
  res.status(200).json({
    status: 'success',
    data: {
      notifications,
    },
  });
});

exports.getMessageNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({
    user: req.user._id,
    type: 'message',
  });
  res.status(200).json({
    status: 'success',
    data: {
      notifications,
    },
  });
});

exports.getOneNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.notificationId);
  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

exports.addNotification = catchAsync(async (req, res, next) => {
  const { userId, type, referenceId, referenceType } = req.body;

  const notification = await Notification.create({
    user: userId,
    type,
    referenceId,
    referenceType,
  });

  res.status(201).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

exports.readNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.notificationId,
    { isRead: true },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

exports.removeNotification = catchAsync(async (req, res, next) => {
  const { userId, referenceId, type } = req.query;
  await Notification.findOneAndDelete({ user: userId, referenceId, type });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
