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
      trim: true,
      required: true,
    },
    media: [String],
    tags: {
      type: [Types.ObjectId],
      ref: 'User',
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

// Virtual field for comments
postSchema.virtual('comments', {
  ref: 'Comment', // The model to use
  localField: '_id', // Find comments where `post` is equal to `id`
  foreignField: 'post', // The field in the Comment model that references the post
});

// Virtual field for likes
postSchema.virtual('likes', {
  ref: 'Like', // The model to use
  localField: '_id', // Find likes where `post` is equal to `id`
  foreignField: 'post', // The field in the Like model that references the post
});

// Pre-find middleware to populate user and comments
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-cover -email -role -createdAt -updatedAt -birthdate -bio -__v',
  })
    .populate({ path: 'comments', select: '-updatedAt -__v' }) // Populate comments
    .populate('likes')
    .select('-__v -updatedAt'); // Populate likes
  next();
});

const Post = model('Post', postSchema);

module.exports = Post;
