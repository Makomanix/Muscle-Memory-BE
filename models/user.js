const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

const sessionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    exercises: [{
      name: {
        type: String,
        required: true
      },
      weight: {
        type: Number
      },
      sets: {
        type: Number
      },
      reps: {
        type: Number
      },
    }],
  }
)

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    type: [{
      type: String,
      required: true
    }],
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    }],
    creator: {
      type: String,
      required: true
    },
    sessions: [{
      type: sessionSchema
    }]
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user',
      required: true
    },
    goals: [{
      type: String,
    }],
    image: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: [{
      type: String
    }],
    workouts: [{
      type: workoutSchema,
    }],
    refreshToken: [String],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id },
    ACCESS_SECRET_KEY,
    { expiresIn: "30min" }
  );
  const refreshToken = jwt.sign(
    { _id: this._id },
    REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const tokens = { accessToken: accessToken, refreshToken: refreshToken };
  return tokens;
}

module.exports = mongoose.model('User', userSchema);

