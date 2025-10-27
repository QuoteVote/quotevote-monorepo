import mongoose from 'mongoose';

const schema = mongoose.Schema({
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
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  privacy: {
    type: String,
    required: true,
  },
});

export default mongoose.model('domains', schema);
