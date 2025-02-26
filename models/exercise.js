const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    primaryMuscle: {
      type: String,
      required: true
    },
    secondaryMuscle: [{
      type: String,
      required: true
    }],
    videoUrl: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
