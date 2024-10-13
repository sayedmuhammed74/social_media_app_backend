const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversation: { type: Types.ObjectId, ref: 'Conversation' },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Message = model('Message', messageSchema);

module.exports = Message;
