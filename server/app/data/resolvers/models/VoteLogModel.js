import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  voteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: String,
  author: String,
  description: {
    type: String,
    required: true,
  },
  action: String,
  tokens: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model('VoteLogs', schema);
