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
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = model('Request', requestSchema);

module.exports = Request;
