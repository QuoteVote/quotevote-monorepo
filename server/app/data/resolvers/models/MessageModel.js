import mongoose from 'mongoose';

const schema = mongoose.Schema({
  messageRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  readBy: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  // Enhanced read receipts with timestamps
  readByDetailed: {
    type: [{
      userId: mongoose.Schema.Types.ObjectId,
      readAt: Date,
    }],
    default: [],
  },
  // Delivery receipts
  deliveredTo: {
    type: [{
      userId: mongoose.Schema.Types.ObjectId,
      deliveredAt: Date,
    }],
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Messages', schema);
