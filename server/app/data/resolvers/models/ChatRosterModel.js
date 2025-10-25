import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  buddies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  requestsOut: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  requestsIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  blocked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  statusText: {
    type: String,
    maxlength: 140,
  },
});

export default mongoose.model('ChatRoster', schema);
