const { Schema, model, Types } = require('mongoose');

const conversationSchema = new Schema(
  {
    members: [
      {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Types.ObjectId,
      ref: 'Message',
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

// conversationSchema.virtual('messages', {
//   ref: 'Message',
//   localField: '_id',
//   foreignField: 'conversation',
// });

conversationSchema.pre(/^find/, function (next) {
  this.populate(
    'members',
    '-email -role -cover -__v -bio -birthdate -updatedAt -createdAt'
  );
  next();
});

conversationSchema.pre(/^find/, function (next) {
  this.populate('lastMessage');
  next();
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;
