const { Schema, model, Types } = require('mongoose');

const postSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'The post must have a creator'],
    },
    description: {
      type: String,
      required: true,
    },
    media: [String],
    tags: {
      type: [Types.ObjectId],
      ref: 'User',
    },
    tags: [{ type: String }],
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

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-email -role -createdAt -birthdate -bio -__v',
  });
  next();
});

const Post = model('Post', postSchema);

module.exports = Post;
