const User = require('../models/user');

exports.getWorkouts = (req, res, next) => {
  const id = req.query.userId
  console.log('userId', id);
  User.findById(id)
    .then(currentUser => {
      let workouts = currentUser.workouts
      console.log(workouts)
      return res.status(200).json(workouts)
    })
};

exports.createWorkout = (req, res, next) => {

};

exports.deleteWorkout = (req, res, next) => {

};

exports.patchWorkout = (req, res, next) => {

};