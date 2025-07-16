const mongoose = require('mongoose');

const schema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // can be either up or down
  type: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  startWordIndex: {
    type: Number,
    required: true,
  },
  endWordIndex: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
});

schema.index({ content: 'text' });
schema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model('votes', schema);
