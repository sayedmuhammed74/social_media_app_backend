const { model, Schema, Types } = require('mongoose');

const storySchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Story must have a creator'],
    },
    image: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

storySchema.pre('validate', function (next) {
  if (!this.img && !this.text) {
    this.invalidate('text', 'Story must have at least an image or text');
  }
  next();
});

// populate user
storySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-email -role -createdAt -birthdate -bio -__v',
  });
  next();
});

const Story = model('Story', storySchema);

module.exports = Story;
