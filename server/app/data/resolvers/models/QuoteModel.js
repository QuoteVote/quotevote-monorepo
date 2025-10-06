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
  // Geolocal fields
  isLocal: {
    type: Boolean,
    default: false,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
    geohash: {
      type: String,
      required: false,
    },
  },
  placeLabel: {
    type: String,
    required: false,
  },
});

// Text search index
schema.index({ content: 'text' });

// Geospatial index for location-based queries (2dsphere for MongoDB geo queries)
schema.index({ location: '2dsphere' });

// Compound index for efficient local quote queries
schema.index({ isLocal: 1, created: -1 });
schema.index({ isLocal: 1, 'location.geohash': 1, created: -1 });

export default mongoose.model('Quotes', schema);
