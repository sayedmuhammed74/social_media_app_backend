// Models
const Notification = require('./../models/notificationModel');
// Utils
const catchAsync = require('../utils/catchAsync');

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id });
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
  await Notification.findByIdAndDelete(req.params.notificationId);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
