const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getWorkouts = (req, res, next) => {
  const id = req.userId;
  console.log('userId!!!!', id);
  User.findById(id)
    .populate('workouts.exercises')
    .select('workouts')
    .then(currentUser => {
      if (!currentUser) {
        const error = new Error('No user found.')
      };
      let workouts = currentUser.workouts;
      console.log(workouts)
      return res.status(200).json(workouts)
    })
};

exports.createWorkout = (req, res, next) => {
  const errors = validationResult(req);
  if ( !errors.isEmpty() ) {
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  };
  const id = req.userId;
  const workout = req.body;
  console.log('req.body', req.body);
  console.log('userId', id);

  User.findById( id )
    .then(currentUser => {
      if ( !currentUser ) {
        const error = new Error('User not found. User required to create a workout.');
        error.statusCode = 404;
        throw error;
      }
      currentUser.workouts.push(workout);
      return currentUser.save()
    })
    .then( currentUser => {
      let workouts = currentUser.workouts
      return res.status(201).json({
        message: 'Workout created successfully!'
      })
    })
    .catch(error => {
      if ( !error.statusCode ) {
        error.statusCode = 500;
      }
      next(error);
    })
};

exports.deleteWorkout = (req, res, next) => {

  User.findOneAndUpdate()
};

exports.patchWorkout = (req, res, next) => {

};