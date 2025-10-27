import mongoose from 'mongoose';

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: Number,
    required: false,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
});

export default mongoose.model('collections', schema);
