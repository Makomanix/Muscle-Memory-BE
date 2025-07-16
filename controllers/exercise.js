const { validationResult } = require('express-validator')

const User = require('../models/user')
const Exercise = require('../models/exercise')

exports.getExercises = (req, res, next) => {
  Exercise.find()
    .then(exercises => {
      console.log(exercises);
      res.status(200).json(exercises)
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
    console.log('Am i here?')
    throw error;
  };
  const name = req.body.name;
  const primary = req.body.primaryMuscle;
  const secondary = req.body.secondaryMuscle;
  const url = req.body.url;
  const exercise = new Exercise({
    name: name,
    primaryMuscle: primary,
    secondaryMuscle: secondary,
    videoUrl: url
  });
  return exercise.save()
    .then(savedDoc => {
      console.log('after exercise.save() before 201')
      res.status(201).json({
        message: 'Exercise created successfully!',
      })
    })
    .catch(error => {
      console.log('body', body);
      console.log('after exercise.save() in error')
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error)
    }); 
};

exports.patchExercise = (req, res, next) => {
  const name = req.body.name;
  const primaryMuscle = req.body.primaryMuscle;
  const secondaryMuscle = req.body.secondaryMuscle;
  const videoUrl = req.body.url
  const id = req.body.exerciseId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    console.log('Am i here?')
    throw error;
  };
  Exercise.findById(id)
    .then(foundExercise => {
      console.log('foundExercise', foundExercise);
      if(!foundExercise) {
        const error = new Error('Could not find matching exercise.');
        error.statusCode = 404;
        throw error;
      }
      foundExercise.name = name;
      foundExercise.primaryMuscle = primaryMuscle;
      foundExercise.secondaryMuscle = secondaryMuscle;
      foundExercise.videoUrl = videoUrl;

      return foundExercise.save();
    })
    .then(result => {
      res.status(201).json({ message: 'Exercise Updated!'})
    })
    .catch(error => {
      if(!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    })
};

exports.deleteExercise = (req, res, next) => {
  const id = req.body.id;
  Exercise.findByIdAndDelete(id)
    .then(deletedExercise => {
      if (!deletedExercise) {
        const error = new Error('Exercise not found');
        error.statusCode = 404;
        throw error;
      };

      res.status(200).json({message: 'Exercise deleted successfully'})
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};