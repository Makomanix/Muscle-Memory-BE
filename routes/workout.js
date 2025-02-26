const express = require('express')
const { body, check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', );

router.post('/', );

router.get('/:workoutId', );

router.patch('/:workoutId', );

router.delete('/:workoutId', );

router.get('/:type', );

router.get('/sessions', );

router.get('/:workoutId/sessions', );

router.get('/:workoutId/sessions/:sessionId', );

module.exports = router;