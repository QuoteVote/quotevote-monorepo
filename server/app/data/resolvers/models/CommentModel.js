const mongoose = require('mongoose');

const schema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  startWordIndex: {
    type: Number,
    required: true,
  },
  endWordIndex: {
    type: Number,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

schema.index({ content: 'text' });

export default mongoose.model('Comments', schema);
