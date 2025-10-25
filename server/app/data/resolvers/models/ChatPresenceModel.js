import mongoose from 'mongoose';

const presenceStates = ['online', 'away', 'dnd', 'invisible'];

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  state: {
    type: String,
    enum: presenceStates,
    default: 'online',
  },
  statusText: {
    type: String,
    maxlength: 140,
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ChatPresence', schema);
