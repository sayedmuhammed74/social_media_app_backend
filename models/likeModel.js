const { model, Schema, Types } = require('mongoose');

const likeSchema = new Schema(
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
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
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

const Like = model('Like', likeSchema);

module.exports = Like;
