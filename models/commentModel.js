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
      required: [true, 'comment can not be empty'],
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: 'Like',
      },
    ],
    content: {
      type: String,
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-cover -email -role -createdAt -updatedAt -__v',
  }); // Populate user
  next();
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
