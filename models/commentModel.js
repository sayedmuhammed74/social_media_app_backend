const { model, Schema, Types } = require('mongoose');

const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'Like',
      },
    ],
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
