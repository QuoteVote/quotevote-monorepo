const mongoose = require('mongoose');

const schema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quoter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quoted: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quote: String,
  created: {
    type: Date,
    required: true,
  },
  startWordIndex: {
    type: Number,
    required: false,
  },
  endWordIndex: {
    type: Number,
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

schema.index({ content: 'text' });

export default mongoose.model('Quotes', schema);
