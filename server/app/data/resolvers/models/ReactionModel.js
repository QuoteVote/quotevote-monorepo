const mongoose = require('mongoose');

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  actionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  emoji: {
    type: String,
    required: false,
  },
});

schema.index({ content: 'text' });

export default mongoose.model('reactions', schema);
