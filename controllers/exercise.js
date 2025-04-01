const { validationResult } = require('express-validator')

const User = require('../models/user')
const Exercise = require('../models/exercise')

exports.getExercises = (req, res, next) => {
  Exercise.find()
    .then(exercises => {
      res.status(200).json({
        message: 'Fetched exercises successfully.',
        exercises: exercises
      })
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    })
};

exports.createExercise = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const primary = req.body.primaryMuscle;
  const secondary = req.body.secondaryMuscle;
  const url = req.body.secondaryMuscle;
  const exercise = new Exercise({
    name: name,
    primaryMuscle: primary,
    secondaryMuscle: secondary,
    url: url
  });
  post.save()
    .then(savedDoc => {
      res.status(201).json({
        message: 'Exercise created successfully!',
      })
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error)
    }); 
};

