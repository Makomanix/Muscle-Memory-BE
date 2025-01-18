import mongoose from "mongoose";
const { Schema } = mongoose;

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
    name: {
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
    goals: [{
      type: String,
    }],
    image: {
      type: String,
      required: true
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
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;