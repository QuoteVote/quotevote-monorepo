import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userIdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  notificationType: {
    type: String,
    required: false,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  label: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: 'new',
  },
  created: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('notifications', schema);
