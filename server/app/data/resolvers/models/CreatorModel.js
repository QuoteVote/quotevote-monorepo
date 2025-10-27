import mongoose from 'mongoose';

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    required: false,
    default: 'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png',
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  created: {
    type: Date,
    required: true,
  },
  options: {
    type: JSON,
    required: false,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
});

schema.index({ '$**': 'text' });

export default mongoose.model('creators', schema);
