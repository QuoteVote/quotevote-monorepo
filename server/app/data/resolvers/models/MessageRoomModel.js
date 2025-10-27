import mongoose from 'mongoose';

const schema = mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  messageType: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MessageRoom', schema);
