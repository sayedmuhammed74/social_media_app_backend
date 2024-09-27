const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['friend_request', 'like', 'comment', 'story_view'],
  },
  referenceId: { type: Types.ObjectId }, // Could refer to the post, comment, etc.
  createdAt: { type: Date, default: Date.now },
});

const Notification = model('Notification', notificationSchema);

module.exports = Notification;
