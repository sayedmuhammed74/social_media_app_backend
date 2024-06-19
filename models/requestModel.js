const { model, Schema, Types } = require('mongoose');

const requestSchema = new Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User',
    required: ['true', 'Request must have a creator'],
  },
  to: {
    type: Types.ObjectId,
    ref: 'User',
    required: ['true', 'Request must have a reciever'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

requestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'from',
    select: '-email -role -createdAt -birthdate -bio -__v',
  }).populate({
    path: 'to',
    select: '-email -role -createdAt -birthdate -bio -__v',
  });
  next();
});

const Request = model('Request', requestSchema);

module.exports = Request;
