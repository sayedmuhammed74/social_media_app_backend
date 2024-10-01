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
    },
    comment: {
      type: Types.ObjectId,
      ref: 'Comment',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-cover -email -role -createdAt -updatedAt -__v',
  }); // Populate user
  next();
});

const Like = model('Like', likeSchema);

module.exports = Like;
