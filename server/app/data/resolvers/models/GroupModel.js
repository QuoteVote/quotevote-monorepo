import mongoose from 'mongoose';

const schema = mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  adminIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    defaultValue: [],
  },
  allowedUserIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    defaultValue: [],
  },
  pendingUserIds: {
    type: [mongoose.Schema.Types.ObjectId],
    defaultValue: [],
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  privacy: {
    type: String,
    required: true,
  },
});

export default mongoose.model('groups', schema);
