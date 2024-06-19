const { model, Types, Schema } = require('mongoose');

const friendSchema = new Schema({
  user1: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Friend = model('Friend', friendSchema);
module.exports = Friend;
