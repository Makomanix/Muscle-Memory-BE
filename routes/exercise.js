const express = require('express')
const { body, check } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const exerciseController = require('../controllers/exercise');

const router = express.Router();

router.get('/', isAuth, exerciseController.getExercises);

router.post(
  '/', 
  isAuth, 
  isAdmin,
  [
    body('name')
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('Name group must be between 3 and 12 characters long'),
    body('primaryMuscle')
      .notEmpty()
      .isLength({min: 3, max: 12})
      .withMessage('Muscle group must be between 3 and 12 characters long'),
    body('secondaryMuscle')
      .notEmpty()
      .isLength({min: 3, max: 12})
      .withMessage('Muscle group must be between 3 and 12 characters long'),
    body('url')
      .isURL()
      .withMessage('Must be valid URL')
  ], 
  exerciseController.createExercise 
);

router.get('/:exerciseId', isAuth );

router.get('/:primary', isAuth);

router.get('/:secondary', isAuth)

// router.patch('/:exerciseId', isAuth, isAdmin);

// router.delete('/:exerciseId', isAuth, isAdmin);

module.exports = router;