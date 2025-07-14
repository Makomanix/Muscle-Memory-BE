const User = require('../models/user');

exports.getWorkouts = (req, res, next) => {
  const id = req.query.userId;
  console.log('userId', id);
  User.findById(id)
    .populate('workouts.exercises')
    .select('workouts')
    .then(currentUser => {
      if (!currentUser) {
        const error = new Error
      }
      let workouts = currentUser.workouts;
      console.log(workouts)
      return res.status(200).json(workouts)
    })
};

exports.createWorkout = (req, res, next) => {
  const id = req.body.userId;
  const workout = req.body.workout;
  console.log('req.body', req.body);
  console.log('userId', id);

  User.findById(id)
    .then(currentUser => {
      currentUser.workouts.push(workout);
      return currentUser.save()
    })
    .then(currentUser => {
      let workouts = currentUser.workouts
      console.log('currentUser.workouts before res', currentUser.workouts)
      return res.status(200).json(workouts)
  })
};

exports.deleteWorkout = (req, res, next) => {

  User.findOneAndUpdate()
};

exports.patchWorkout = (req, res, next) => {

};