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
      default: Date.now,
    },
    expiresIn: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
    // expiresIn: {
    //   type: Date,
    //   default: function () {
    //     return new Date(Date.now() + (this.customExpiry || 24 * 60 * 60 * 1000)); // Allow custom expiry
    //   },
    // },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// storySchema.virtual('_friendIds', {
//   ref: 'Request',
//   localField: 'user',
//   foreignField: 'from',
//   justOne: false,
// });

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
    // match: { _id: { $in: this._friendIds } },
  });
  next();
});

const Story = model('Story', storySchema);

module.exports = Story;
