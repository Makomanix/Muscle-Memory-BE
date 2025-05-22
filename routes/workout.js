const express = require('express')
const { body, check } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth);

router.post('/', isAuth);

router.get('/:workoutId', isAuth);

router.patch('/:workoutId', isAuth);

router.delete('/:workoutId', isAuth);

router.get('/:type', isAuth);

router.get('/sessions', isAuth);

router.get('/:workoutId/sessions', isAuth);

router.get('/:workoutId/sessions/:sessionId', isAuth);

module.exports = router;