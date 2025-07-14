const express = require('express')
const { body, check } = require('express-validator');

const workoutController = require('../controllers/workout');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', isAuth, workoutController.getWorkouts);

router.post('/', isAuth, workoutController.createWorkout);

// router.get('/:workoutId', isAuth, workoutController);

router.patch('/:workoutId', isAuth, workoutController.patchWorkout);

router.delete('/:workoutId', isAuth, workoutController.deleteWorkout);

// router.get('/:type', isAuth);

// router.get('/sessions', isAuth);

// router.get('/:workoutId/sessions', isAuth);

// router.get('/:workoutId/sessions/:sessionId', isAuth);

module.exports = router;

