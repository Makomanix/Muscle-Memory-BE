const express = require('express')
const { body, check } = require('express-validator');

const workoutController = require('../controllers/workout');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', isAuth, workoutController.getWorkouts);

router.post(
  '/', 
  isAuth,
  [
    body('title')
      .trim()
      .notEmpty()
      .isLength({max: 20})
      .withMessage('Title length must be between 1 and 20 characters.'),
    body('type')
      .notEmpty()
      .withMessage('Workout type is missing.'),
    body('image')
      .notEmpty()
      .withMessage('Workout image is missing.'),
    body('exercises')
      .isArray({min: 1})
      .withMessage('Workouts must have at least 1 exercise.'),
    body('sessions')
      .isArray()
      .withMessage('Workout is missing sessions.')
  ], 
  workoutController.createWorkout
);

// router.get('/:workoutId', isAuth, workoutController);

router.patch(
  '/',
  isAuth,
  [
    body('newWorkout.title')
      .trim()
      .notEmpty()
      .isLength({max: 20})
      .withMessage('Title length must be between 1 and 20 characters.'),
    body('newWorkout.type')
      .notEmpty()
      .withMessage('Workout type is missing.'),
    body('newWorkout.image')
      .notEmpty()
      .withMessage('Workout image is missing.'),
    body('newWorkout.exercises')
      .isArray({min: 1})
      .withMessage('Workouts must have at least 1 exercise.'),
    body('newWorkout.sessions')
      .isArray()
      .withMessage('Workout is missing sessions.')
  ],
  workoutController.patchWorkout
);

router.delete('/', isAuth, workoutController.deleteWorkout);

// router.get('/:type', isAuth);

// router.get('/sessions', isAuth);

// router.get('/:workoutId/sessions', isAuth);

// router.get('/:workoutId/sessions/:sessionId', isAuth);

module.exports = router;

