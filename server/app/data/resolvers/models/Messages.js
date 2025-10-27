import mongoose from 'mongoose';

const schema = mongoose.Schema({
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
});

export default mongoose.model('messages', schema);
